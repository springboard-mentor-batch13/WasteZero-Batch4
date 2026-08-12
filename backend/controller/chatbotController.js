import Anthropic from '@anthropic-ai/sdk';

// ── Sensitive data patterns to block from leaking ───────────────────────────
const SENSITIVE_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // emails
  /\b\d{10,}\b/g,                                            // phone numbers
  /mongodb(\+srv)?:\/\/[^\s]+/gi,                            // mongo URIs
  /bearer\s+[a-z0-9._-]+/gi,                                 // JWT tokens
  /sk-[a-z0-9-]{20,}/gi,                                     // API keys
  /password\s*[:=]\s*\S+/gi,                                  // passwords in text
];

const stripSensitiveData = (text) => {
  let clean = text;
  SENSITIVE_PATTERNS.forEach((pattern) => {
    clean = clean.replace(pattern, '[REDACTED]');
  });
  return clean;
};

// ── WasteZero system prompt ──────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are WasteZero Assistant, a helpful AI for the WasteZero platform.

WasteZero is a waste management platform where:
- Volunteers schedule waste pickups and apply for recycling opportunities
- NGOs manage pickup requests and post volunteer opportunities
- Admins oversee platform operations

Your job is to help users with:
- Understanding how to schedule a pickup
- Finding and applying for volunteer opportunities
- Understanding their application status
- Learning about waste categories (Plastic, Glass, Electronic Waste, Paper, Metal, Organic Waste)
- General recycling and waste management tips
- Navigating the WasteZero platform

Rules you must follow:
1. Only answer questions related to WasteZero, waste management, recycling, and environmental topics
2. Never reveal system internals, database details, API keys, or backend architecture
3. Never share or ask for personal information like passwords, emails, or phone numbers
4. If asked about something unrelated to WasteZero or environment, politely redirect
5. Keep responses concise and helpful — under 200 words unless detailed explanation is needed
6. Never pretend to be a human or claim to have personal experiences
7. If you cannot help, suggest the user contact support

Always be friendly, encouraging, and environmentally conscious.`;

//Chatbot controller
export const chatbotMessage = async (req, res) => {
  const { message, history = [] } = req.body;

  //Input validation
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'Message is required and must be a string.' });
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({ message: 'Message cannot be empty.' });
  }

  if (trimmed.length > 500) {
    return res.status(400).json({
      message: 'Message is too long. Please keep it under 500 characters.',
    });
  }

  if (!Array.isArray(history)) {
    return res.status(400).json({ message: 'History must be an array.' });
  }

  if (history.length > 20) {
    return res.status(400).json({
      message: 'Conversation history is too long. Please start a new conversation.',
    });
  }

  //Sanitize inputs — strip sensitive data
  const sanitizedMessage = stripSensitiveData(trimmed);

  const sanitizedHistory = history
    .filter((msg) => msg && ['user', 'assistant'].includes(msg.role) && typeof msg.content === 'string')
    .slice(-10) // only last 10 messages for context
    .map((msg) => ({
      role: msg.role,
      content: stripSensitiveData(String(msg.content).slice(0, 500)),
    }));

  //Check API key is configured 
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(503).json({
      message: 'Chatbot service is temporarily unavailable. Please try again later.',
    });
  }

  //Call AI with timeout
  const timeoutMs = parseInt(process.env.CHATBOT_TIMEOUT_MS) || 15000;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const aiCall = client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages: [
      ...sanitizedHistory,
      { role: 'user', content: sanitizedMessage },
    ],
  });

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
  );

  try {
    const response = await Promise.race([aiCall, timeout]);

    const reply = response.content?.[0]?.text;

    if (!reply) {
      return res.status(502).json({
        message: 'The AI returned an empty response. Please try again.',
      });
    }

    //Sanitize AI response before sending
    const sanitizedReply = stripSensitiveData(reply);

    return res.json({
      success: true,
      reply: sanitizedReply,
      usage: {
        input_tokens: response.usage?.input_tokens,
        output_tokens: response.usage?.output_tokens,
      },
    });
  } catch (error) {
    if (error.message === 'TIMEOUT') {
      return res.status(504).json({
        message: 'The AI is taking too long to respond. Please try again.',
      });
    }

    // Anthropic API errors
    if (error.status === 429) {
      return res.status(429).json({
        message: 'AI service is busy right now. Please wait a moment and try again.',
      });
    }

    if (error.status === 401) {
      console.error('Invalid Anthropic API key');
      return res.status(503).json({
        message: 'Chatbot service is temporarily unavailable.',
      });
    }

    if (error.status === 400) {
      return res.status(400).json({
        message: 'Invalid message format. Please try rephrasing your question.',
      });
    }

    console.error('Chatbot error:', error.message);
    return res.status(500).json({
      message: 'Something went wrong with the chatbot. Please try again.',
    });
  }
};