import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/authController.js';

import {
  getProfile,
  saveProfile,
} from '../controllers/profileController.js';

import {
  sendMessageToAI,
  getChats,
  getChatById,
  deleteChat,
} from '../controllers/aiController.js';

import { getWeatherData } from '../controllers/weatherController.js';

import { diagnoseCropDisease } from '../controllers/diseaseController.js';

import {
  getCropRecommendations,
  getSoilManagement,
  getIrrigationManagement,
  getFertilizerSuggestions,
  getPestManagement,
} from '../controllers/recommendationController.js';

import {
  getMarketPrices,
  getMarketPriceById,
} from '../controllers/marketController.js';

import {
  getSchemes,
  getSchemeById,
} from '../controllers/schemeController.js';

import {
  getAnalytics,
  getUsersAndProfiles,
  broadcastNotification,
  getFeedbackList,
  submitFeedback,
  getArticles,
  createArticle,
  deleteArticle,
  createScheme,
  deleteScheme,
} from '../controllers/adminController.js';

import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from '../controllers/notificationController.js';

const router = express.Router();

// --- AUTHENTICATION ROUTES ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgotpassword', forgotPassword);
router.put('/auth/resetpassword/:resettoken', resetPassword);
router.get('/auth/logout', protect, logout);
router.get('/auth/me', protect, getMe);

// --- FARMER PROFILE ROUTES ---
router.get('/profile', protect, getProfile);
router.post('/profile', protect, saveProfile);

// --- AI ASSISTANT ROUTES ---
router.post('/ai/chat', protect, sendMessageToAI);
router.get('/ai/chats', protect, getChats);
router.get('/ai/chats/:id', protect, getChatById);
router.delete('/ai/chats/:id', protect, deleteChat);

// --- WEATHER MODULE ROUTES ---
router.get('/weather', protect, getWeatherData);

// --- CROP DISEASE ADVISORY ROUTES ---
router.post('/disease/diagnose', protect, upload.single('image'), diagnoseCropDisease);

// --- SMART FARMING RECOMMENDATION ROUTES ---
router.get('/recommendations/crops', protect, getCropRecommendations);
router.get('/recommendations/soil', protect, getSoilManagement);
router.get('/recommendations/irrigation', protect, getIrrigationManagement);
router.get('/recommendations/fertilizer', protect, getFertilizerSuggestions);
router.get('/recommendations/pest', protect, getPestManagement);

// --- MARKET PRICE ROUTES ---
router.get('/market/prices', protect, getMarketPrices);
router.get('/market/prices/:id', protect, getMarketPriceById);

// --- GOVERNMENT SCHEME ROUTES ---
router.get('/schemes', protect, getSchemes);
router.get('/schemes/:id', protect, getSchemeById);

// --- KNOWLEDGE CENTER ARTICLES ---
router.get('/articles', protect, getArticles);

// --- NOTIFICATION ALERTS ROUTES ---
router.get('/notifications', protect, getNotifications);
router.get('/notifications/unread', protect, getUnreadCount);
router.put('/notifications/:id/read', protect, markAsRead);

// --- FEEDBACK ROUTE ---
router.post('/feedback', protect, submitFeedback);

// --- ADMIN SYSTEM ROUTES ---
router.get('/admin/analytics', protect, authorize('admin'), getAnalytics);
router.get('/admin/users', protect, authorize('admin'), getUsersAndProfiles);
router.post('/admin/notifications', protect, authorize('admin'), broadcastNotification);
router.get('/admin/feedback', protect, authorize('admin'), getFeedbackList);

router.post('/admin/articles', protect, authorize('admin'), createArticle);
router.delete('/admin/articles/:id', protect, authorize('admin'), deleteArticle);

router.post('/admin/schemes', protect, authorize('admin'), createScheme);
router.delete('/admin/schemes/:id', protect, authorize('admin'), deleteScheme);

export default router;
