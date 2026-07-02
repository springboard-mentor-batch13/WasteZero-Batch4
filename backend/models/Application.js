import mongoose from 'mongoose';

export const APPLICATION_STATUS = ['pending', 'accepted', 'rejected'];

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: APPLICATION_STATUS, default: 'pending' },
  },
  { timestamps: true },
);

// A volunteer should only apply once per opportunity.
applicationSchema.index({ opportunity_id: 1, volunteer_id: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
