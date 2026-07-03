import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import {
  Leaf,
  Sparkles,
  TrendingUp,
  Droplets,
  Sprout,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

const soilTypes = ['Alluvial', 'Clayey', 'Sandy', 'Black Cotton', 'Red Sandy Loom', 'Laterite', 'Loamy'];
const irrigationMethods = ['Drip Irrigation', 'Sprinkler Irrigation', 'Flood Irrigation', 'Rainfed / Dryland'];
const seasonsList = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'];

export const CropRecommendations: React.FC = () => {
  const { t } = useTranslation();
  const authContext = useContext(AuthContext);
  const profile = authContext?.profile;

  const [soilType, setSoilType] = useState(profile?.soilType || soilTypes[0]);
  const [irrigation, setIrrigation] = useState(profile?.irrigationMethod || irrigationMethods[0]);
  const [farmSize, setFarmSize] = useState(profile?.farmSize?.toString() || '5.0');
  const [season, setSeason] = useState(seasonsList[0]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Auto-generate recommendations on first load if profile is complete
  useEffect(() => {
    if (profile) {
      handleGetRecommendations();
    }
  }, [profile]);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const res = await api.get('/recommendations/crops', {
        params: {
          soilType,
          irrigation,
          farmSize,
          season,
        },
      });

      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate crop recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {t.cropRecommendation}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Generate crop yield estimates, profit projections, water requirements, and fertilizer schedules customized to your land.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Parameters input column */}
        <Card className="p-6 md:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-500" />
            Land Parameters
          </h2>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Soil Type
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs cursor-pointer"
            >
              {soilTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Irrigation Method
            </label>
            <select
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value)}
              className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs cursor-pointer"
            >
              {irrigationMethods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Farm Size (Acres)
            </label>
            <input
              type="number"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Sowing Season
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs cursor-pointer"
            >
              {seasonsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Soil...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Engine Advice
              </>
            )}
          </button>
        </Card>

        {/* Results output column */}
        <div className="md:col-span-2 space-y-6">
          {loading && (
            <div className="p-8 border border-dashed border-emerald-500/30 rounded-2xl text-center space-y-4 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
              <Sparkles className="w-10 h-10 text-emerald-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">Calculating optimum crops...</h3>
                <p className="text-xs text-slate-400 mt-1">Cross-referencing soil chemistry, seasonal rainfall averages, and market index returns.</p>
              </div>
            </div>
          )}

          {!loading && !recommendations && (
            <div className="p-8 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-center text-sm text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">
              Select land parameters to generate farming models.
            </div>
          )}

          {recommendations && (
            <Card className="p-6 border-l-4 border-l-emerald-500 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Yield & Profitability Models
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
                  AI Optimised
                </span>
              </div>

              {/* MD Output */}
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br />') }} />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-850/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-emerald-500" />
                  Key Implementation Advice
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Consult nearby Mandis for seed availability and MSP guarantees.</li>
                  <li>Schedule initial soil tillage right after the first rain shower.</li>
                  <li>Check pesticide dosage charts before application to avoid chemical burn.</li>
                </ul>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
export default CropRecommendations;
