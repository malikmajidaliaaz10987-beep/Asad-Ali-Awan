import React, { useState, useEffect } from 'react';
import { Shield, Settings2, Check, X } from 'lucide-react';
import { CookiePreferences } from '../types';
import { getCookiePreferences, saveCookiePreferences } from '../utils/cookieStorage';

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
  forceOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onOpenPrivacyPolicy,
  forceOpenModal = false,
  onCloseModal
}) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(getCookiePreferences());
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Customizer state
  const [tempAnalytics, setTempAnalytics] = useState(false);
  const [tempMarketing, setTempMarketing] = useState(false);

  useEffect(() => {
    const prefs = getCookiePreferences();
    setPreferences(prefs);
    if (!prefs.hasConsented && !forceOpenModal) {
      // Delay display slightly to not interrupt immediate page render
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [forceOpenModal]);

  useEffect(() => {
    if (forceOpenModal) {
      setShowCustomizer(true);
      setTempAnalytics(preferences.analytics);
      setTempMarketing(preferences.marketing);
    }
  }, [forceOpenModal, preferences]);

  const handleAcceptAll = () => {
    const updated = saveCookiePreferences({
      strictlyNecessary: true,
      analytics: true,
      marketing: true
    });
    setPreferences(updated);
    setIsVisible(false);
    setShowCustomizer(false);
    if (onCloseModal) onCloseModal();
  };

  const handleRejectOptional = () => {
    const updated = saveCookiePreferences({
      strictlyNecessary: true,
      analytics: false,
      marketing: false
    });
    setPreferences(updated);
    setIsVisible(false);
    setShowCustomizer(false);
    if (onCloseModal) onCloseModal();
  };

  const handleSaveCustom = () => {
    const updated = saveCookiePreferences({
      strictlyNecessary: true,
      analytics: tempAnalytics,
      marketing: tempMarketing
    });
    setPreferences(updated);
    setIsVisible(false);
    setShowCustomizer(false);
    if (onCloseModal) onCloseModal();
  };

  // If forceOpenModal is active, render the customization modal
  if (showCustomizer) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <div className="relative w-full max-w-lg bg-[#0F121C] border border-slate-700 rounded-2xl shadow-2xl p-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Cookie Preferences</h3>
            </div>
            <button
              onClick={() => {
                setShowCustomizer(false);
                if (onCloseModal) onCloseModal();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-4 text-xs">
            {/* Strictly Necessary */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Strictly Necessary</span>
                  <span className="text-[10px] text-purple-400 font-mono">Always Active</span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Required for essential security, theme preferences, and session navigation.
                </p>
              </div>
              <input
                type="checkbox"
                checked={true}
                disabled
                className="mt-1 accent-purple-500 cursor-not-allowed"
              />
            </div>

            {/* Analytics */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-semibold text-white">Performance & Analytics</span>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Allows us to understand how visitors interact with the site to refine UX and load speed. No personal trackers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={tempAnalytics}
                onChange={(e) => setTempAnalytics(e.target.checked)}
                className="mt-1 w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Marketing */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
              <div>
                <span className="font-semibold text-white">Marketing & Campaign Attribution</span>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Helps measure lead inquiry campaign attribution from external links and social referrals.
                </p>
              </div>
              <input
                type="checkbox"
                checked={tempMarketing}
                onChange={(e) => setTempMarketing(e.target.checked)}
                className="mt-1 w-4 h-4 accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Read Privacy Policy
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard bottom banner
  if (!isVisible || preferences.hasConsented) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-5 bg-[#0D101A]/95 backdrop-blur-md border-t border-slate-800/90 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Privacy & Cookie Choices
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            We value your privacy. We use strictly necessary cookies to ensure site functionality. You can choose whether to enable anonymous analytics and marketing preferences.{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-purple-400 hover:text-purple-300 underline cursor-pointer"
            >
              Learn more in our Privacy Policy
            </button>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setTempAnalytics(preferences.analytics);
              setTempMarketing(preferences.marketing);
              setShowCustomizer(true);
            }}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <button
            type="button"
            onClick={handleRejectOptional}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors cursor-pointer"
          >
            Reject Optional
          </button>

          <button
            type="button"
            onClick={handleAcceptAll}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-md transition-all cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
