import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    required_skills: [{ type: String }],
    duration: {
      type: String,
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'in-progress'],
      default: 'open'
    },
    image_url: {
      type: String,
      default: ''
    },
    date: {
      type: Date
    },
  },
  { timestamps: true }
);

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
