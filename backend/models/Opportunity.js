import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    ngo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }], 
    duration: { type: String },
    location: { type: String, required: true },
    status: {
      type: String,
      default: 'Open' 
    },
    imageUrl: { type: String, required: false }
  },
  { timestamps: true }
);


opportunitySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
  }
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;