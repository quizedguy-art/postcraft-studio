import React, { useState } from 'react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signInWithPassword,
  signUpWithPassword,
  isSupabaseConfigured 
} from '../utils/supabase';
import { 
  X, 
  Sparkles, 
  Mail, 
  Lock,
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Shield,
  KeyRound,
  Send
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'magic-link' | 'password-signin' | 'password-signup'>('magic-link');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        if (error.message?.toLowerCase().includes('provider is not enabled')) {
          setErrorMessage('Google Sign-In needs Client ID in Supabase. Use Email Login below, or configure Google in Supabase.');
        } else {
          setErrorMessage(error.message || 'Google sign-in failed. Please try Email login.');
        }
      }
    } catch {
      setErrorMessage('Sign in request failed. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (authMode === 'magic-link') {
        const { error } = await signInWithEmail(email.trim());
        if (error) {
          setErrorMessage(error.message || 'Could not send login link.');
        } else {
          setEmailSent(true);
        }
      } else if (authMode === 'password-signin') {
        if (!password) {
          setErrorMessage('Please enter your password.');
          setIsLoading(false);
          return;
        }
        const { error } = await signInWithPassword(email.trim(), password);
        if (error) {
          setErrorMessage(error.message || 'Invalid email or password.');
        } else {
          onClose();
        }
      } else if (authMode === 'password-signup') {
        if (!password || password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        const { error } = await signUpWithPassword(email.trim(), password);
        if (error) {
          setErrorMessage(error.message || 'Signup failed.');
        } else {
          setSuccessMessage('Account created! Please check your email if confirmation was sent, or sign in.');
        }
      }
    } catch {
      setErrorMessage('Request failed. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-md shadow-indigo-600/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Join SlideForge Cloud</h2>
              <p className="text-[11px] text-slate-400">Save carousels & sync across all devices.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUPABASE STATUS NOTIFICATION */}
        {!isSupabaseConfigured && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <span className="font-bold">Cloud Sync Ready:</span>
              <p className="text-[11px] text-slate-400">
                To connect your live database, add <code className="text-amber-200">VITE_SUPABASE_URL</code> and <code className="text-amber-200">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>
          </div>
        )}

        {emailSent ? (
          <div className="p-5 bg-slate-950/80 border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Check your inbox</h3>
            <p className="text-xs text-slate-400">
              We sent a 1-click magic link to <strong className="text-slate-200">{email}</strong>. Click the link in your email to sign in instantly.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="text-xs text-indigo-400 hover:underline pt-1 cursor-pointer"
            >
              Use a different email / password
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* GOOGLE SIGN IN BUTTON */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-lg cursor-pointer disabled:opacity-50"
            >
              {/* Google Icon SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-slate-800" />
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">or with email</span>
              <div className="flex-1 h-[1px] bg-slate-800" />
            </div>

            {/* AUTH METHOD SELECTOR */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setAuthMode('magic-link')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'magic-link' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Send className="w-3 h-3" />
                <span>Magic Link</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('password-signin')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'password-signin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3 h-3" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('password-signup')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'password-signup' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleAuthSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {authMode !== 'magic-link' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {authMode === 'magic-link' && 'Send 1-Click Login Link'}
                      {authMode === 'password-signin' && 'Sign In to Account'}
                      {authMode === 'password-signup' && 'Create Free Account'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-rose-400 font-medium text-center animate-fadeIn">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="text-xs text-emerald-400 font-medium text-center animate-fadeIn">
            {successMessage}
          </p>
        )}

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Encrypted Cloud Storage • Zero spam guarantee</span>
        </div>
      </div>
    </div>
  );
};
