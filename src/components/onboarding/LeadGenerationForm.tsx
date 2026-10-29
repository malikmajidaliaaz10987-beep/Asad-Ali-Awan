import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Building2,
  Mail,
  User,
  Phone,
  FileText,
  DollarSign,
  Briefcase,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { UserProfile, LeadServiceCategory, LeadFormData } from '../../types/onboarding';
import { saveLeadToFirestore } from '../../lib/firebase';

interface LeadGenerationFormProps {
  userProfile?: UserProfile;
  onSubmitSuccess: (lead: LeadFormData) => void;
  onBackToWelcome: () => void;
  onOpenPrivacyPolicy: () => void;
}

const SERVICE_OPTIONS: { label: LeadServiceCategory; desc: string; icon: string }[] = [
  {
    label: 'Website Development',
    desc: 'Custom business sites, landing pages, responsive React/Tailwind',
    icon: '🌐',
  },
  {
    label: 'AI Chatbot Development',
    desc: 'Smart Gemini AI assistants, customer support agents',
    icon: '🤖',
  },
  {
    label: 'AI Image Generation',
    desc: 'Photorealistic product mockups, advertising banners, graphics',
    icon: '🎨',
  },
  {
    label: 'AI Video Generation',
    desc: 'Cinematic promotional reels, TikTok/Reels ads, 3D motion',
    icon: '🎬',
  },
  {
    label: 'Other',
    desc: 'Custom creative packages, AI workflows, consulting',
    icon: '✨',
  },
];

const BUDGET_OPTIONS = [
  'Under $100',
  '$100–$500',
  '$500–$1,000',
  '$1,000+',
  'Not decided yet',
];

export const LeadGenerationForm: React.FC<LeadGenerationFormProps> = ({
  userProfile,
  onSubmitSuccess,
  onBackToWelcome,
  onOpenPrivacyPolicy,
}) => {
  const [fullName, setFullName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [service, setService] = useState<LeadServiceCategory>('Website Development');
  const [budget, setBudget] = useState('Not decided yet');
  const [details, setDetails] = useState('');
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      return 'Please enter your full name.';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (!consent) {
      return 'Please accept the privacy policy to proceed.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const leadPayload: LeadFormData = {
      fullName: fullName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim() || undefined,
      businessName: businessName.trim() || undefined,
      service,
      budget,
      details: details.trim() || undefined,
      consent,
    };

    try {
      // 1. Post to backend leads API endpoint (handles Express in dev & Vercel serverless in prod)
      let backendSuccess = false;
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...leadPayload,
            source: userProfile?.isGuest ? 'welcome_guest' : `welcome_${userProfile?.provider || 'auth'}`,
            userProfile,
          }),
        });

        if (res.ok) {
          backendSuccess = true;
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('Backend /api/leads response was not OK:', errData);
        }
      } catch (err) {
        console.warn('Backend /api/leads network issue:', err);
      }

      // 2. Also save to Firebase Firestore if Firebase is configured
      try {
        await saveLeadToFirestore({
          ...leadPayload,
          source: userProfile?.isGuest ? 'welcome_guest' : `welcome_${userProfile?.provider || 'auth'}`,
          submittedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore optional sync error:', err);
      }

      // Store in localStorage lead vault so user profile is remembered locally
      try {
        const storedLeads = JSON.parse(localStorage.getItem('asad_leads_vault_v1') || '[]');
        storedLeads.unshift({
          id: 'lead_' + Date.now(),
          ...leadPayload,
          date: new Date().toISOString(),
        });
        localStorage.setItem('asad_leads_vault_v1', JSON.stringify(storedLeads));
      } catch {
        // ignore
      }

      // Show brief confirmation animation
      setSuccessNotice(true);
      setTimeout(() => {
        onSubmitSuccess(leadPayload);
      }, 1200);
    } catch (err: any) {
      console.error('Lead submission failure:', err);
      setErrorMessage(
        err?.message || 'Failed to submit inquiry. Please try again or reach out on WhatsApp.'
      );
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    const defaultLead: LeadFormData = {
      fullName: fullName.trim() || 'Website Visitor',
      email: email.trim() || 'visitor@portfolio.direct',
      service: service || 'Website Development',
      consent: true,
    };
    onSubmitSuccess(defaultLead);
  };

  return (
    <div className="relative min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between overflow-hidden font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[130px]" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={onBackToWelcome}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] font-mono tracking-widest text-purple-400 uppercase font-semibold">
            Step 2 of 2: Project Brief
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Skip for Now & Explore Website →</span>
        </button>
      </header>

      {/* Form Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl">
          <div className="relative rounded-2xl bg-[#0E121E]/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-6 sm:p-10">
            {/* Top accent line */}
            <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/50 text-[11px] text-purple-300 font-mono mb-3">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Tailored Consultation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Let's Bring Your Idea to Life
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Share what you are building so I can prepare an accurate scope, timeline, and proposal.
              </p>
            </div>

            {/* Success state overlay */}
            {successNotice ? (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Details Received!</h3>
                <p className="text-xs text-slate-300 max-w-xs mb-4">
                  Thank you, <strong className="text-white">{fullName}</strong>. Opening Asad Ali Awan's portfolio now...
                </p>
                <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 animate-pulse w-full" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <p className="flex-1">{errorMessage}</p>
                  </div>
                )}

                {/* Section 1: Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>Full Name</span>
                      <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      <span>Email Address</span>
                      <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Number (Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. +1 555 123 4567"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Business / Brand Name (Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Studio, Personal Brand"
                      className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Section 2: Service Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    <span>What service are you interested in?</span>
                    <span className="text-purple-400">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SERVICE_OPTIONS.map((opt) => {
                      const isSelected = service === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setService(opt.label)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-purple-950/40 border-purple-500 text-white shadow-md'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <span className="text-lg shrink-0 mt-0.5">{opt.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold tracking-tight">{opt.label}</p>
                            <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Budget & Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                      <span>Project Budget (Optional)</span>
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors"
                    >
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b} className="bg-slate-900 text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Project Details / Vision (Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Briefly describe your vision, references, or key features..."
                      className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none transition-colors"
                    />
                  </div>
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="leading-relaxed text-[11px] text-slate-400">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacyPolicy}
                        className="text-purple-400 hover:underline"
                      >
                        Privacy Policy
                      </button>{' '}
                      and consent to receiving project communication via Email or WhatsApp.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-purple-950/50 hover:shadow-purple-700/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Brief...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit & Continue to Website</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Visible Skip for Now & Explore Website Option */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Skip for Now & Explore Website</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 py-4 text-center text-[11px] text-slate-500">
        <p className="flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Your information is strictly confidential and never shared with third parties.</span>
        </p>
      </footer>
    </div>
  );
};
