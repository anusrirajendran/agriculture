import axios from 'axios';
import Profile from '../models/Profile.js';
import { generateAISuggestion } from './aiController.js';

// Language Map for weather outputs
const weatherLangMap = {
  en: 'English',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  hi: 'Hindi',
};

// Geocoding dictionary for Indian Districts to default Coordinates (fallback)
const coordinateDefaults = {
  chennai: { lat: 13.0827, lon: 80.2707 },
  coimbatore: { lat: 11.0168, lon: 76.9558 },
  madurai: { lat: 9.9252, lon: 78.1198 },
  hyderabad: { lat: 17.3850, lon: 78.4867 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  delhi: { lat: 28.7041, lon: 77.1025 },
  mumbai: { lat: 19.0760, lon: 72.8777 },
  patna: { lat: 25.5941, lon: 85.1376 },
  lucknow: { lat: 26.8467, lon: 80.9462 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  bhopal: { lat: 23.2599, lon: 77.4126 },
};

// @desc    Get Weather Data and AI farming advice
// @route   GET /api/weather
// @access  Private
export const getWeatherData = async (req, res) => {
  try {
    let { lat, lon } = req.query;

    const profile = await Profile.findOne({ user: req.user.id });
    const lang = profile ? profile.preferredLanguage : 'en';

    // Geolocation fallback using Profile State/District
    if (!lat || !lon) {
      if (profile) {
        const districtKey = profile.district.toLowerCase().trim();
        const stateKey = profile.state.toLowerCase().trim();
        
        if (coordinateDefaults[districtKey]) {
          lat = coordinateDefaults[districtKey].lat;
          lon = coordinateDefaults[districtKey].lon;
        } else if (coordinateDefaults[stateKey]) {
          lat = coordinateDefaults[stateKey].lat;
          lon = coordinateDefaults[stateKey].lon;
        } else {
          // Default to Chennai or Bengaluru if no match
          lat = 13.0827;
          lon = 80.2707;
        }
      } else {
        // Absolute default
        lat = 13.0827;
        lon = 80.2707;
      }
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    let weatherData = null;
    let forecastData = null;
    let isMock = false;

    if (apiKey && apiKey !== 'YOUR_OPENWEATHER_API_KEY') {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const [weatherRes, forecastRes] = await Promise.all([
          axios.get(weatherUrl),
          axios.get(forecastUrl),
        ]);

        weatherData = weatherRes.data;
        forecastData = forecastRes.data;
      } catch (error) {
        console.warn('OpenWeather request failed. Using mock data.', error.message);
        isMock = true;
      }
    } else {
      isMock = true;
    }

    // Process Weather Data
    let processedWeather = {};
    if (isMock) {
      // Create rich mock weather data
      const mockLocationName = profile ? `${profile.district}, ${profile.state}` : 'Chennai, Tamil Nadu';
      processedWeather = {
        location: mockLocationName,
        temp: 31,
        feelsLike: 35,
        humidity: 68,
        windSpeed: 4.2,
        uvIndex: 8.5,
        rainProbability: 25,
        condition: 'Partly Cloudy',
        icon: '03d',
        forecast: [
          { day: 'Today', temp: 31, condition: 'Partly Cloudy', rainProb: 25, icon: '03d' },
          { day: 'Tomorrow', temp: 32, condition: 'Sunny', rainProb: 10, icon: '01d' },
          { day: 'Day 3', temp: 29, condition: 'Thunderstorm', rainProb: 80, icon: '11d' },
          { day: 'Day 4', temp: 28, condition: 'Moderate Rain', rainProb: 70, icon: '10d' },
          { day: 'Day 5', temp: 30, condition: 'Partly Cloudy', rainProb: 30, icon: '03d' },
          { day: 'Day 6', temp: 31, condition: 'Sunny', rainProb: 15, icon: '01d' },
          { day: 'Day 7', temp: 32, condition: 'Sunny', rainProb: 10, icon: '01d' },
        ],
      };
    } else {
      // Process OpenWeather response
      const dailyForecastMap = {};
      forecastData.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyForecastMap[dayName]) {
          dailyForecastMap[dayName] = {
            day: dayName,
            temp: Math.round(item.main.temp),
            condition: item.weather[0].main,
            rainProb: item.pop ? Math.round(item.pop * 100) : 0,
            icon: item.weather[0].icon,
          };
        }
      });

      const forecastList = Object.values(dailyForecastMap).slice(0, 7);
      
      // Map names to first day = 'Today', second = 'Tomorrow'
      if (forecastList.length > 0) forecastList[0].day = 'Today';
      if (forecastList.length > 1) forecastList[1].day = 'Tomorrow';

      processedWeather = {
        location: weatherData.name,
        temp: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        uvIndex: 7.2, // OpenWeather standard endpoint does not return UV, set typical index
        rainProbability: forecastData.list[0].pop ? Math.round(forecastData.list[0].pop * 100) : 0,
        condition: weatherData.weather[0].main,
        icon: weatherData.weather[0].icon,
        forecast: forecastList,
      };
    }

    // Generate Weather-Based AI Advice
    const prompt = `Location: ${processedWeather.location}.
Current Weather: Temperature is ${processedWeather.temp}°C, Humidity is ${processedWeather.humidity}%, Wind Speed is ${processedWeather.windSpeed} m/s, Rain Probability is ${processedWeather.rainProbability}%.
Seven-day outlook includes some days with condition: ${processedWeather.forecast.map((f) => f.condition).join(', ')}.

Provide 3 brief, actionable, weather-based farming suggestions for these conditions (e.g. spray schedule, water levels, harvest warnings) in ${weatherLangMap[lang] || 'English'}. Format as standard markdown bullet points. Do not include introductory text.`;

    const aiAdvice = await generateAISuggestion(
      prompt,
      'You are a smart agricultural weather advisor. Respond strictly with 3 bullet points in the target language.',
      lang
    );

    res.status(200).json({
      success: true,
      weather: processedWeather,
      advice: aiAdvice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
