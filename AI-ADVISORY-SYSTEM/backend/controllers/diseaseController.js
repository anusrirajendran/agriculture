import fs from 'fs';
import path from 'path';
import axios from 'axios';
import Profile from '../models/Profile.js';

// Safe helper to obtain Groq API Key
const getGroqApiKey = () => {
  return process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'YOUR_GROQ_API_KEY'
    ? process.env.GROQ_API_KEY
    : null;
};

const diseaseLangMap = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  ml: 'Malayalam (മലയാളം)',
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिन्दी)',
};

// @desc    Analyze crop disease from symptom description & image
// @route   POST /api/disease/diagnose
// @access  Private
export const diagnoseCropDisease = async (req, res) => {
  try {
    const { crop, symptoms } = req.body;

    if (!crop || !symptoms) {
      // Clean up uploaded file if validation fails
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please provide both crop name and description of symptoms',
      });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    const lang = profile ? profile.preferredLanguage : 'en';
    const langName = diseaseLangMap[lang] || 'English';

    // Construct image URL to send back to client
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    let diagnosisText = '';
    const apiKey = getGroqApiKey();

    if (apiKey && req.file) {
      // Multimodal Image Diagnosis with Llama 3.2 Vision
      try {
        const base64Image = fs.readFileSync(req.file.path).toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

        const prompt = `Crop: ${crop}. 
Symptoms description: ${symptoms}.
Analyze this image and identify the crop disease. 

Provide a detailed response in ${langName} covering:
1. Disease Name (and scientific name)
2. Main Causes
3. Severity Level (Low, Medium, High)
4. Organic / Biological Treatment
5. Chemical Treatment
6. Prevention Methods
7. Best Farming Practices for recovery

Format the response beautifully in Markdown with clear headers, bullet points, and sections.`;

        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.2-11b-vision-preview',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: prompt },
                  {
                    type: 'image_url',
                    image_url: {
                      url: dataUrl,
                    },
                  },
                ],
              },
            ],
            temperature: 0.2,
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        diagnosisText = response.data.choices[0].message.content;
      } catch (error) {
        console.error('Groq image diagnosis failed, using fallback:', error.response?.data || error.message);
        diagnosisText = getOfflineDiseaseResponse(crop, symptoms, lang);
      }
    } else if (apiKey) {
      // Text-only Diagnosis with Llama 3.3
      try {
        const prompt = `Crop: ${crop}. 
Symptoms description: ${symptoms}.
Identify the possible crop disease based on these symptoms.

Provide a detailed response in ${langName} covering:
1. Potential Disease Name
2. Main Causes
3. Severity Level
4. Organic / Biological Treatment
5. Chemical Treatment
6. Prevention Methods

Format the response in Markdown.`;

        const response = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        diagnosisText = response.data.choices[0].message.content;
      } catch (error) {
        console.error('Groq text-only diagnosis failed, using fallback:', error.response?.data || error.message);
        diagnosisText = getOfflineDiseaseResponse(crop, symptoms, lang);
      }
    } else {
      // Completely offline fallback
      diagnosisText = getOfflineDiseaseResponse(crop, symptoms, lang);
    }

    res.status(200).json({
      success: true,
      data: {
        crop,
        symptoms,
        imageUrl,
        diagnosis: diagnosisText,
      },
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Localized Offline Disease Database for fallback
const getOfflineDiseaseResponse = (crop, symptoms, lang) => {
  const reports = {
    en: `### Crop Disease Analysis Report (Demo)
- **Crop Analysed**: ${crop}
- **Symptoms Described**: ${symptoms}
- **Predicted Disease**: **Powdery Mildew** (Erysiphe polygoni)
- **Severity**: **Medium**

#### Causes
- High humidity combined with moderate temperatures.
- Overcrowded planting blocking ventilation.

#### Organic Treatment
- Spray Neem Oil formulation (1-2% solution in water with a few drops of soap) every 7-10 days.
- Apply Baking Soda solution (3g/L) mixed with horticultural oil to disrupt fungal spores.

#### Chemical Treatment
- Spray Carbendazim 50 WP @ 1g/liter of water or Hexaconazole 5 EC @ 2ml/liter.

#### Prevention Methods
- Plant resistant crop varieties.
- Maintain adequate crop spacing to promote air circulation.
- Water at the base of the plant rather than overhead watering.`,
    hi: `### फसल रोग विश्लेषण रिपोर्ट (डेमो)
- **फसल**: ${crop}
- **लक्षण**: ${symptoms}
- **संभावित रोग**: **चूर्णी फफूंदी (Powdery Mildew)**
- **तीव्रता**: **मध्यम**

#### कारण
- उच्च आर्द्रता और मध्यम तापमान।
- हवा के आवागमन को अवरुद्ध करने वाली सघन बुवाई।

#### जैविक उपचार
- नीम का तेल (1-2% घोल) हर 7-10 दिनों में छिड़कें।
- बेकिंग सोडा घोल (3 ग्राम/लीटर) छिड़कें।

#### रासायनिक उपचार
- कार्बेन्डाजिम 50 WP @ 1 ग्राम/लीटर या हेक्साकोनाज़ोल 5 EC @ 2 मिली/लीटर छिड़कें।

#### बचाव
- रोग प्रतिरोधी बीज बोएं।
- फसल के बीच उचित दूरी रखें।`
  };

  return reports[lang] || reports['en'];
};
