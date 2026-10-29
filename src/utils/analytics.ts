import { getCookiePreferences } from './cookieStorage';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

/**
 * Initializes Google Analytics 4 if a Measurement ID is configured
 * and the visitor has consented to analytics cookies.
 */
export function initGA(): void {
  if (typeof window === 'undefined' || !GA_ID) return;

  const prefs = getCookiePreferences();
  // Respect cookie preferences if user explicitly declined
  if (prefs.hasConsented && !prefs.analytics) return;

  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      send_page_view: false, // We dispatch explicit page views
      anonymize_ip: true
    });
  }
}

export type AnalyticsEventName =
  | 'page_view'
  | 'portfolio_demo_click'
  | 'whatsapp_click'
  | 'quote_form_start'
  | 'quote_form_submit'
  | 'chatbot_open'
  | 'chatbot_voice_input';

/**
 * Dispatches a privacy-friendly custom event to GA4 and console.
 */
export function trackEvent(name: AnalyticsEventName, params: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;

  const prefs = getCookiePreferences();
  if (prefs.hasConsented && !prefs.analytics) return;

  if (typeof window.gtag === 'function' && GA_ID) {
    window.gtag('event', name, params);
  }

  // Development logger for debugging event flow
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[Analytics Event: ${name}]`, params);
  }
}
