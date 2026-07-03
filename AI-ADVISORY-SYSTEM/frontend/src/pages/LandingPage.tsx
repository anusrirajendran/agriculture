import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import ThemeToggle from '../components/ThemeToggle';
import LanguageSelector from '../components/ui/LanguageSelector';
import {
  Sprout,
  Brain,
  ShieldCheck,
  TrendingUp,
  CloudSun,
  ArrowRight,
  Globe,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { t } = useTranslation();

  const handleStartClick = () => {
    if (authContext?.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    { title: 'AI Farmer Assistant', desc: 'Get step-by-step guidance on seeds, fertilizers, and yield optimization powered by Google Gemini.', icon: Brain, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Disease Diagnostics', desc: 'Scan and analyze crop leaf images to instantly identify bacterial/fungal infections and biological treatments.', icon: ShieldCheck, color: 'text-rose-500 bg-rose-500/10' },
    { title: 'Smart Weather Advice', desc: 'Weather forecasting integrated with AI actions: know exactly when to irrigate, spray, or harvest.', icon: CloudSun, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Mandi Market Trends', desc: 'Compare daily commodity pricing across national mandis with visual price change indicators.', icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-850 py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <Sprout className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-wide font-outfit select-none">
            {t.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
          <Link
            to="/login"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 transition-colors cursor-pointer"
          >
            {t.login}
          </Link>
          <button
            onClick={handleStartClick}
            className="hidden sm:inline-flex text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-6 max-w-6xl mx-auto flex flex-col items-center text-center space-y-8 overflow-hidden">
        {/* Glow blur shapes */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider select-none animate-pulse">
          <Award className="w-4 h-4 text-emerald-500" />
          Smart Digital Agriculture Assistant
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 dark:text-white leading-tight font-outfit tracking-tight max-w-3xl">
          Empowering Farmers with <span className="bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent">AI Intelligence</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
          HarvestIQ provides real-time crop disease diagnosis, localized weather warnings, market mandi pricing trends, and personalized farming advice in 6 regional languages.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleStartClick}
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
          >
            Start Farming Smarter
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all"
          >
            Access Dashboard
          </Link>
        </div>
      </section>

      {/* Core Spotlights Features Grid */}
      <section className="bg-white dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-850 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-outfit">
              Advanced Agritech Solutions
            </h2>
            <p className="text-sm text-slate-450 dark:text-slate-500 font-medium">
              HarvestIQ features an integrated digital ecosystem to secure harvests and maximize profits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl flex flex-col justify-between gap-4 text-left shadow-sm group hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl inline-flex ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 font-medium leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Support Banner */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
          <Globe className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-outfit">
          Regional Language Support
        </h2>
        <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Select your local language and the entire interface – including the Google Gemini AI responses – will translate instantly. Supporting English, हिन्दी, தமிழ், తెలుగు, മലയാളം, and ಕನ್ನಡ.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'മലയാളം', 'ಕನ್ನಡ'].map((l) => (
            <span
              key={l}
              className="px-4 py-1.5 border border-slate-200 dark:border-slate-855 rounded-xl bg-white dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm"
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-8 border-t border-slate-200/50 dark:border-slate-850 text-center text-xs text-slate-450 dark:text-slate-550">
        <p>© 2026 HarvestIQ Platform. Growth through innovation and AI.</p>
      </footer>
    </div>
  );
};
export default LandingPage;
