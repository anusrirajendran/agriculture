import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Mail, Sprout, ArrowLeft, Key } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useContext(AuthContext) || {};
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (forgotPassword) {
        const token = await forgotPassword(email);
        setResetToken(token);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <Sprout className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
        </div>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
          Forgot Password Recovery
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-4 sm:rounded-2xl sm:px-10 shadow-xl border border-white/40 dark:border-white/5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter your registered farmer email below. We will generate a password reset token for your account.
              </p>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <Mail className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full pl-11 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex justify-center items-center gap-1 w-full px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-50 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? t.loading : 'Generate Reset Token'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium">
                Success! A secure reset token was generated.
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                <span className="block text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">Reset Token</span>
                <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200 break-all">{resetToken}</span>
              </div>

              <div>
                <button
                  onClick={() => navigate(`/reset-password/${resetToken}`)}
                  className="group relative flex justify-center items-center gap-1.5 w-full px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 focus:outline-none transition-all duration-200 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  Proceed to Reset Password
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
