import axios from 'axios';
import Chat from '../models/Chat.js';
import Profile from '../models/Profile.js';

// Language Map for Prompts
const languageNameMap = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  ml: 'Malayalam (മലയാളം)',
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिन्दी)',
};

// Safe helper to obtain Groq API Key
const getGroqApiKey = () => {
  return process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'YOUR_GROQ_API_KEY'
    ? process.env.GROQ_API_KEY
    : null;
};

// Helper to generate content from Groq with fallback
export const generateAISuggestion = async (prompt, systemInstruction = '', preferredLang = 'en') => {
  try {
    const apiKey = getGroqApiKey();
    if (!apiKey) {
      console.warn('Groq API Key is not configured. Using fallback offline mock response.');
      return getOfflineMockResponse(prompt, preferredLang);
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API call failed:', error.response?.data || error.message);
    return getOfflineMockResponse(prompt, preferredLang, error.message);
  }
};

// Offline fallback suggestions to keep the platform 100% functional
const getOfflineMockResponse = (prompt, lang, errorMsg = '') => {
  const isEn = lang === 'en';
  const prefix = errorMsg ? `[Offline Mode - API Error: ${errorMsg}]\n\n` : '[Offline Demo Mode]\n\n';

  const responses = {
    en: {
      crop: "Based on your soil and water parameters, I highly recommend growing **Rice (Kharif)** or **Maize** in the wet season, and **Chickpeas (Gram)** or **Mustard** in the dry season. Rotate with legumes like Mungbean to fix nitrogen and improve soil quality.",
      fertilizer: "To improve your soil health, apply **NPK fertilizer** in a 4:2:1 ratio. For organic farming, mix 5 tonnes of **farmyard manure** or compost per acre and apply neem cake to repel soil-borne pests.",
      disease: "The symptoms indicate **Blast disease (Magnaporthe oryzae)**. \n\n**Solutions:**\n- *Organic:* Spray Pseudomonas fluorescens liquid formulation @ 0.5% (5ml/L).\n- *Chemical:* Spray Tricyclazole 75 WP @ 1g/L of water. \n- *Prevention:* Avoid excess nitrogen fertilizers and use disease-resistant seeds.",
      general: "Ensure proper irrigation scheduling (drip for row crops). Clean your fields of weeds and implement crop rotation to break pest cycles. Feel free to set up your profile for more localized advice!"
    },
    hi: {
      crop: "आपकी मिट्टी और पानी के मापदंडों के आधार पर, मैं गीले मौसम में **धान** या **मक्का**, और सूखे मौसम में **चना** या **सरसों** उगाने की सलाह देता हूँ। मिट्टी की गुणवत्ता में सुधार के लिए फसलों को बदल-बदल कर लगाएं।",
      fertilizer: "मिट्टी के स्वास्थ्य में सुधार के लिए, 4:2:1 के अनुपात में **एनपीके उर्वरक** डालें। जैविक खेती के लिए, प्रति एकड़ 5 टन **गोबर की खाद** डालें और नीम की खली का प्रयोग करें।",
      disease: "लक्षण **ब्लास्ट रोग** की ओर इशारा करते हैं। \n\n**उपचार:**\n- *जैविक:* स्यूडोमोनास फ्लोरेसेंस @ 0.5% का छिड़काव करें।\n- *रासायनिक:* ट्राइसाइक्लाजोल 75 WP @ 1 ग्राम/लीटर का छिड़काव करें।\n- *बचाव:* अतिरिक्त नाइट्रोजन से बचें।",
      general: "उचित सिंचाई (ड्रिप सिंचाई) का उपयोग करें। खरपतवार निकालें और कीट चक्र को तोड़ने के लिए फसल चक्र अपनाएं।"
    },
    ta: {
      crop: "உங்கள் மண் மற்றும் நீர் நிலைகளின் அடிப்படையில், மழைக்காலத்தில் **நெல்** அல்லது **சோளம்**, மற்றும் வறண்ட காலத்தில் **கொண்டைக்கடலை** அல்லது **கடுகு** பயிரிட பரிந்துரைக்கிறேன்.",
      fertilizer: "மண் வளத்தை மேம்படுத்த 4:2:1 விகிதத்தில் **NPK உரங்களை** இடவும். இயற்கை விவசாயத்திற்கு, ஏக்கருக்கு 5 டன் **தொழு உரம்** மற்றும் வேப்பம் புண்ணாக்கு பயன்படுத்தவும்.",
      disease: "அறிகுறிகள் **குலை நோய்** (Blast disease) தாக்குதலைக் காட்டுகின்றன. \n\n**தீர்வுகள்:**\n- *இயற்கை:* சூடோமோனாஸ் புளோரசன்ஸ் 0.5% தெளிக்கவும்.\n- *வேதியியல்:* டிரைசைக்ளசோல் 75 WP 1 கிராம்/லிட்டர் தெளிக்கவும்.",
      general: "முறையான நீர் மேலாண்மை (சொட்டு நீர் பாசனம்) மேற்கொள்ளவும். பயிர் சுழற்சி முறையை கடைபிடிக்கவும்."
    }
  };

  const selectedSet = responses[lang] || responses['en'];
  const lowercasePrompt = prompt.toLowerCase();

  let responseBody = selectedSet.general;
  if (lowercasePrompt.includes('crop') || lowercasePrompt.includes('grow') || lowercasePrompt.includes('பயிர்') || lowercasePrompt.includes('फसल')) {
    responseBody = selectedSet.crop;
  } else if (lowercasePrompt.includes('fertilizer') || lowercasePrompt.includes('npk') || lowercasePrompt.includes('உரம்') || lowercasePrompt.includes('खाद')) {
    responseBody = selectedSet.fertilizer;
  } else if (lowercasePrompt.includes('disease') || lowercasePrompt.includes('yellow') || lowercasePrompt.includes('இலை') || lowercasePrompt.includes('बीमारी')) {
    responseBody = selectedSet.disease;
  }

  return prefix + responseBody;
};

// @desc    Send a message to AI Assistant
// @route   POST /api/ai/chat
// @access  Private
export const sendMessageToAI = async (req, res) => {
  try {
    const { query, chatId } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a query' });
    }

    // Get farmer profile to extract preferred language and details
    const profile = await Profile.findOne({ user: req.user.id });
    const lang = profile ? profile.preferredLanguage : 'en';
    const langName = languageNameMap[lang] || 'English';

    // Construct profile context for Gemini
    let profileContext = '';
    if (profile) {
      profileContext = `Farmer Info: Location is ${profile.village}, ${profile.district}, ${profile.state}. Farm size is ${profile.farmSize} acres. Soil: ${profile.soilType}. Irrigation: ${profile.irrigationMethod}. Main crops: ${profile.mainCrops.join(', ')}. Experience: ${profile.farmingExperience} years. Goal: ${profile.farmingGoals}.`;
    }

    const systemInstruction = `You are HarvestIQ, a professional AI Agricultural Advisor. You provide clear, step-by-step guidance, best practices, prevention methods, organic treatments, and chemical solutions for farmers.
${profileContext}
The farmer's preferred language is ${langName}. You MUST write your entire response only in ${langName}. Translate terms where helpful but answer in the native script. Be encouraging, precise, and practical.`;

    let chat;
    let geminiPrompt = query;

    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user.id });
      if (!chat) {
        return res.status(404).json({ success: false, message: 'Chat session not found' });
      }

      // Format conversation history for prompt
      const historyStr = chat.messages
        .slice(-8) // limit history context to last 8 messages
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
      geminiPrompt = `Here is our conversation history:\n${historyStr}\n\nUser: ${query}\nAssistant:`;
    } else {
      // Auto-summarize a short title based on query
      const words = query.split(' ').slice(0, 4).join(' ');
      const title = words.length > 30 ? words.substring(0, 30) + '...' : words || 'New Inquiry';

      chat = new Chat({
        user: req.user.id,
        title: title,
        language: lang,
        messages: [],
      });
    }

    // Add user message to local history
    chat.messages.push({ role: 'user', content: query });

    // Call Gemini API
    const aiResponse = await generateAISuggestion(geminiPrompt, systemInstruction, lang);

    // Add model response
    chat.messages.push({ role: 'model', content: aiResponse });

    // Save Chat
    await chat.save();

    res.status(200).json({
      success: true,
      chatId: chat._id,
      chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's chat sessions
// @route   GET /api/ai/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get specific chat session content
// @route   GET /api/ai/chats/:id
// @access  Private
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user.id });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete chat session
// @route   DELETE /api/ai/chats/:id
// @access  Private
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
