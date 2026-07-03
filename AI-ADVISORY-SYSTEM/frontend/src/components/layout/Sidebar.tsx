import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import {
  LayoutDashboard,
  MessageSquare,
  ShieldAlert,
  Leaf,
  CloudSun,
  Droplets,
  TrendingUp,
  Landmark,
  BookOpen,
  UserCheck,
  LogOut,
  X,
  Sprout
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext) || {};
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout && logout();
    navigate('/login');
    onClose();
  };

  const navItems = [
    { to: '/dashboard', label: t.dashboard, icon: LayoutDashboard },
    { to: '/ai-chat', label: t.aiAssistant, icon: MessageSquare },
    { to: '/disease-advisory', label: t.diseaseAdvisory, icon: ShieldAlert },
    { to: '/crop-recommendations', label: t.cropRecommendation, icon: Leaf },
    { to: '/weather', label: t.weatherModule, icon: CloudSun },
    { to: '/soil-irrigation', label: t.soilManagement, icon: Droplets },
    { to: '/market-prices', label: t.marketPrices, icon: TrendingUp },
    { to: '/schemes', label: t.govSchemes, icon: Landmark },
    { to: '/knowledge', label: t.knowledgeCenter, icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-100 border-r border-slate-800 lg:static lg:translate-x-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Sprout className="w-7 h-7 text-emerald-400 animate-pulse" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent select-none font-outfit tracking-wide">
              {t.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg lg:hidden hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Admin panel link */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 border border-indigo-500/25 ${isActive ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-900/30' : 'text-indigo-400 hover:bg-indigo-950/20'}`
              }
            >
              <UserCheck className="w-5 h-5 flex-shrink-0" />
              <span>{t.adminPanel}</span>
            </NavLink>
          )}
        </nav>

        {/* Footer info & Logout button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full py-2.5 text-sm font-medium text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/25 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
