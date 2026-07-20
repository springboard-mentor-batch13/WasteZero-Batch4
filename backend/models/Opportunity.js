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

opportunitySchema.index({ ngo_id: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ location: 1 });
opportunitySchema.index({ title: 'text', description: 'text', required_skills: 'text' }); 

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
