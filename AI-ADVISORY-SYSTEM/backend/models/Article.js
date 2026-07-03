import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Organic Farming',
        'Smart Farming',
        'Greenhouse Farming',
        'Hydroponics',
        'Irrigation Techniques',
        'Fertilizer Management',
        'Crop Diseases',
        'Pest Control',
        'Government Policies',
        'Modern Agriculture',
      ],
    },
    content: {
      type: String,
      required: [true, 'Please add article content'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    language: {
      type: String,
      enum: ['en', 'ta', 'te', 'ml', 'kn', 'hi'],
      default: 'en',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model('Article', articleSchema);
export default Article;
