import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import Card from '../components/ui/Card';
import {
  Landmark,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface SchemeType {
  _id: string;
  title: string;
  description: string;
  eligibility: string;
  benefits: string;
  documents: string[];
  applicationProcess: string;
  link: string;
}

export const Schemes: React.FC = () => {
  const { t } = useTranslation();

  const [schemes, setSchemes] = useState<SchemeType[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/schemes', {
        params: {
          search: search,
        },
      });

      if (res.data.success) {
        setSchemes(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [search]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {t.govSchemes}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Explore subsidies, grants, financial aids, and crop insurance programs provided by federal and regional departments.
          </p>
        </div>
      </div>

      {/* Search scheme */}
      <Card className="p-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes by title or description..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
          />
        </div>
      </Card>

      {/* Schemes list rendering */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : schemes.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            No matching agricultural schemes found.
          </div>
        ) : (
          schemes.map((s) => {
            const isExpanded = expandedId === s._id;
            return (
              <Card key={s._id} className="overflow-hidden transition-all duration-300">
                <div
                  onClick={() => toggleExpand(s._id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl mt-0.5">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 pr-4">
                      <h3 className="font-bold text-base text-slate-800 dark:text-white leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-1">
                        {s.description}
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-6 border-t border-slate-100 dark:border-slate-800/50 pt-5 space-y-5 animate-fade-in bg-slate-50/20 dark:bg-slate-950/5">
                    {/* Description */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Overview</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {s.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      {/* Eligibility */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Eligibility Criteria
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                          {s.eligibility}
                        </p>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                          Scheme Benefits
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                          {s.benefits}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                      {/* Documents */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-emerald-500" />
                          Required Documents
                        </span>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl space-y-1.5">
                          {s.documents.map((doc, idx) => (
                            <span key={idx} className="block text-xs font-semibold text-slate-600 dark:text-slate-300">• {doc}</span>
                          ))}
                        </div>
                      </div>

                      {/* Apply details */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                          Application Process
                        </span>
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl flex flex-col justify-between h-[calc(100%-24px)] gap-3">
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {s.applicationProcess}
                          </p>
                          {s.link && (
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                              Visit Official Portal
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
export default Schemes;
