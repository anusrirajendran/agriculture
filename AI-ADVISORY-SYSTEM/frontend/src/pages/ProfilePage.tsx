import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/ui/Card';
import { Save, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LanguageType } from '../utils/translations';

const soilTypes = ['Alluvial', 'Clayey', 'Sandy', 'Black Cotton', 'Red Sandy Loom', 'Laterite', 'Loamy'];
const irrigationMethods = ['Drip Irrigation', 'Sprinkler Irrigation', 'Flood Irrigation', 'Rainfed / Dryland'];

export const ProfilePage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { t, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const profile = authContext?.profile;
  const user = authContext?.user;

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
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Populate inputs with existing profile values
  useEffect(() => {
    if (profile) {
      setState(profile.state);
      setDistrict(profile.district);
      setVillage(profile.village);
      setPreferredLanguage(profile.preferredLanguage);
      setFarmSize(profile.farmSize.toString());
      setSoilType(profile.soilType);
      setIrrigationMethod(profile.irrigationMethod);
      setMainCrops(profile.mainCrops.join(', '));
      setFarmingExperience(profile.farmingExperience.toString());
      setAnnualIncome(profile.annualIncome.toString());
      setFarmingGoals(profile.farmingGoals);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

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

        setSuccess(true);
        // Reload session user
        await authContext.loadUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save profile updates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {t.profile}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and update your active agricultural parameters.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">{user?.name}</h3>
            <span className="block text-xs text-slate-400 font-medium">Farmer Mobile: {user?.mobile} • Email: {user?.email}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Profile details updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5 uppercase tracking-wider">
            Geography & Preference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">District</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Village</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Preferred Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as LanguageType)}
                className="mt-1.5 block w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs cursor-pointer focus:outline-none"
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

          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5 uppercase tracking-wider pt-2">
            Land Metrics & Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Farm Size (Acres)</label>
              <input
                type="number"
                required
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs cursor-pointer focus:outline-none"
              >
                {soilTypes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Irrigation Setup</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs cursor-pointer focus:outline-none"
              >
                {irrigationMethods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience (Years)</label>
              <input
                type="number"
                required
                value={farmingExperience}
                onChange={(e) => setFarmingExperience(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Annual Income (INR)</label>
              <input
                type="number"
                required
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Crops (separated by commas)</label>
            <input
              type="text"
              required
              value={mainCrops}
              onChange={(e) => setMainCrops(e.target.value)}
              className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Goals</label>
            <textarea
              required
              value={farmingGoals}
              onChange={(e) => setFarmingGoals(e.target.value)}
              rows={3}
              className="mt-1.5 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? t.loading : t.save}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default ProfilePage;
