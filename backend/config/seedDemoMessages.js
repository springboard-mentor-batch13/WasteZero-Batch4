import Application from '../models/Application.js';
import Message from '../models/Message.js';
import Opportunity from '../models/Opportunity.js';
import User from '../models/User.js';

const seedDemoMessages = async () => {
  if (process.env.NODE_ENV === 'production') return;

  const [admin, volunteers, ngos] = await Promise.all([
    User.findOne({ role: 'admin' }).select('_id name'),
    User.find({ role: 'volunteer' }).select('_id name'),
    User.find({ role: 'ngo' }).select('_id name'),
  ]);

  if (!admin) {
    console.log('Demo messages skipped: an admin account is required');
    return;
  }

  const now = Date.now();
  const demoMessages = [];

  const acceptedApplications = await Application.find({ status: 'accepted' }).lean();
  const acceptedOpportunities = await Opportunity.find({
    _id: { $in: acceptedApplications.map(({ opportunity_id }) => opportunity_id) },
  }).select('_id ngo_id').lean();
  const ngoByOpportunity = new Map(
    acceptedOpportunities.map(({ _id, ngo_id }) => [_id.toString(), ngo_id]),
  );

  for (const [index, application] of acceptedApplications.entries()) {
    const ngoId = ngoByOpportunity.get(application.opportunity_id.toString());
    if (!ngoId) continue;

    demoMessages.push(
      {
        demo_key: `accepted-volunteer-ngo-${application._id}`,
        sender_id: application.volunteer_id,
        receiver_id: ngoId,
        content: 'Thank you for accepting my application. I am looking forward to volunteering!',
        timestamp: new Date(now - (60 + index * 5) * 60 * 1000),
      },
      {
        demo_key: `accepted-ngo-volunteer-${application._id}`,
        sender_id: ngoId,
        receiver_id: application.volunteer_id,
        content: 'Welcome to the team! We will share the opportunity details with you here.',
        timestamp: new Date(now - (55 + index * 5) * 60 * 1000),
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

  console.log('Role-safe demo conversations ready');
};

export default seedDemoMessages;