import mongoose from 'mongoose';

export const OPPORTUNITY_STATUS = ['open', 'in-progress', 'closed'];

const opportunitySchema = new mongoose.Schema(
  {
    // Creator of the opportunity / pickup (spec field: ngo_id).
    ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    // Waste categories / skills required (e.g. plastic, organic, e-waste).
    required_skills: [{ type: String }],
    duration: { type: String, default: '' },
    location: { type: String, required: true, trim: true },
    status: { type: String, enum: OPPORTUNITY_STATUS, default: 'open' },
  },
  { timestamps: true },
);

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
