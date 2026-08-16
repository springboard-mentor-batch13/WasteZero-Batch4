import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: subject,
      text: text, 
    });

    if (error) {
      console.error('Resend API Error details:', error);
      throw new Error(`Resend failed: ${error.message}`);
    }

    console.log('Email delivered successfully! ID:', data?.id);
    return data;
  } catch (err) {
    console.error('Failed to send email via Resend Service:', err.message);
    throw err;
  }
};

export default sendEmail;
