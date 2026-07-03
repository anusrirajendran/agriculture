import Scheme from '../models/Scheme.js';

// Seed initial government schemes if collection is empty
const seedSchemes = async () => {
  const count = await Scheme.countDocuments();
  if (count > 0) return;

  const defaultSchemes = [
    {
      title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      description: 'An initiative by the Government of India that provides up to INR 6,000 per year in three equal installments to all small and marginal farmers as minimum income support.',
      eligibility: 'All landholding farmer families with cultivable landholding in their names are eligible.',
      benefits: 'Financial benefit of INR 6,000 per annum, directly transferred to the bank accounts of farmers.',
      documents: ['Aadhaar Card', 'Landholding Documents / Patta', 'Bank Account Details', 'Mobile Number'],
      applicationProcess: 'Farmers can register online via the PM-KISAN Portal, through Common Service Centers (CSCs), or by submitting details to local revenue offices.',
      link: 'https://pmkisan.gov.in/',
      language: 'en',
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      description: 'A government-sponsored crop insurance scheme that integrates multiple stakeholders, providing insurance coverage and financial support to farmers in the event of crop failure.',
      eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas are eligible.',
      benefits: 'Low premium rates (1.5% to 2% for foodgrains, 5% for commercial/horticultural crops) with full claim payment against crop damage from natural calamities.',
      documents: ['Land Records / Land Lease Agreement', 'Sowing Certificate', 'Aadhaar Card', 'Bank Passbook'],
      applicationProcess: 'Apply online through the PMFBY portal or visit the nearest bank branch, cooperative society, or insurance agent within 72 hours of crop sowing.',
      link: 'https://pmfby.gov.in/',
      language: 'en',
    },
    {
      title: 'Soil Health Card Scheme',
      description: 'Under this scheme, the government issues Soil Health Cards to farmers which carry crop-wise recommendations of nutrients and fertilizers required for individual farms.',
      eligibility: 'All farmers across the country holding cultivable agricultural lands.',
      benefits: 'Enables farmers to understand soil nutrient deficiencies, helping them apply correct dosage of fertilizers to optimize yields and save costs.',
      documents: ['Aadhaar Card', 'Land ownership details', 'Soil Sample ID (provided during collection)'],
      applicationProcess: 'Soil samples are collected by agriculture officers, tested in labs, and cards are issued. Farmers can download their cards from the Soil Health portal.',
      link: 'https://soilhealth.dac.gov.in/',
      language: 'en',
    },
    {
      title: 'National Agriculture Market (e-NAM)',
      description: 'An online trading portal for agricultural commodities in India. The portal facilitates farmers, traders, and buyers with online trading in commodities.',
      eligibility: 'All farmers, farmer organizations (FPOs), and traders dealing in agricultural produce.',
      benefits: 'Access to countrywide online markets, transparent price discovery, and direct online payments into bank accounts.',
      documents: ['Aadhaar Card', 'Bank Details', 'Mandi License (for traders)', 'Mobile Number'],
      applicationProcess: 'Register online via the e-NAM portal or complete registration at any e-NAM integration APMC Mandi.',
      link: 'https://enam.gov.in/',
      language: 'en',
    },
  ];

  await Scheme.insertMany(defaultSchemes);
  console.log('Government schemes database seeded successfully!');
};

// @desc    Get all government schemes
// @route   GET /api/schemes
// @access  Private
export const getSchemes = async (req, res) => {
  try {
    await seedSchemes();

    const { search, lang } = req.query;
    let query = {};

    if (lang) {
      query.language = lang;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { eligibility: { $regex: search, $options: 'i' } },
      ];
    }

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single scheme details
// @route   GET /api/schemes/:id
// @access  Private
export const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Government scheme not found',
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
