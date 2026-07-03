import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import Card from '../components/ui/Card';
import GlassCard from '../components/ui/GlassCard';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  Leaf,
  TrendingUp,
  Landmark,
  BookOpen,
  Calendar,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface WeatherType {
  location: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  rainProbability: number;
  condition: string;
  icon: string;
}

export const Dashboard: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [weatherAdvice, setWeatherAdvice] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);

  const user = authContext?.user;
  const profile = authContext?.profile;

  // Seeding weather and market trends
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setWeatherLoading(true);
        // Load weather details
        const weatherRes = await api.get('/weather');
        if (weatherRes.data.success) {
          setWeather(weatherRes.data.weather);
          setWeatherAdvice(weatherRes.data.advice);
        }
      } catch (err) {
        console.warn('Failed to load weather widget');
      } finally {
        setWeatherLoading(false);
      }

      try {
        // Load market prices to display a mock chart on dashboard
        const marketRes = await api.get('/market/prices');
        if (marketRes.data.success && marketRes.data.data.length > 0) {
          // Take historical prices of the first item (e.g. Rice) for visualization
          const cropData = marketRes.data.data[0];
          const chartFormat = cropData.historicalPrices.map((h: any) => ({
            date: new Date(h.date).toLocaleDateString(undefined, { month: 'short' }),
            price: h.price,
          }));
          setMarketTrends(chartFormat);
        }
      } catch (err) {
        console.warn('Failed to load market trends chart');
      }
    };

    fetchDashboardData();
  }, []);

  const toolCards = [
    { label: t.aiAssistant, path: '/ai-chat', desc: 'Ask questions & plan harvests', icon: MessageSquare, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: t.diseaseAdvisory, path: '/disease-advisory', desc: 'Upload leaves to diagnose crops', icon: ShieldAlert, color: 'text-rose-500 bg-rose-500/10' },
    { label: t.cropRecommendation, path: '/crop-recommendations', desc: 'Maximize your land yield & returns', icon: Leaf, color: 'text-teal-500 bg-teal-500/10' },
    { label: t.soilManagement, path: '/soil-irrigation', desc: 'pH, NPK recommendations & water schedules', icon: Droplets, color: 'text-blue-500 bg-blue-500/10' },
    { label: t.marketPrices, path: '/market-prices', desc: 'Daily market price tracking & trends', icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10' },
    { label: t.govSchemes, path: '/schemes', desc: 'Agricultural grants & subsidy criteria', icon: Landmark, color: 'text-indigo-500 bg-indigo-500/10' },
  ];

  // Daily advice maps based on language
  const dailyTips: Record<string, string> = {
    en: "Apply nitrogen fertilizers in stages to avoid leaching. Keep weeds clear of root canals.",
    hi: "लीचिंग से बचने के लिए चरणों में नाइट्रोजन उर्वरक डालें। जड़ों को खरपतवार से मुक्त रखें।",
    ta: "உரங்கள் கரைந்து வீணாவதை தடுக்க நைட்ரஜன் உரங்களை பிரித்து இடவும். வேர் பகுதியில் களைகளை நீக்கவும்.",
    te: "నత్రజని ఎరువులను దశలవారీగా వేయండి. వేరు వ్యవస్థలో కలుపు మొక్కలను శుభ్రం చేయండి.",
    ml: "നൈട്രജൻ വളങ്ങൾ പല തവണകളായി നൽകുക. വേരുകൾക്ക് ചുറ്റുമുള്ള കളകൾ നീക്കം ചെയ്യുക.",
    kn: "ಸಾರಜನಕ ಗೊಬ್ಬರಗಳನ್ನು ಹಂತ ಹಂತವಾಗಿ ಹಾಕಿ. ಬೆಳೆಗಳ ಬೇರಿನ ಸುತ್ತ ಕಳೆಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ."
  };

  const getDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {getDayGreeting()}, {user?.name}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Location: {profile?.village}, {profile?.district}, {profile?.state}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-semibold select-none shadow-sm">
          <Calendar className="w-4.5 h-4.5 text-emerald-500" />
          <span>Farming Calendar Active</span>
        </div>
      </div>

      {/* Grid of Main Dashboard widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-emerald-500" />
                {t.weatherModule} ({weather?.location || 'Loading...'})
              </span>
              <span className="text-xs text-slate-400">Powered by OpenWeather</span>
            </div>

            {weatherLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : weather ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Temp stats */}
                <div className="flex items-center gap-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.condition}
                    className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-inner"
                  />
                  <div>
                    <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{weather.temp}°C</span>
                    <span className="block text-sm font-semibold text-slate-400">{weather.condition}</span>
                  </div>
                </div>

                {/* Sub stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Humidity</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{weather.humidity}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Wind</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{weather.windSpeed} m/s</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">UV Index</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{weather.uvIndex}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl">
                    <CloudSun className="w-4 h-4 text-indigo-500" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Rain Prob</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{weather.rainProbability}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 py-10">Weather info unavailable.</p>
            )}
          </div>

          {/* AI Weather advice */}
          {weatherAdvice && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border-t border-slate-100 dark:border-slate-800/50 p-4">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">AI Weather Advisory</span>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: weatherAdvice.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Tip of Day Widget */}
        <GlassCard className="p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
          
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-outfit">
              {t.todayTip}
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              "{dailyTips[language] || dailyTips['en']}"
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 mt-4 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline" onClick={() => navigate('/knowledge')}>
            <span>Visit Agricultural Knowledge Center</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </GlassCard>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Farmer Toolkit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolCards.map((tool) => (
            <Card
              key={tool.path}
              onClick={() => navigate(tool.path)}
              className="p-5 flex items-start gap-4 hover:border-emerald-500 dark:hover:border-emerald-500 group"
            >
              <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-105 ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-800 dark:text-white transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {tool.label}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                  {tool.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Analytics Trend summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Market Price Trend (Paddy Rice)
            </span>
            <button className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline" onClick={() => navigate('/market-prices')}>
              View Markets
            </button>
          </div>

          <div className="h-60 w-full">
            {marketTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                Seeding price history logs...
              </div>
            )}
          </div>
        </Card>

        {/* Dynamic crop details list */}
        <Card className="p-6 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-500" />
                Active Land Parameters
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Primary Soil</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{profile?.soilType}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Irrigation Setup</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{profile?.irrigationMethod}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Farm Size</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{profile?.farmSize} Acres</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-800/40 pb-2">
                <span className="text-slate-400">Current Crops</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 max-w-40 truncate" title={profile?.mainCrops.join(', ')}>{profile?.mainCrops.join(', ')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Edit Farm Details
          </button>
        </Card>
      </div>
    </div>
  );
};
export default Dashboard;
