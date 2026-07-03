import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import Card from '../components/ui/Card';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  Sparkles,
  CloudLightning,
  CloudRain,
  Compass
} from 'lucide-react';

interface ForecastItem {
  day: string;
  temp: number;
  condition: string;
  rainProb: number;
  icon: string;
}

interface WeatherDetailType {
  location: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  rainProbability: number;
  condition: string;
  icon: string;
  forecast: ForecastItem[];
}

export const WeatherInfo: React.FC = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherDetailType | null>(null);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const res = await api.get('/weather');
        if (res.data.success) {
          setWeather(res.data.weather);
          setAdvice(res.data.advice);
        }
      } catch (err) {
        console.warn('Failed to load weather detailed statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {t.weatherModule}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Accurate weather monitoring combined with real-time AI agricultural advice to schedule sowing, watering, and sprays.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Synchronizing forecast reports...</p>
        </div>
      ) : weather ? (
        <div className="space-y-6">
          {/* Top Panel: Current weather conditions and AI Advice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current weather details */}
            <Card className="p-6 md:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
                  <span className="font-bold text-sm tracking-wide uppercase">Current Weather</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-white/20 rounded-full">{weather.location}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-5xl font-extrabold">{weather.temp}°C</span>
                    <span className="block text-sm font-semibold text-emerald-100 mt-1">{weather.condition}</span>
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.condition}
                    className="w-20 h-20 bg-white/10 rounded-2xl shadow-inner backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-2.5 text-sm pt-4 border-t border-white/15">
                <div className="flex justify-between items-center text-xs text-emerald-100">
                  <span>Feels Like</span>
                  <span className="font-bold text-white">{weather.feelsLike}°C</span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-100">
                  <span>Humidity</span>
                  <span className="font-bold text-white">{weather.humidity}%</span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-100">
                  <span>Wind Speed</span>
                  <span className="font-bold text-white">{weather.windSpeed} m/s</span>
                </div>
              </div>
            </Card>

            {/* AI suggestion panel */}
            <Card className="p-6 md:col-span-2 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                    AI Agricultural Advisory Tips
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full uppercase">Weather Aware</span>
                </div>

                {advice ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br />') }} />
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs py-6 text-center">AI tips generation processing...</p>
                )}
              </div>

              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-4">
                Tip: Reschedule pesticide sprays if rain probability is above 40%.
              </div>
            </Card>
          </div>

          {/* Sub Panel: 7-day forecast cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-emerald-500" />
              {t.weeklyForecast}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((f, idx) => (
                <Card key={idx} className="p-3 text-center flex flex-col items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{f.day}</span>
                  <img
                    src={`https://openweathermap.org/img/wn/${f.icon}.png`}
                    alt={f.condition}
                    className="w-10 h-10 bg-slate-50 dark:bg-slate-800/40 rounded-xl"
                  />
                  <div>
                    <span className="block text-sm font-extrabold text-slate-800 dark:text-white">{f.temp}°C</span>
                    <span className="text-[9px] font-bold text-slate-400 block truncate max-w-20" title={f.condition}>{f.condition}</span>
                  </div>
                  {/* Rain indicator */}
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-blue-500 bg-blue-500/5 px-1.5 py-0.5 rounded-full mt-1">
                    <CloudRain className="w-3 h-3" />
                    <span>{f.rainProb}%</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-400 py-20 text-sm">Failed to connect to weather data providers.</p>
      )}
    </div>
  );
};
export default WeatherInfo;
