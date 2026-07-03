import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface UserType {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user' | 'admin';
}

export interface ProfileType {
  state: string;
  district: string;
  village: string;
  preferredLanguage: 'en' | 'ta' | 'te' | 'ml' | 'kn' | 'hi';
  farmSize: number;
  soilType: string;
  irrigationMethod: string;
  mainCrops: string[];
  farmingExperience: number;
  annualIncome: number;
  farmingGoals: string;
}

interface AuthContextProps {
  user: UserType | null;
  profile: ProfileType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, mobile: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
  saveProfile: (profileData: Partial<ProfileType>) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = async () => {
    const token = localStorage.getItem('harvestiq_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Get User Info
      const userRes = await api.get('/auth/me');
      if (userRes.data.success) {
        setUser(userRes.data.user);
        setIsAuthenticated(true);

        // Fetch User Profile
        try {
          const profileRes = await api.get('/profile');
          if (profileRes.data.success) {
            setProfile(profileRes.data.data);
            setHasCompletedProfile(true);
          }
        } catch (profileErr: any) {
          // If profile not found, they need to fill it in
          if (profileErr.response && profileErr.response.status === 404) {
            setHasCompletedProfile(false);
          }
        }
      }
    } catch (err: any) {
      console.error('Session load error:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('harvestiq_token', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        // Load profile
        try {
          const profileRes = await api.get('/profile');
          if (profileRes.data.success) {
            setProfile(profileRes.data.data);
            setHasCompletedProfile(true);
          }
        } catch (profileErr: any) {
          if (profileErr.response && profileErr.response.status === 404) {
            setProfile(null);
            setHasCompletedProfile(false);
          }
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, mobile: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, mobile, password });
      if (res.data.success) {
        localStorage.setItem('harvestiq_token', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setProfile(null);
        setHasCompletedProfile(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (err) {
      console.warn('Backend logout failed, clearing client anyway');
    }
    localStorage.removeItem('harvestiq_token');
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    setHasCompletedProfile(false);
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await api.post('/auth/forgotpassword', { email });
      return res.data.resetToken; // Return the raw token for client demo reset convenience
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to request reset token');
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const res = await api.put(`/auth/resetpassword/${token}`, { password });
      if (res.data.success) {
        localStorage.setItem('harvestiq_token', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        await loadUser();
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Reset password failed');
    }
  };

  const saveProfile = async (profileData: Partial<ProfileType>) => {
    try {
      const res = await api.post('/profile', profileData);
      if (res.data.success) {
        setProfile(res.data.data);
        setHasCompletedProfile(true);
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to save profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated,
        isLoading,
        hasCompletedProfile,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        saveProfile,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
