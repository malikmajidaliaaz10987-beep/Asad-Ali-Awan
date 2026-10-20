import React, { useState } from 'react';
import { ServiceCategory, BudgetRange } from '../types';
import { buildLeadWhatsAppMessage, getWhatsAppUrl, getMailtoUrl, ASAD_WHATSAPP_NUMBER, ASAD_WHATSAPP_INTL, ASAD_EMAIL } from '../utils/whatsapp';
import { saveLead } from '../utils/leadStorage';
import { Send, Phone, Mail, MessageSquare, CheckCircle2, Copy, Check, Clock, Globe } from 'lucide-react';

const SERVICE_OPTIONS: ServiceCategory[] = [
  'Website Development',
  'AI Content Creation',
  'AI Image Generation',
  'AI Video Generation',
  'Multiple Services',
  'Other'
];

const BUDGET_OPTIONS: BudgetRange[] = [
  'Under $100',
  '$100–$500',
  '$500–$1,000',
  '$1,000+',
  'Not decided yet'
];

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [service, setService] = useState<ServiceCategory>('Website Development');
  const [budget, setBudget] = useState<BudgetRange>('$500–$1,000');
  const [projectDescription, setProjectDescription] = useState('');

  const [errors, setErrors] = useState<{ fullName?: string; projectDescription?: string }>({});
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const validate = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const leadData = {
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      whatsappNumber: whatsappNumber.trim() || undefined,
      service,
      budget,
      projectDescription: projectDescription.trim()
    };

    // 1. Save lead to secure storage
    const saved = saveLead(leadData);

    // 2. Build formatted WhatsApp message
    const formattedMessage = buildLeadWhatsAppMessage(leadData);
    const waUrl = getWhatsAppUrl(formattedMessage);
    const mailtoUrl = getMailtoUrl(leadData);

    setSubmittedLead({
      ...saved,
      formattedMessage,
      waUrl,
      mailtoUrl
    });

    // 3. Open WhatsApp link
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

  const handleReset = () => {
    setSubmittedLead(null);
    setFullName('');
    setEmail('');
    setWhatsappNumber('');
    setProjectDescription('');
    setErrors({});
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
          Have a website idea or need AI-generated videos, images, or creative content? Tell me about your project, and let's discuss how I can help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info & Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F121C] border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white">Direct Communication Channels</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              I respond promptly to clients in the US, Europe, and worldwide. Reach out via WhatsApp for fast messaging or email for formal proposals.
            </p>

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
                  Direct Email
                </span>
                <span className="text-sm font-semibold text-white block break-all">
                  {ASAD_EMAIL}
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Send project briefs, documents & RFPs
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
            </div>
          </div>

          {/* Quick Notice on WhatsApp Workflow */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300 block mb-1">How WhatsApp Inquiry Works:</strong>
            Filling out this form prepares an organized project summary and opens WhatsApp click-to-chat. You have full control to inspect or edit the message before pressing Send.
          </div>
        </div>

        {/* Right: Project Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0F121C] border border-slate-800 shadow-xl">
            {!submittedLead ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Project Inquiry Form
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Please provide your initial project specifications below.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name or company"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-sm focus:outline-none transition-colors ${
                      errors.fullName ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-rose-400 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp Number <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Service & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Service Required <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value as ServiceCategory)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none cursor-pointer"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estimated Budget <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value as BudgetRange)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none cursor-pointer"
                    >
                      {BUDGET_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Description <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Tell me about your goals, reference links, specific requirements, and target timeline..."
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-sm focus:outline-none resize-none ${
                      errors.projectDescription ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                    }`}
                  />
                  {errors.projectDescription && (
                    <p className="text-rose-400 text-xs mt-1">{errors.projectDescription}</p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Open in WhatsApp</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    Your inquiry is saved securely and formatted into an instant message ready for WhatsApp review.
                  </p>
                </div>
              </form>
            ) : (
              /* Success State */
              <div className="space-y-5 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Inquiry Created Successfully</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your inquiry has been stored. You can now send it directly through WhatsApp or Email.
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

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={submittedLead.mailtoUrl}
                      className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send via Email</span>
                    </a>

                    <button
                      onClick={handleCopy}
                      className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white transition-colors underline pt-2 block mx-auto cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
