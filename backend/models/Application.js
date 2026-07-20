import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true
    },
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

applicationSchema.index({ volunteer_id: 1 });
applicationSchema.index({ opportunity_id: 1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;