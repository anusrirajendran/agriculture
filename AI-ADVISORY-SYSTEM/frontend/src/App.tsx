import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import CropAdvisory from './pages/CropAdvisory';
import CropRecommendations from './pages/CropRecommendations';
import WeatherInfo from './pages/WeatherInfo';
import SoilIrrigation from './pages/SoilIrrigation';
import MarketPrices from './pages/MarketPrices';
import Schemes from './pages/Schemes';
import KnowledgeCenter from './pages/KnowledgeCenter';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Layout wrapper for dashboard pages
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              {/* Public Landing & Auth Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Profile Setup Page (Requires Auth but bypasses sidebar layout) */}
              <Route
                path="/profile-setup"
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                }
              />

              {/* Protected Client Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-chat"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AIChat />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/disease-advisory"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CropAdvisory />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crop-recommendations"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CropRecommendations />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/weather"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <WeatherInfo />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/soil-irrigation"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SoilIrrigation />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/market-prices"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <MarketPrices />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schemes"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Schemes />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <KnowledgeCenter />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Console Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Routing Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
