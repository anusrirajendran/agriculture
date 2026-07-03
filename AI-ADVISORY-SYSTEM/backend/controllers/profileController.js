import Profile from '../models/Profile.js';

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email mobile');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please complete profile setup.',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create or update profile
// @route   POST /api/profile
// @access  Private
export const saveProfile = async (req, res) => {
  try {
    const {
      state,
      district,
      village,
      preferredLanguage,
      farmSize,
      soilType,
      irrigationMethod,
      mainCrops,
      farmingExperience,
      annualIncome,
      farmingGoals,
    } = req.body;

    const profileFields = {
      user: req.user.id,
      state,
      district,
      village,
      preferredLanguage,
      farmSize,
      soilType,
      irrigationMethod,
      mainCrops: Array.isArray(mainCrops) ? mainCrops : mainCrops.split(',').map((c) => c.trim()),
      farmingExperience,
      annualIncome,
      farmingGoals,
    };

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
