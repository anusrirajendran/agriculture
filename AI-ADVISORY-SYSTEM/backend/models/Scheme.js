import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a scheme title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a scheme description'],
    },
    eligibility: {
      type: String,
      required: [true, 'Please add eligibility criteria'],
    },
    benefits: {
      type: String,
      required: [true, 'Please add benefits information'],
    },
    documents: {
      type: [String],
      required: [true, 'Please list required documents'],
    },
    applicationProcess: {
      type: String,
      required: [true, 'Please describe application steps'],
    },
    link: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['en', 'ta', 'te', 'ml', 'kn', 'hi'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
