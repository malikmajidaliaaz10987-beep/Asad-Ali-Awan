import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Mail,
  Lock,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Globe,
  Video,
  Layers,
  ChevronRight,
  KeyRound
} from 'lucide-react';
import {
  isFirebaseConfigured,
  signInWithFacebook,
  signInWithApple,
} from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../types/onboarding';

interface WelcomeScreenProps {
  onContinue: (profile: UserProfile) => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTerms?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue,
  onOpenPrivacyPolicy,
}) => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, continueAsGuest } = useAuth();
  const [isLoadingProvider, setIsLoadingProvider] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const handleProviderSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    setAuthError(null);

    // If Firebase credentials are not yet configured in environment variables,
    if (provider === 'google') {
      if (!isFirebaseConfigured) {
        setShowConfigModal('google');
        return;
      }

      setIsLoadingProvider('google');
      try {
        const result = await loginWithGoogle();
        if (!result.success) {
          setAuthError(result.error || 'Google Sign-In failed.');
        } else {
          onContinue({
            name: undefined,
            email: undefined,
            provider: 'google',
          });
        }
      } catch (err: any) {
        setAuthError(err?.message || 'Google Sign-In failed.');
      } finally {
        setIsLoadingProvider(null);
      }
      return;
    }

    if (!isFirebaseConfigured) {
      setShowConfigModal(provider);
      return;
    }

    setIsLoadingProvider(provider);
    try {
      const result = provider === 'facebook' ? await signInWithFacebook() : await signInWithApple();
      if (result.error) {
        setAuthError(result.error);
      } else if (result.user) {
        onContinue({
          name: result.user.displayName || undefined,
          email: result.user.email || undefined,
          photoURL: result.user.photoURL || undefined,
          provider,
        });
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please try again or continue as guest.');
    } finally {
      setIsLoadingProvider(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!emailInput || !emailInput.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (!passwordInput || passwordInput.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (emailMode === 'signup' && !nameInput.trim()) {
      setAuthError('Please enter your full name to register.');
      return;
    }

    setIsLoadingProvider('email');
    try {
      const res = emailMode === 'signin'
        ? await loginWithEmail(emailInput.trim(), passwordInput)
        : await registerWithEmail(emailInput.trim(), passwordInput, nameInput.trim());

      if (!res.success) {
        setAuthError(res.error || 'Authentication failed.');
      } else {
        onContinue({
          name: nameInput.trim() || undefined,
          email: emailInput.trim(),
          provider: 'email',
        });
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error.');
    } finally {
      setIsLoadingProvider(null);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    onContinue({
      isGuest: true,
      provider: 'guest',
    });
  };

  return (
    <div className="relative min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between overflow-hidden font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center font-extrabold text-white shadow-lg shadow-purple-950/40 border border-purple-500/20">
            AA
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Asad Ali Awan</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/60 text-[10px] text-purple-300 font-mono">
                STUDIO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Web Developer & AI Creative Specialist</p>
          </div>
        </div>

        <button
          onClick={handleGuestContinue}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 cursor-pointer"
        >
          <span>Skip to Website</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </header>

      {/* Hero Welcome Main Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          {/* Silicon Valley style badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-xs text-purple-300 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="font-medium tracking-wide">Next-Gen Digital Experience</span>
            </div>
          </div>

            {/* Headline & Subheadline */}
            <div className="text-center mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4">
                Build Something{' '}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                  Amazing with AI
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Explore professional website development, AI chatbots, AI image generation, and AI video creation services.
              </p>
            </div>

            {/* Auth Card */}
            <div className="relative rounded-2xl bg-[#0E121E]/90 border border-slate-800/90 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
              {/* Ambient accent top highlight */}
              <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

              {/* Error banner if triggered */}
              {authError && (
                <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="flex-1">{authError}</p>
                </div>
              )}

              {/* Action 1: Direct Primary Get Started CTA */}
              <button
                onClick={() => {
                  const el = document.getElementById('signin-options-group');
                  el?.scrollIntoView({ behavior: 'smooth' });
                  handleGuestContinue();
                }}
                className="w-full group py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-purple-950/50 hover:shadow-purple-700/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mb-6"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full border-t border-slate-800" />
                <span className="absolute px-3 bg-[#0E121E] text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                  or choose an option
                </span>
              </div>

              {/* Step 1 Sign-In & Guest Options */}
              <div id="signin-options-group" className="space-y-3">
                {/* 1. Continue with Google */}
                <button
                  type="button"
                  onClick={() => handleProviderSignIn('google')}
                  disabled={Boolean(isLoadingProvider)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 text-xs sm:text-sm font-medium text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
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

                {/* 2. Continue with Email */}
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  disabled={Boolean(isLoadingProvider)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 text-xs sm:text-sm font-medium text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Continue with Email</span>
                </button>

                {/* 3. Continue with Apple */}
                <button
                  type="button"
                  onClick={() => handleProviderSignIn('apple')}
                  disabled={Boolean(isLoadingProvider)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 text-xs sm:text-sm font-medium text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.61-11.37-20.55-15.22-32.82-3.85-12.27-5.78-23.75-5.78-34.45 0-14.37 3.58-26.4 10.74-36.09 7.16-9.69 16.5-14.65 28.02-14.88 4.7 0 10.02 1.25 15.96 3.75 5.94 2.5 9.87 3.82 11.78 3.97 1.48-.15 5.56-1.53 12.22-4.14 6.67-2.61 12.06-3.82 16.18-3.64 12.63.63 22.84 5.3 30.63 14.02-11.05 6.74-16.44 16.03-16.18 27.87.26 9.4 3.97 17.27 11.13 23.6 7.16 6.33 15.42 9.88 24.78 10.65-2.23 6.94-4.87 14.02-7.92 21.23zM119.22 31.84c0-7.25 2.66-14.15 7.97-20.69 5.32-6.54 11.95-10.65 19.9-12.33.22 1.35.33 2.76.33 4.22 0 7.37-2.73 14.51-8.19 21.43-5.46 6.92-12.05 10.9-19.78 11.95-.07-1.46-.23-2.98-.23-4.58z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>

                {/* 4. Continue with Facebook */}
                <button
                  type="button"
                  onClick={() => handleProviderSignIn('facebook')}
                  disabled={Boolean(isLoadingProvider)}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 text-xs sm:text-sm font-medium text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>

                {/* 5. Continue as Guest (Prominently styled) */}
                <button
                  type="button"
                  onClick={handleGuestContinue}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/50 hover:border-purple-400 text-xs sm:text-sm font-semibold text-purple-200 hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Continue as Guest</span>
                </button>
              </div>

              {/* Direct Guest Link for seamless UX */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <button
                  onClick={handleGuestContinue}
                  className="text-xs text-slate-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Quick access: Skip sign-in & explore website</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          {/* Trust badges footer */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-white font-bold text-xs">3-10 Days</p>
              <p className="text-[10px] text-slate-400">Rapid Delivery</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-white font-bold text-xs">100% Custom</p>
              <p className="text-[10px] text-slate-400">Code & AI Assets</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-white font-bold text-xs">Direct WhatsApp</p>
              <p className="text-[10px] text-slate-400">Real-Time Support</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-900">
        <p className="mb-2">
          By continuing, you agree to our{' '}
          <button
            onClick={onOpenPrivacyPolicy}
            className="text-slate-400 hover:text-purple-300 underline cursor-pointer"
          >
            Privacy Policy
          </button>{' '}
          and consent to receiving project communication.
        </p>
        <p className="text-[11px] text-slate-600">
          © {new Date().getFullYear()} Asad Ali Awan. All rights reserved.
        </p>
      </footer>

      {/* Transparent Provider Configuration Modal (appears when provider keys are not yet configured) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 bg-[#0E1322] border border-slate-700 rounded-2xl shadow-2xl text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-4">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {showConfigModal.toUpperCase()} Authentication Setup
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Real OAuth sign-in requires Firebase Authentication credentials configured in your Vercel Environment Variables.
            </p>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-2 mb-5 font-mono text-slate-300">
              <div className="text-[11px] text-purple-300 font-sans font-semibold mb-1">
                Required Vercel Variables:
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Add <code className="text-white">VITE_FIREBASE_API_KEY</code> & <code className="text-white">VITE_FIREBASE_PROJECT_ID</code> in Vercel Project Settings &gt; Environment Variables.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setShowConfigModal(null);
                  handleGuestContinue();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-xs shadow-md hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer text-center"
              >
                Continue as Guest / Enter Lead Info
              </button>

              <button
                onClick={() => setShowConfigModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Sign-In / Registration Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 bg-[#0E1322] border border-slate-700 rounded-2xl shadow-2xl text-left">
            <h3 className="text-base font-bold text-white mb-1">
              {emailMode === 'signin' ? 'Sign In with Email' : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {emailMode === 'signin'
                ? 'Sign in to access your inquiries and saved project briefs.'
                : 'Register to connect with Asad Ali Awan and track your projects.'}
            </p>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => { setEmailMode('signin'); setAuthError(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  emailMode === 'signin'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setEmailMode('signup'); setAuthError(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  emailMode === 'signup'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register (Create Account)
              </button>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {emailMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address <span className="text-purple-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password <span className="text-purple-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="•••••••• (min 6 characters)"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs">
                  {authError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={Boolean(isLoadingProvider)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoadingProvider === 'email'
                    ? 'Authenticating...'
                    : emailMode === 'signin'
                    ? 'Sign In to Account'
                    : 'Complete Registration'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
