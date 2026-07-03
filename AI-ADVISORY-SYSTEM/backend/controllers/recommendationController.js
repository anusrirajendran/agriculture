import Profile from '../models/Profile.js';
import { generateAISuggestion } from './aiController.js';

const recLangMap = {
  en: 'English',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  hi: 'Hindi',
};

// @desc    Get crop recommendations based on profile and weather
// @route   GET /api/recommendations/crops
// @access  Private
export const getCropRecommendations = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile to get personalized crop recommendations.',
      });
    }

    const lang = profile.preferredLanguage || 'en';
    const langName = recLangMap[lang] || 'English';

    const prompt = `Soil Type: ${profile.soilType}.
Irrigation Method: ${profile.irrigationMethod}.
Farm Size: ${profile.farmSize} acres.
Main Crops Currently Grown: ${profile.mainCrops.join(', ')}.
Location: ${profile.village}, ${profile.district}, ${profile.state}.

Recommend the top 3 best crops to grow for these parameters. For each crop, provide:
1. Crop Name
2. Expected Yield (per acre in quintals or tonnes)
3. Estimated Profit (in INR per acre)
4. Water Requirement details (Low/Medium/High, and watering frequency)
5. Fertilizer Schedule (base and top dressing)

Generate the response in ${langName}. Format as structured Markdown with headers for each crop. Do not include chat intro/outro.`;

    const recommendations = await generateAISuggestion(
      prompt,
      'You are a smart crop recommendation engine. Respond strictly in the target language in clean markdown format.',
      lang
    );

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get soil management guidance
// @route   GET /api/recommendations/soil
// @access  Private
export const getSoilManagement = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const lang = profile ? profile.preferredLanguage : 'en';
    const langName = recLangMap[lang] || 'English';
    const soilType = profile ? profile.soilType : 'Alluvial';

    const prompt = `Provide soil management guidance for a farmer with **${soilType}** soil.
Cover:
1. Soil fertility improvement steps
2. Ideal pH range and correction methods
3. Nutrient management (Nitrogen, Phosphorus, Potassium)
4. Organic matter addition & compost usage
5. Recommended crop rotation practices

Write the guidance in ${langName}. Format as Markdown with clear headings.`;

    const guidance = await generateAISuggestion(
      prompt,
      'You are a soil management advisor. Respond in the requested language.',
      lang
    );

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get irrigation management recommendations
// @route   GET /api/recommendations/irrigation
// @access  Private
export const getIrrigationManagement = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const lang = profile ? profile.preferredLanguage : 'en';
    const langName = recLangMap[lang] || 'English';
    const irrigation = profile ? profile.irrigationMethod : 'Drip Irrigation';
    const soil = profile ? profile.soilType : 'Clayey';

    const prompt = `Provide irrigation advice for a farmer using **${irrigation}** on **${soil}** soil.
Include:
1. Water conservation and rainwater harvesting methods.
2. Irrigation schedule suggestions (frequency based on season).
3. Recommended modern water-saving techniques.

Write the guidance in ${langName}. Format as Markdown.`;

    const guidance = await generateAISuggestion(
      prompt,
      'You are an irrigation management specialist. Respond in the requested language.',
      lang
    );

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get fertilizer suggestions
// @route   GET /api/recommendations/fertilizer
// @access  Private
export const getFertilizerSuggestions = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const lang = profile ? profile.preferredLanguage : 'en';
    const langName = recLangMap[lang] || 'English';
    const crops = profile ? profile.mainCrops.join(', ') : 'Rice, Wheat';
    const soil = profile ? profile.soilType : 'Alluvial';

    const prompt = `Provide fertilizer recommendations for growing **${crops}** in **${soil}** soil.
Provide details on:
1. Organic Fertilizers (manure, vermicompost)
2. Bio-fertilizers (Azotobacter, Rhizobium)
3. Chemical Fertilizers and recommended NPK Ratios
4. Quantity and timing schedule of application

Write the recommendation in ${langName}. Format as Markdown.`;

    const guidance = await generateAISuggestion(
      prompt,
      'You are a fertilizer advisor. Respond in the requested language.',
      lang
    );

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pest management advice
// @route   GET /api/recommendations/pest
// @access  Private
export const getPestManagement = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const lang = profile ? profile.preferredLanguage : 'en';
    const langName = recLangMap[lang] || 'English';
    const crops = profile ? profile.mainCrops.join(', ') : 'Cotton, Rice';

    const prompt = `Provide Integrated Pest Management (IPM) guidance for **${crops}**.
Detail:
1. Common pests for these crops and identification tips.
2. Organic & cultural pest control methods.
3. Biological control agents (beneficial insects, bio-pesticides).
4. Safe chemical treatments as a last resort.

Write the advice in ${langName}. Format as Markdown.`;

    const guidance = await generateAISuggestion(
      prompt,
      'You are a crop pest management expert. Respond in the requested language.',
      lang
    );

    res.status(200).json({
      success: true,
      data: guidance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
