import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import Card from '../components/ui/Card';
import {
  Droplets,
  Sprout,
  Trash,
  Sparkles,
  Layers,
  Flame,
  Bug,
  BookOpen
} from 'lucide-react';

type TabType = 'soil' | 'irrigation' | 'fertilizer' | 'pest';

export const SoilIrrigation: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('soil');
  const [tabContent, setTabContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTabContent = async (tab: TabType) => {
    setLoading(true);
    setError('');
    setTabContent('');

    try {
      const endpointMap = {
        soil: '/recommendations/soil',
        irrigation: '/recommendations/irrigation',
        fertilizer: '/recommendations/fertilizer',
        pest: '/recommendations/pest',
      };

      const res = await api.get(endpointMap[tab]);
      if (res.data.success) {
        setTabContent(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to fetch data for ${tab} advisory`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabContent(activeTab);
  }, [activeTab]);

  const tabsList: { id: TabType; label: string; icon: any; color: string }[] = [
    { id: 'soil', label: 'Soil Health', icon: Sprout, color: 'text-emerald-500 hover:text-emerald-600' },
    { id: 'irrigation', label: 'Water Scheduling', icon: Droplets, color: 'text-blue-500 hover:text-blue-600' },
    { id: 'fertilizer', label: 'Fertilizer Guide', icon: Layers, color: 'text-teal-500 hover:text-teal-600' },
    { id: 'pest', label: 'Pest Control', icon: Bug, color: 'text-rose-500 hover:text-rose-600' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Soil & Water Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Detailed agricultural instructions and nutrition suggestions for soil conditioning, water conservation, composting, and pest prevention.
        </p>
      </div>

      {/* Tabs list navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-1.5">
        {tabsList.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl border border-transparent whitespace-nowrap cursor-pointer transition-all duration-200 ${activeTab === tab.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white shadow-inner font-bold' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Render Advisory details */}
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-16 border border-dashed border-emerald-500/25 rounded-2xl flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-xs font-semibold animate-pulse">Consulting smart recommendations engine...</p>
          </div>
        ) : (
          <Card className="p-6 border-l-4 border-l-emerald-500 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                AI Advisory - {tabsList.find((t) => t.id === activeTab)?.label}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full uppercase">
                Dynamic Advice
              </span>
            </div>

            {tabContent ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: tabContent.replace(/\n/g, '<br />') }} />
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">Advisory information currently unavailable.</p>
            )}

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center gap-2.5 text-xs text-slate-400 font-medium">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>We recommend taking a soil test every 2 years to recalibrate soil fertility parameters.</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
export default SoilIrrigation;
