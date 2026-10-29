import React, { useState, useEffect } from 'react';
import { ServiceCategory, BudgetRange } from '../types';
import { buildLeadWhatsAppMessage, getWhatsAppUrl, getMailtoUrl, ASAD_WHATSAPP_NUMBER, ASAD_WHATSAPP_INTL, ASAD_EMAIL } from '../utils/whatsapp';
import { saveLead } from '../utils/leadStorage';
import { useAuth } from '../contexts/AuthContext';
import {
  Send,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Globe,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const SERVICE_OPTIONS: ServiceCategory[] = [
  'Business Website Development',
  'E-commerce Website Development',
  'AI Chatbot Development',
  'AI Image Generation',
  'AI Video Generation',
  'AI Workflow Automation',
  'Multiple Services',
  'Other'
];

const BUDGET_OPTIONS: BudgetRange[] = [
  'Under $500',
  '$500–$1,500',
  '$1,500–$3,500',
  '$3,500–$7,500',
  '$7,500+',
  'Not decided yet'
];

export const ContactPage: React.FC = () => {
  const { user } = useAuth();

  // Mode: 'email' (direct server-side email dispatch) or 'whatsapp' (click-to-chat project brief)
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');

  // Direct Email Form State
  const [emailName, setEmailName] = useState(user?.displayName || '');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Sync auth user if logged in
  useEffect(() => {
    if (user?.displayName && !emailName) setEmailName(user.displayName);
    if (user?.email && !emailAddress) setEmailAddress(user.email);
  }, [user]);

  // WhatsApp Form State
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [service, setService] = useState<ServiceCategory>('Business Website Development');
  const [budget, setBudget] = useState<BudgetRange>('$500–$1,500');
  const [projectDescription, setProjectDescription] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; projectDescription?: string }>({});
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Handle Direct Email Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    if (!emailName.trim()) {
      setEmailError('Please enter your full name.');
      return;
    }

    if (!emailAddress.trim() || !/^\S+@\S+\.\S+$/.test(emailAddress.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!emailSubject.trim()) {
      setEmailError('Please enter a message subject.');
      return;
    }

    if (!emailMessage.trim() || emailMessage.trim().length < 5) {
      setEmailError('Please write your message (minimum 5 characters).');
      return;
    }

    setIsSendingEmail(true);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: emailName.trim(),
          email: emailAddress.trim(),
          subject: emailSubject.trim(),
          message: emailMessage.trim(),
          hp: honeypot, // Spam honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to dispatch email. Please retry or contact directly.');
      }

      setEmailSuccess(
        data.message || 'Your email has been successfully sent to Asad Ali Awan! You will receive a response within 24 hours.'
      );
      setEmailSubject('');
      setEmailMessage('');
    } catch (err: any) {
      setEmailError(err?.message || 'Unable to send email right now. Please message directly on WhatsApp.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle WhatsApp Submit
  const validateWhatsAppForm = () => {
    const errs: { fullName?: string; projectDescription?: string } = {};
    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }
    if (!projectDescription.trim() || projectDescription.trim().length < 10) {
      errs.projectDescription = 'Please describe your project (minimum 10 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateWhatsAppForm()) return;

    const leadData = {
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      whatsappNumber: whatsappNumber.trim() || undefined,
      service,
      budget,
      projectDescription: projectDescription.trim(),
    };

    const saved = saveLead(leadData);
    const formattedMessage = buildLeadWhatsAppMessage(leadData);
    const waUrl = getWhatsAppUrl(formattedMessage);
    const mailtoUrl = getMailtoUrl(leadData);

    setSubmittedLead({
      ...saved,
      formattedMessage,
      waUrl,
      mailtoUrl,
    });

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Popup blocked or direct tab failed', err);
    }
  };

  const handleCopy = () => {
    if (!submittedLead) return;
    navigator.clipboard.writeText(submittedLead.formattedMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block">
          Direct Client Inquiries & Bookings
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Let's Build Something Great Together
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Have a website idea or need AI-generated videos, images, or creative content? Send a direct email to Asad or start an instant WhatsApp conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F121C] border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white">Direct Communication Channels</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              I respond promptly to clients in the US, Europe, and worldwide. Reach out via email for proposals or WhatsApp for instant messaging.
            </p>

            {/* Email Card */}
            <a
              href={`mailto:${ASAD_EMAIL}`}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-mono text-purple-400 block uppercase">
                  Business Email
                </span>
                <span className="text-sm font-semibold text-white block break-all font-mono">
                  {ASAD_EMAIL}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Connected to secure server gateway
                </span>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${ASAD_WHATSAPP_INTL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-mono text-emerald-400 block uppercase">
                  WhatsApp Direct Chat
                </span>
                <span className="text-sm font-semibold text-white font-mono block truncate">
                  {ASAD_WHATSAPP_NUMBER}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  International format: +{ASAD_WHATSAPP_INTL}
                </span>
              </div>
            </a>

            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Response Time: Typically within 2 to 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Available for US & international client collaborations</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Server-side spam protection & secure delivery</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300 block mb-1">Direct Email Dispatch:</strong>
            Use the form on the right to send an email directly to Asad's inbox. Your message is dispatched via our verified server gateway, with reply-to set to your email.
          </div>
        </div>

        {/* Right: Interactive Forms (Email Tab & WhatsApp Tab) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0F121C] border border-slate-800 shadow-xl space-y-6">
            {/* Tab Selector */}
            <div className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'email'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Send Direct Email</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'whatsapp'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Brief</span>
              </button>
            </div>

            {/* TAB 1: DIRECT EMAIL SENDING */}
            {activeTab === 'email' && (
              <div>
                {emailSuccess ? (
                  <div className="space-y-5 text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Email Delivered Successfully</h3>
                      <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                        {emailSuccess}
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setEmailSuccess(null)}
                        className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Send Direct Email
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Send a message directly to Asad's inbox (<span className="text-slate-300">{ASAD_EMAIL}</span>).
                      </p>
                    </div>

                    {/* Anti-spam honeypot */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="hp_contact"
                        tabIndex={-1}
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Your Name <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={emailName}
                          onChange={(e) => setEmailName(e.target.value)}
                          placeholder="e.g. Alex Johnson"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Your Email Address <span className="text-purple-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Subject <span className="text-purple-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="e.g. New Website Redesign Project / AI Reel Inquiry"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Your Message <span className="text-purple-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Describe your project, timeline, deliverables, or any questions for Asad..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {emailError && (
                      <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{emailError}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSendingEmail}
                        className="w-full py-3.5 px-6 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSendingEmail ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending email via secure gateway...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Email to Asad</span>
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-slate-500 text-center mt-2.5">
                        Transmitted securely using Resend. Never shares your information publicly.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: WHATSAPP PROJECT BRIEF */}
            {activeTab === 'whatsapp' && (
              <div>
                {!submittedLead ? (
                  <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        WhatsApp Project Brief
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Format an organized project summary ready for WhatsApp review.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name or company"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-xs focus:outline-none transition-colors ${
                          errors.fullName ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-rose-400 text-xs mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          WhatsApp / Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="+1 555 123 4567"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Primary Service
                        </label>
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value as ServiceCategory)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none"
                        >
                          {SERVICE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-slate-900">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Estimated Budget
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value as BudgetRange)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none"
                        >
                          {BUDGET_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-slate-900">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Project Description <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Briefly describe what you would like to build..."
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-xs focus:outline-none transition-colors resize-none leading-relaxed ${
                          errors.projectDescription ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                        }`}
                      />
                      {errors.projectDescription && (
                        <p className="text-rose-400 text-xs mt-1">{errors.projectDescription}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-6 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        <span>Format & Open in WhatsApp</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5 text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">Inquiry Created Successfully</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Your inquiry has been stored. You can now send it directly through WhatsApp.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-52 overflow-y-auto">
                      {submittedLead.formattedMessage}
                    </div>

                    <div className="space-y-2 pt-2">
                      <a
                        href={submittedLead.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 fill-current" />
                        <span>Open in WhatsApp (Press Send inside App)</span>
                      </a>

                      <button
                        onClick={handleCopy}
                        className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText ? 'Copied' : 'Copy Formatted Text'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSubmittedLead(null)}
                      className="text-xs text-slate-400 hover:text-white transition-colors underline pt-2 block mx-auto cursor-pointer"
                    >
                      Submit Another WhatsApp Brief
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
