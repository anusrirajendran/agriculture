import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import {
  UserCheck,
  TrendingUp,
  Activity,
  BookOpen,
  Landmark,
  Bell,
  MessageSquare,
  Trash2,
  Plus,
  Send,
  Star,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

type AdminTab = 'analytics' | 'farmers' | 'articles' | 'schemes' | 'broadcast';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Analytics data states
  const [stats, setStats] = useState<any>(null);
  const [farmersList, setFarmersList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  // Articles & Schemes lists
  const [articles, setArticles] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);

  // Article creation form
  const [artTitle, setArtTitle] = useState('');
  const [artCategory, setArtCategory] = useState('Organic Farming');
  const [artContent, setArtContent] = useState('');

  // Scheme creation form
  const [schTitle, setSchTitle] = useState('');
  const [schDesc, setSchDesc] = useState('');
  const [schEligibility, setSchEligibility] = useState('');
  const [schBenefits, setSchBenefits] = useState('');
  const [schDocs, setSchDocs] = useState('');
  const [schApply, setSchApply] = useState('');
  const [schLink, setSchLink] = useState('');

  // Notification broadcast form
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('System');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load analytics summary
      const statsRes = await api.get('/admin/analytics');
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // Load farmers user lists
      const usersRes = await api.get('/admin/users');
      if (usersRes.data.success) {
        setFarmersList(usersRes.data.data.profiles);
      }

      // Load feedback reviews
      const feedbackRes = await api.get('/admin/feedback');
      if (feedbackRes.data.success) {
        setFeedbackList(feedbackRes.data.data);
      }

      // Load articles list
      const artRes = await api.get('/articles');
      if (artRes.data.success) {
        setArticles(artRes.data.data);
      }

      // Load schemes list
      const schRes = await api.get('/schemes');
      if (schRes.data.success) {
        setSchemes(schRes.data.data);
      }
    } catch (err) {
      setError('Failed to fetch administrative records. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/admin/articles', {
        title: artTitle,
        category: artCategory,
        content: artContent,
      });

      if (res.data.success) {
        setSuccessMsg('Article created successfully!');
        setArtTitle('');
        setArtContent('');
        fetchAdminData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create article');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/admin/articles/${id}`);
      if (res.data.success) {
        setSuccessMsg('Article deleted successfully');
        fetchAdminData();
      }
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/admin/schemes', {
        title: schTitle,
        description: schDesc,
        eligibility: schEligibility,
        benefits: schBenefits,
        documents: schDocs,
        applicationProcess: schApply,
        link: schLink,
      });

      if (res.data.success) {
        setSuccessMsg('Government scheme created successfully!');
        setSchTitle('');
        setSchDesc('');
        setSchEligibility('');
        setSchBenefits('');
        setSchDocs('');
        setSchApply('');
        setSchLink('');
        fetchAdminData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create scheme');
    }
  };

  const handleDeleteScheme = async (id: string) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.delete(`/admin/schemes/${id}`);
      if (res.data.success) {
        setSuccessMsg('Scheme deleted successfully');
        fetchAdminData();
      }
    } catch (err) {
      setError('Failed to delete scheme');
    }
  };

  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/admin/notifications', {
        title: notifTitle,
        message: notifMessage,
        type: notifType,
      });

      if (res.data.success) {
        setSuccessMsg('Global broadcast notification sent to all farmers!');
        setNotifTitle('');
        setNotifMessage('');
        fetchAdminData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send broadcast');
    }
  };

  const tabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'analytics', label: 'Analytics & Feedback', icon: TrendingUp },
    { id: 'farmers', label: 'Farmers Base', icon: Users },
    { id: 'articles', label: 'Articles Manager', icon: BookOpen },
    { id: 'schemes', label: 'Schemes Manager', icon: Landmark },
    { id: 'broadcast', label: 'Broadcast Center', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Admin Dashboard Panel
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage articles, schemes, view chatbot trends, monitor farmer feedback, and send broadcasts.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-transparent whitespace-nowrap cursor-pointer transition-colors ${activeTab === tab.id ? 'bg-indigo-500 text-white font-bold shadow-sm' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: ANALYTICS & FEEDBACK */}
          {activeTab === 'analytics' && stats && (
            <div className="space-y-6">
              {/* Stats Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-5 text-center space-y-1">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Farmers</span>
                  <span className="block text-3xl font-extrabold text-slate-850 dark:text-white">{stats.totalUsers}</span>
                </Card>
                <Card className="p-5 text-center space-y-1">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Queries Logged</span>
                  <span className="block text-3xl font-extrabold text-slate-850 dark:text-white">{stats.totalChats}</span>
                </Card>
                <Card className="p-5 text-center space-y-1">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Average Rating</span>
                  <span className="block text-3xl font-extrabold text-indigo-500 flex justify-center items-center gap-1">
                    {stats.averageRating}
                    <Star className="w-6 h-6 fill-amber-400 stroke-amber-400" />
                  </span>
                </Card>
                <Card className="p-5 text-center space-y-1">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Feedback Logs</span>
                  <span className="block text-3xl font-extrabold text-slate-850 dark:text-white">{stats.totalFeedback}</span>
                </Card>
              </div>

              {/* Chart & Feedback Review Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI usage chart */}
                <Card className="lg:col-span-2 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    AI Assistant Inquiries Volume (Last 7 Days)
                  </h3>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.aiUsageTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: 'rgba(15, 23, 42, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '11px',
                          }}
                        />
                        <Line type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Farmer feedback lists */}
                <Card className="p-5 flex flex-col justify-between max-h-[350px]">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-850 pb-2 mb-3">
                    Recent Farmer Feedback Reviews
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
                    {feedbackList.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-10">No feedback reviews submitted yet.</p>
                    ) : (
                      feedbackList.map((feed) => (
                        <div key={feed._id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                            <span>{feed.user?.name || 'Farmer Account'}</span>
                            <span className="flex items-center text-amber-500 font-extrabold gap-0.5">
                              {feed.rating}
                              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold italic">"{feed.comment}"</p>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">{feed.category}</span>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: FARMERS BASE */}
          {activeTab === 'farmers' && (
            <Card className="p-5 overflow-hidden">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-4 text-left border-b border-slate-100 dark:border-slate-850 pb-2">Registered Farmer Accounts & Metrics</h3>
              
              {farmersList.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-10">No farmers registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-850/40 text-[10px] text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3 text-left">Farmer Name</th>
                        <th className="px-4 py-3 text-left">Contact Info</th>
                        <th className="px-4 py-3 text-left">Village / State</th>
                        <th className="px-4 py-3 text-right">Land size</th>
                        <th className="px-4 py-3 text-left">Soil / Crops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {farmersList.map((farm) => (
                        <tr key={farm._id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-850 dark:text-slate-200">{farm.user?.name}</td>
                          <td className="px-4 py-3 text-left">
                            <span className="block text-xs font-semibold">{farm.user?.email}</span>
                            <span className="block text-[10px] text-slate-400">{farm.user?.mobile}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-medium">
                            {farm.village}, {farm.state}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-850 dark:text-slate-200">
                            {farm.farmSize} Acres
                          </td>
                          <td className="px-4 py-3">
                            <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400">{farm.soilType}</span>
                            <span className="block text-[10px] text-slate-450 truncate max-w-40">{farm.mainCrops.join(', ')}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* TAB 3: ARTICLES MANAGER */}
          {activeTab === 'articles' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
              {/* Form Create */}
              <Card className="p-5">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center gap-1">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  Write Educational Article
                </h3>

                <form onSubmit={handleCreateArticle} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Article Title</label>
                    <input
                      type="text"
                      required
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      placeholder="e.g. Maximising Yield in Rabi season"
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Category</label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="Organic Farming">Organic Farming</option>
                      <option value="Smart Farming">Smart Farming</option>
                      <option value="Greenhouse Farming">Greenhouse Farming</option>
                      <option value="Hydroponics">Hydroponics</option>
                      <option value="Irrigation Techniques">Irrigation Techniques</option>
                      <option value="Fertilizer Management">Fertilizer Management</option>
                      <option value="Crop Diseases">Crop Diseases</option>
                      <option value="Pest Control">Pest Control</option>
                      <option value="Government Policies">Government Policies</option>
                      <option value="Modern Agriculture">Modern Agriculture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Article Body Content</label>
                    <textarea
                      required
                      value={artContent}
                      onChange={(e) => setArtContent(e.target.value)}
                      rows={6}
                      placeholder="Provide step-by-step guidance, best practices..."
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publish Article
                  </button>
                </form>
              </Card>

              {/* List Delete */}
              <Card className="lg:col-span-2 p-5 flex flex-col max-h-[500px]">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Published Articles Base</h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {articles.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-10">No articles published yet.</p>
                  ) : (
                    articles.map((art) => (
                      <div key={art._id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-500 font-bold rounded-md uppercase tracking-wider">{art.category}</span>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 mt-1">{art.title}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteArticle(art._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 text-slate-400 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: SCHEMES MANAGER */}
          {activeTab === 'schemes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
              {/* Form Create */}
              <Card className="p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  Add Govt Scheme
                </h3>

                <form onSubmit={handleCreateScheme} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Scheme Title</label>
                    <input
                      type="text"
                      required
                      value={schTitle}
                      onChange={(e) => setSchTitle(e.target.value)}
                      placeholder="e.g. Kisan Credit Card Scheme"
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Overview Description</label>
                    <textarea
                      required
                      value={schDesc}
                      onChange={(e) => setSchDesc(e.target.value)}
                      rows={2}
                      placeholder="An overview of the program..."
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Eligibility Criteria</label>
                    <input
                      type="text"
                      required
                      value={schEligibility}
                      onChange={(e) => setSchEligibility(e.target.value)}
                      placeholder="All small, medium crop landowners..."
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Key Benefits</label>
                    <input
                      type="text"
                      required
                      value={schBenefits}
                      onChange={(e) => setSchBenefits(e.target.value)}
                      placeholder="Short term credit limits, low interest cards..."
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Documents Required (commas)</label>
                    <input
                      type="text"
                      required
                      value={schDocs}
                      onChange={(e) => setSchDocs(e.target.value)}
                      placeholder="Aadhaar, Land Registry, Bank book"
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Application Steps</label>
                    <textarea
                      required
                      value={schApply}
                      onChange={(e) => setSchApply(e.target.value)}
                      rows={2}
                      placeholder="Submit forms at Mandis or online..."
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Official Portal URL</label>
                    <input
                      type="url"
                      value={schLink}
                      onChange={(e) => setSchLink(e.target.value)}
                      placeholder="https://example.gov.in"
                      className="mt-1 block w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save Scheme
                  </button>
                </form>
              </Card>

              {/* List Delete */}
              <Card className="lg:col-span-2 p-5 flex flex-col max-h-[500px]">
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">Govt Schemes Database</h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {schemes.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 py-10">No schemes added yet.</p>
                  ) : (
                    schemes.map((sch) => (
                      <div key={sch._id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">{sch.title}</h4>
                          <span className="block text-[9px] text-slate-400 mt-1 max-w-md truncate">{sch.description}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteScheme(sch._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 text-slate-400 transition-colors"
                          title="Delete scheme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 5: BROADCAST CENTER */}
          {activeTab === 'broadcast' && (
            <Card className="p-6 max-w-xl mx-auto text-left">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-500" />
                Broadcast Weather & Market Alerts
              </h3>

              <form onSubmit={handleBroadcastNotification} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Alert Heading</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="e.g. Heavy Rainfall Warning: Coimbatore"
                    className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Alert Type</label>
                    <select
                      value={notifType}
                      onChange={(e) => setNotifType(e.target.value)}
                      className="mt-1.5 block w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Weather">Weather Alert</option>
                      <option value="Disease">Disease Alert</option>
                      <option value="Market">Market Alert</option>
                      <option value="Scheme">Scheme Update</option>
                      <option value="System">System Broadcast</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Message Details</label>
                  <textarea
                    required
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    rows={4}
                    placeholder="Provide actionable information: cover sprouts, check prices..."
                    className="mt-1.5 block w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/15"
                >
                  <Send className="w-3.5 h-3.5" />
                  Broadcast Live Alert
                </button>
              </form>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
