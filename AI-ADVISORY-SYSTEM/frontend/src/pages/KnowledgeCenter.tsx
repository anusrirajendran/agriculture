import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import Card from '../components/ui/Card';
import {
  BookOpen,
  Search,
  ChevronRight,
  Clock,
  User,
  X,
  Sparkles
} from 'lucide-react';

interface ArticleType {
  _id: string;
  title: string;
  category: string;
  content: string;
  author: { name: string };
  imageUrl: string;
  createdAt: string;
}

export const KnowledgeCenter: React.FC = () => {
  const { t } = useTranslation();

  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [readerArticle, setReaderArticle] = useState<ArticleType | null>(null);

  // Fetch articles on load/search/category click
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/articles', {
        params: {
          category: selectedCategory,
          search: search,
        },
      });

      if (res.data.success) {
        setArticles(res.data.data);
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.warn('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, search]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {t.knowledgeCenter}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Comprehensive, structured tutorials and guides on modern agriculture, hydroponics, soil conditioning, and pest controls.
        </p>
      </div>

      {/* Categories slider list */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${!selectedCategory ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
        >
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Global Search box */}
      <Card className="p-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by titles, keywords..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
          />
        </div>
      </Card>

      {/* Articles Grid list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
          No educational articles found for this topic.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <Card
              key={art._id}
              onClick={() => setReaderArticle(art)}
              className="p-5 flex flex-col justify-between hover:border-emerald-500 group"
            >
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-md">
                    {art.category}
                  </span>
                  <span className="text-[9px] text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" />
                    {new Date(art.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-medium line-clamp-3">
                  {art.content}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  By {art.author?.name || 'HarvestIQ Advisor'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read Article
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reader Modal overlay overlay */}
      {readerArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{readerArticle.category}</span>
              </div>
              <button
                onClick={() => setReaderArticle(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-left">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight font-outfit">
                {readerArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Author: {readerArticle.author?.name || 'HarvestIQ Advisor'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Published: {new Date(readerArticle.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {readerArticle.content}
              </p>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <Sparkles className="w-3.5 h-3.5" />
                HarvestIQ Educational Program
              </span>
              <button
                onClick={() => setReaderArticle(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default KnowledgeCenter;
