import Message from '../models/Message.js';
import User from '../models/User.js';

const seedDemoMessages = async () => {
  if (process.env.NODE_ENV === 'production') return;

  const [admin, volunteers, ngos] = await Promise.all([
    User.findOne({ role: 'admin' }).select('_id name'),
    User.find({ role: 'volunteer' }).select('_id name'),
    User.find({ role: 'ngo' }).select('_id name'),
  ]);

  if (!admin || !volunteers.length || !ngos.length) {
    console.log('Demo messages skipped: admin, volunteer, and NGO accounts are required');
    return;
  }

  const volunteer = volunteers[0];
  const ngo = ngos[0];
  const now = Date.now();
  const demoMessages = [
    {
      demo_key: 'volunteer-ngo-pickup-question',
      sender_id: volunteer._id,
      receiver_id: ngo._id,
      content: 'Hello! I have plastic and paper waste ready for collection.',
      timestamp: new Date(now - 48 * 60 * 60 * 1000),
    },
    {
      demo_key: 'ngo-volunteer-pickup-reply',
      sender_id: ngo._id,
      receiver_id: volunteer._id,
      content: 'Thanks for reaching out. Please schedule a pickup and we will assign a collection slot.',
      timestamp: new Date(now - 47 * 60 * 60 * 1000),
    },
    {
      demo_key: 'volunteer-admin-profile-question',
      sender_id: volunteer._id,
      receiver_id: admin._id,
      content: 'Hi Admin, can I update the address on my upcoming pickup?',
      timestamp: new Date(now - 25 * 60 * 60 * 1000),
    },
    {
      demo_key: 'admin-volunteer-profile-reply',
      sender_id: admin._id,
      receiver_id: volunteer._id,
      content: 'Yes. Open Pickup History, update the request, or contact the assigned NGO for assistance.',
      timestamp: new Date(now - 24 * 60 * 60 * 1000),
    },
    {
      demo_key: 'ngo-admin-completion-report',
      sender_id: ngo._id,
      receiver_id: admin._id,
      content: 'We completed today’s recycling pickup and sorted the collected materials.',
      timestamp: new Date(now - 3 * 60 * 60 * 1000),
    },
    {
      demo_key: 'admin-ngo-completion-reply',
      sender_id: admin._id,
      receiver_id: ngo._id,
      content: 'Great work. The pickup status is now reflected in the platform report.',
      timestamp: new Date(now - 2 * 60 * 60 * 1000),
    },
  ];

  for (const [index, extraVolunteer] of volunteers.slice(1).entries()) {
    demoMessages.push(
      {
        demo_key: `admin-volunteer-welcome-${extraVolunteer._id}`,
        sender_id: admin._id,
        receiver_id: extraVolunteer._id,
        content: `Welcome ${extraVolunteer.name}! Your WasteZero volunteer account is ready.`,
        timestamp: new Date(now - (90 + index * 10) * 60 * 1000),
      },
      {
        demo_key: `ngo-volunteer-pickup-guide-${extraVolunteer._id}`,
        sender_id: ngo._id,
        receiver_id: extraVolunteer._id,
        content: 'Hello! Schedule a pickup whenever your recyclable waste is ready.',
        timestamp: new Date(now - (75 + index * 10) * 60 * 1000),
      },
    );
  }

  for (const [index, extraNgo] of ngos.slice(1).entries()) {
    demoMessages.push(
      {
        demo_key: `admin-ngo-welcome-${extraNgo._id}`,
        sender_id: admin._id,
        receiver_id: extraNgo._id,
        content: `Welcome ${extraNgo.name}! You can review and assign scheduled pickups from your dashboard.`,
        timestamp: new Date(now - (80 + index * 10) * 60 * 1000),
      },
      {
        demo_key: `volunteer-ngo-introduction-${extraNgo._id}`,
        sender_id: volunteer._id,
        receiver_id: extraNgo._id,
        content: 'Hello! I would like to learn more about your recycling collection services.',
        timestamp: new Date(now - (65 + index * 10) * 60 * 1000),
      },
    );
  }

  await Promise.all(
    demoMessages.map(({ demo_key, ...message }) =>
      Message.updateOne(
        { demo_key },
        { $setOnInsert: { demo_key, ...message } },
        { upsert: true },
      ),
    ),
  );

  console.log('Demo conversations ready for Admin, Volunteer, and NGO');
};

export default seedDemoMessages;
