import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import api from '../services/api';
import Card from '../components/ui/Card';
import {
  TrendingUp,
  Search,
  MapPin,
  Calendar,
  DollarSign,
  TrendingDown,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

interface PriceItem {
  _id: string;
  cropName: string;
  marketName: string;
  state: string;
  district: string;
  price: number;
  priceTrend: 'up' | 'down' | 'stable';
  priceDate: string;
  historicalPrices: { date: string; price: number }[];
}

export const MarketPrices: React.FC = () => {
  const { t } = useTranslation();

  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [cropsList, setCropsList] = useState<string[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [activeChartRecord, setActiveChartRecord] = useState<PriceItem | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/market/prices', {
        params: {
          crop: selectedCrop,
          state: selectedState,
          search: search,
        },
      });

      if (res.data.success) {
        setPrices(res.data.data);
        setCropsList(res.data.crops);
        setStatesList(res.data.states);

        // Set the default chart record to the first matching entry if none is active
        if (res.data.data.length > 0) {
          setActiveChartRecord(res.data.data[0]);
        } else {
          setActiveChartRecord(null);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch market prices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop, selectedState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrices();
  };

  const formatChartData = (record: PriceItem) => {
    return record.historicalPrices.map((h) => ({
      date: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      price: h.price,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {t.marketPrices}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Monitor commodity prices, compare district mandi prices, and evaluate historical price trends to optimize harvest timings.
        </p>
      </div>

      {/* Filters Form */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          {/* Search text */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Search Markets / Crops</label>
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Mandis, crops, locations..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Crop select */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs cursor-pointer focus:outline-none"
            >
              <option value="">All Crops</option>
              {cropsList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State select */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs cursor-pointer focus:outline-none"
            >
              <option value="">All States</option>
              {statesList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </form>
      </Card>

      {/* Historical charts and prices list grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Mandi prices list */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="font-bold text-sm text-slate-700 dark:text-slate-200">Daily Mandi Pricing Logs</span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold rounded-full">Seeded Live</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : prices.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-16">No price records found for filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-850/40 text-[10px] text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Crop</th>
                    <th className="px-4 py-3 text-left">Market Mandi</th>
                    <th className="px-4 py-3 text-left">District / State</th>
                    <th className="px-4 py-3 text-right">Price (Quintal)</th>
                    <th className="px-4 py-3 text-center">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {prices.map((p) => (
                    <tr
                      key={p._id}
                      onClick={() => setActiveChartRecord(p)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${activeChartRecord?._id === p._id ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''}`}
                    >
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{p.cropName}</td>
                      <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{p.marketName}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {p.district}, {p.state}
                      </td>
                      <td className="px-4 py-3 text-right font-extrabold text-slate-800 dark:text-slate-200">
                        ₹{p.price}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.priceTrend === 'up' ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-[10px]">
                            <TrendingUp className="w-3 h-3" />
                            Up
                          </span>
                        ) : p.priceTrend === 'down' ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full font-bold text-[10px]">
                            <TrendingDown className="w-3 h-3" />
                            Down
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-full font-bold text-[10px]">
                            Stable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Recharts chart details card */}
        <Card className="p-6 space-y-4">
          {activeChartRecord ? (
            <>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Historical Pricing Model</span>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight">
                  {activeChartRecord.cropName}
                </h3>
                <span className="text-xs text-slate-400 font-semibold">{activeChartRecord.marketName} Mandi</span>
              </div>

              {/* Chart container */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formatChartData(activeChartRecord)} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        fontSize: '10px',
                      }}
                    />
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Current details */}
              <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Current Price</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">₹{activeChartRecord.price} / Quintal</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Record Date</span>
                  <span className="font-bold text-slate-600 dark:text-slate-300">
                    {new Date(activeChartRecord.priceDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Market Location</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-40">{activeChartRecord.district}, {activeChartRecord.state}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-60 flex items-center justify-center text-xs text-slate-400 text-center">
              Select a mandi row to load pricing trends.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
export default MarketPrices;
