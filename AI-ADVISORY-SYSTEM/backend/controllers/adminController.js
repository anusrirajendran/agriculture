import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Chat from '../models/Chat.js';
import Feedback from '../models/Feedback.js';
import Article from '../models/Article.js';
import Scheme from '../models/Scheme.js';
import Notification from '../models/Notification.js';

// Seed initial articles if Knowledge Center is empty
const seedArticles = async (authorId) => {
  const count = await Article.countDocuments();
  if (count > 0) return;

  const defaultArticles = [
    {
      title: 'Introduction to Organic Farming Methods',
      category: 'Organic Farming',
      content: 'Organic farming is a production system that sustains the health of soils, ecosystems, and people. It relies on ecological processes, biodiversity and cycles adapted to local conditions, rather than the use of inputs with adverse effects. Primary tools include green manure, crop rotation, biological pest control, and specialized compost application.',
      author: authorId,
      language: 'en',
    },
    {
      title: 'A Guide to Smart Drip Irrigation Systems',
      category: 'Irrigation Techniques',
      content: 'Drip irrigation is a type of micro-irrigation system that has the potential to save water and nutrients by allowing water to drip slowly to the roots of plants, either from above the soil surface or buried below the surface. The goal is to place water directly into the root zone and minimize evaporation. It reduces water consumption by up to 60% compared to flood irrigation.',
      author: authorId,
      language: 'en',
    },
    {
      title: 'Hydroponics: Farming Without Soil',
      category: 'Hydroponics',
      content: 'Hydroponics is a type of horticulture and a subset of hydroculture which involves growing crops, usually crops, without soil, by using mineral nutrient solutions in an aqueous solvent. Terrestrial plants may grow with their roots exposed to the nutritious liquid, or the roots may be physically supported by an inert medium such as perlite, gravel, or coco peat.',
      author: authorId,
      language: 'en',
    },
    {
      title: 'Integrated Pest Management (IPM) Basics',
      category: 'Pest Control',
      content: 'Integrated pest management (IPM) is an effective and environmentally sensitive approach to pest management that relies on a combination of common-sense practices. IPM programs use current, comprehensive information on the life cycles of pests and their interaction with the environment. This information is used to manage pest damage by the most economical means, and with the least possible hazard to people, property, and the environment.',
      author: authorId,
      language: 'en',
    },
  ];

  await Article.insertMany(defaultArticles);
  console.log('Knowledge Center articles seeded successfully!');
};

// @desc    Get system-wide analytics for admin panel
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProfiles = await Profile.countDocuments();
    const totalChats = await Chat.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    
    // Average feedback rating
    const feedbackStats = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const averageRating = feedbackStats.length > 0 ? parseFloat(feedbackStats[0].avgRating.toFixed(1)) : 0;

    const totalSchemes = await Scheme.countDocuments();
    const totalArticles = await Article.countDocuments();

    // AI Usage summary (queries per day for chart)
    const chatStats = await Chat.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    const chartData = chatStats.map((item) => ({
      date: item._id,
      queries: item.count,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProfiles,
        totalChats,
        totalFeedback,
        averageRating,
        totalSchemes,
        totalArticles,
        aiUsageTrends: chartData.length > 0 ? chartData : [{ date: new Date().toISOString().split('T')[0], queries: 0 }],
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users and profiles
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsersAndProfiles = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    const profiles = await Profile.find().populate('user', 'name email mobile');

    res.status(200).json({
      success: true,
      data: {
        users,
        profiles,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Broadcast a global notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
export const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and message for broadcast',
      });
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'System',
      user: null, // null indicates global broadcast
    });

    res.status(201).json({
      success: true,
      message: 'Global notification broadcasted successfully',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all feedback submissions
// @route   GET /api/admin/feedback
// @access  Private/Admin
export const getFeedbackList = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit feedback (Used by normal users)
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment, category } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment',
      });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      rating,
      comment,
      category: category || 'General',
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all articles (Public/Private user view)
// @route   GET /api/articles
// @access  Private
export const getArticles = async (req, res) => {
  try {
    // Seed initial articles using the requesting user (or any user) as author
    await seedArticles(req.user.id);

    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    const categories = await Article.distinct('category');

    res.status(200).json({
      success: true,
      categories,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a new article
// @route   POST /api/admin/articles
// @access  Private/Admin
export const createArticle = async (req, res) => {
  try {
    const { title, category, content, imageUrl, language } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category and content',
      });
    }

    const article = await Article.create({
      title,
      category,
      content,
      imageUrl: imageUrl || '',
      language: language || 'en',
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete an article
// @route   DELETE /api/admin/articles/:id
// @access  Private/Admin
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a new government scheme
// @route   POST /api/admin/schemes
// @access  Private/Admin
export const createScheme = async (req, res) => {
  try {
    const { title, description, eligibility, benefits, documents, applicationProcess, link, language } = req.body;

    if (!title || !description || !eligibility || !benefits || !documents || !applicationProcess) {
      return res.status(400).json({
        success: false,
        message: 'Please fill out all required fields',
      });
    }

    const scheme = await Scheme.create({
      title,
      description,
      eligibility,
      benefits,
      documents: Array.isArray(documents) ? documents : documents.split(',').map((d) => d.trim()),
      applicationProcess,
      link: link || '',
      language: language || 'en',
    });

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a government scheme
// @route   DELETE /api/admin/schemes/:id
// @access  Private/Admin
export const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Government scheme not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Government scheme deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
