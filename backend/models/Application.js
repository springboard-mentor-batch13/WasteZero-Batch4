import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity', // Reference to the opportunity applied for[cite: 1]
      required: true
    },
    volunteer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the volunteer who applied[cite: 1]
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], // Application status[cite: 1]
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;