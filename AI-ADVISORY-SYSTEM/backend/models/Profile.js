import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    district: {
      type: String,
      required: [true, 'Please add a district'],
    },
    village: {
      type: String,
      required: [true, 'Please add a village'],
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'ta', 'te', 'ml', 'kn', 'hi'],
      default: 'en',
    },
    farmSize: {
      type: Number,
      required: [true, 'Please add farm size in acres'],
    },
    soilType: {
      type: String,
      required: [true, 'Please select a soil type'],
    },
    irrigationMethod: {
      type: String,
      required: [true, 'Please select an irrigation method'],
    },
    mainCrops: {
      type: [String],
      required: [true, 'Please specify main crops grown'],
    },
    farmingExperience: {
      type: Number,
      required: [true, 'Please add farming experience in years'],
    },
    annualIncome: {
      type: Number,
      required: [true, 'Please add annual income in INR'],
    },
    farmingGoals: {
      type: String,
      required: [true, 'Please specify your farming goals'],
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
