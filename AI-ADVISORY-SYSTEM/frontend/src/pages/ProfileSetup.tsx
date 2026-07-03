import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Sprout, Save, ArrowRight } from 'lucide-react';
import { LanguageType } from '../utils/translations';

const soilTypes = ['Alluvial', 'Clayey', 'Sandy', 'Black Cotton', 'Red Sandy Loom', 'Laterite', 'Loamy'];
const irrigationMethods = ['Drip Irrigation', 'Sprinkler Irrigation', 'Flood Irrigation', 'Rainfed / Dryland'];

export const ProfileSetup: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { t, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageType>('en');
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState(soilTypes[0]);
  const [irrigationMethod, setIrrigationMethod] = useState(irrigationMethods[0]);
  const [mainCrops, setMainCrops] = useState('');
  const [farmingExperience, setFarmingExperience] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [farmingGoals, setFarmingGoals] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!state || !district || !village || !farmSize || !mainCrops || !farmingExperience || !annualIncome || !farmingGoals) {
      return setError('Please fill out all profile parameters');
    }

    setLoading(true);

    try {
      if (authContext?.saveProfile) {
        // Sync language change globally
        setLanguage(preferredLanguage);
        
        await authContext.saveProfile({
          state,
          district,
          village,
          preferredLanguage,
          farmSize: Number(farmSize),
          soilType,
          irrigationMethod,
          mainCrops: mainCrops.split(',').map((c) => c.trim()),
          farmingExperience: Number(farmingExperience),
          annualIncome: Number(annualIncome),
          farmingGoals,
        });

        // Trigger user context reload
        await authContext.loadUser();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile setup parameters');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl mb-3">
            <Sprout className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
            Complete Farmer Profile
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Let's configure HarvestIQ to give you personalized AI suggestions for your soil, weather, and crops.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-xl border border-white/40 dark:border-white/5">
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
              1. Location & Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Tamil Nadu"
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Coimbatore"
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Village / Locality
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Pollachi"
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as LanguageType)}
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 pt-2">
              2. Land & Soil Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  required
                  min="0.1"
                  step="0.1"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  placeholder="5.5"
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm cursor-pointer"
                >
                  {soilTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Irrigation Method
                </label>
                <select
                  value={irrigationMethod}
                  onChange={(e) => setIrrigationMethod(e.target.value)}
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm cursor-pointer"
                >
                  {irrigationMethods.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 pt-2">
              3. Farming Profile & Operations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={farmingExperience}
                  onChange={(e) => setFarmingExperience(e.target.value)}
                  placeholder="8"
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Annual Income (INR)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="350000"
                  className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Main Crops Grown (separated by commas)
              </label>
              <input
                type="text"
                required
                value={mainCrops}
                onChange={(e) => setMainCrops(e.target.value)}
                placeholder="Rice, Maize, Tomato, Cotton"
                className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Farming Goals (e.g. increase yield, move to organic farming)
              </label>
              <textarea
                required
                value={farmingGoals}
                onChange={(e) => setFarmingGoals(e.target.value)}
                placeholder="I want to implement organic pest control and optimize water usage using modern drip irrigation to double my profit margins."
                rows={3}
                className="mt-1.5 block w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="group flex justify-center items-center gap-2 w-full px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all duration-200 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                {loading ? t.loading : (
                  <>
                    <Save className="w-4 h-4" />
                    Complete Setup & Open Dashboard
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProfileSetup;
