import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Mail, Copy, Check, ArrowRight } from 'lucide-react';
import { ServiceCategory, BudgetRange } from '../types';
import { buildLeadWhatsAppMessage, getWhatsAppUrl, getMailtoUrl, ASAD_WHATSAPP_NUMBER, ASAD_EMAIL } from '../utils/whatsapp';
import { saveLead } from '../utils/leadStorage';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceCategory;
  title?: string;
  subtitle?: string;
}

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

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  title = 'Start Your Project',
  subtitle = 'Tell me about your website or AI creative vision. I will get back to you promptly.'
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [service, setService] = useState<ServiceCategory>(preselectedService || 'Website Development');
  const [budget, setBudget] = useState<BudgetRange>('$500–$1,000');
  const [projectDescription, setProjectDescription] = useState('');
  
  const [errors, setErrors] = useState<{ fullName?: string; projectDescription?: string }>({});
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

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

    // 1. Save lead securely to storage
    const saved = saveLead(leadData);

    // 2. Build exact formatted WhatsApp message
    const formattedMessage = buildLeadWhatsAppMessage(leadData);
    const waUrl = getWhatsAppUrl(formattedMessage);

    setSubmittedLead({
      ...saved,
      formattedMessage,
      waUrl,
      mailtoUrl: getMailtoUrl(leadData)
    });

    // 3. Open WhatsApp in new tab intentionally
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Popup blocked or unable to open window', e);
    }
  };

  const handleCopyMessage = () => {
    if (!submittedLead) return;
    navigator.clipboard.writeText(submittedLead.formattedMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setFullName('');
    setEmail('');
    setWhatsappNumber('');
    setProjectDescription('');
    setErrors({});
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#0F121C] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedLead ? (
          <div>
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Required) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-sm focus:outline-none transition-colors ${
                    errors.fullName ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-rose-400 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email & WhatsApp in 2-col */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none transition-colors"
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
                    placeholder="+1 555 019 2834"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Service Required (Required) & Estimated Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Service Required <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as ServiceCategory)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none transition-colors cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Description (Required) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Outline your goals, requirements, timeline, or links to references..."
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-sm focus:outline-none transition-colors resize-none ${
                    errors.projectDescription ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
                {errors.projectDescription && (
                  <p className="text-rose-400 text-xs mt-1">{errors.projectDescription}</p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry via WhatsApp</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  Opens WhatsApp with your prefilled inquiry. You can review before pressing Send.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Confirmation & Multichannel Action View */
          <div className="text-center py-2 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Inquiry Created Successfully</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your project details have been recorded and formatted for direct messaging.
              </p>
            </div>

            {/* Formatted Preview Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {submittedLead.formattedMessage}
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={submittedLead.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Open in WhatsApp (Press Send inside App)</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={submittedLead.mailtoUrl}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Email</span>
                </a>

                <button
                  onClick={handleCopyMessage}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Direct Contact: WhatsApp <span className="text-slate-400 font-mono">{ASAD_WHATSAPP_NUMBER}</span> · Email <span className="text-slate-400">{ASAD_EMAIL}</span>
            </p>

            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white transition-colors pt-2 block mx-auto underline cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
