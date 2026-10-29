import { CookiePreferences } from '../types';

const COOKIE_STORAGE_KEY = 'asad_portfolio_cookie_consent_v1';

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  strictlyNecessary: true,
  analytics: false,
  marketing: false,
  hasConsented: false
};

export function getCookiePreferences(): CookiePreferences {
  try {
    const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) return DEFAULT_COOKIE_PREFERENCES;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read cookie preferences', err);
    return DEFAULT_COOKIE_PREFERENCES;
  }
}

export function saveCookiePreferences(prefs: Partial<CookiePreferences>): CookiePreferences {
  const current = getCookiePreferences();
  const updated: CookiePreferences = {
    ...current,
    ...prefs,
    strictlyNecessary: true, // Always true
    hasConsented: true,
    consentDate: new Date().toISOString()
  };

  try {
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save cookie preferences', err);
  }

  return updated;
}
