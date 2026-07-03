import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (!authContext) return null;
  const { isAuthenticated, isLoading, hasCompletedProfile, user } = authContext;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading HarvestIQ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force profile setup first (only for regular users)
  if (user?.role !== 'admin' && !hasCompletedProfile && location.pathname !== '/profile-setup') {
    return <Navigate to="/profile-setup" replace />;
  }

  // Allow profile editing or setup bypass
  if (user?.role !== 'admin' && hasCompletedProfile && location.pathname === '/profile-setup') {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin access validation
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
