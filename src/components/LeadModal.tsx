import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  MessageSquare,
  Mail,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Building2,
  Clock,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ServiceCategory, BudgetRange, DeadlineOption } from '../types';
import { buildLeadWhatsAppMessage, getWhatsAppUrl, getMailtoUrl, ASAD_WHATSAPP_NUMBER, ASAD_EMAIL } from '../utils/whatsapp';
import { saveLead } from '../utils/leadStorage';
import { trackEvent } from '../utils/analytics';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: ServiceCategory;
  title?: string;
  subtitle?: string;
}

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

const DEADLINE_OPTIONS: DeadlineOption[] = [
  'Within 1–2 weeks (Urgent)',
  '2–4 weeks (Standard)',
  '1–2 months',
  'Flexible / Ongoing'
];

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  title = 'Request a Project Quotation',
  subtitle = 'Provide your project requirements to receive a fast, customized quotation and implementation timeline.'
}) => {
  // Wizard steps: 'form' -> 'review' -> 'success'
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [service, setService] = useState<ServiceCategory>(
    preselectedService || 'Business Website Development'
  );
  const [budget, setBudget] = useState<BudgetRange>('$500–$1,500');
  const [deadline, setDeadline] = useState<DeadlineOption>('2–4 weeks (Standard)');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Sync preselectedService whenever it changes
  React.useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!projectDescription.trim() || projectDescription.trim().length < 10) {
      errs.projectDescription = 'Please provide at least 10 characters describing your project requirements.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      trackEvent('quote_form_start', { service, budget });
      setStep('review');
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const leadData = {
      fullName: fullName.trim(),
      email: email.trim(),
      whatsappNumber: whatsappNumber.trim() || undefined,
      companyName: companyName.trim() || undefined,
      service,
      budget,
      deadline,
      referenceUrl: referenceUrl.trim() || undefined,
      projectDescription: projectDescription.trim(),
      source: 'quotation_modal'
    };

    trackEvent('quote_form_submit', {
      service: leadData.service,
      budget: leadData.budget,
      hasCompany: Boolean(leadData.companyName)
    });

    try {
      // 1. Save in local browser storage
      const saved = saveLead(leadData);

      // 2. Dispatch to server leads endpoint
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      }).catch((e) => console.warn('Could not persist to server leads:', e));

      // 3. Attempt direct email alert to Asad
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.fullName,
          email: leadData.email,
          subject: `New Quotation Request: ${leadData.service} (${leadData.fullName})`,
          message: `Company: ${leadData.companyName || 'N/A'}\n` +
            `WhatsApp: ${leadData.whatsappNumber || 'N/A'}\n` +
            `Budget: ${leadData.budget}\n` +
            `Timeline: ${leadData.deadline}\n` +
            `Reference URL: ${leadData.referenceUrl || 'None'}\n\n` +
            `Description:\n${leadData.projectDescription}`
        })
      }).catch((e) => console.warn('Email dispatch alert notice:', e));

      // 4. Build formatted WhatsApp message
      const formattedMessage = buildLeadWhatsAppMessage(leadData);
      const waUrl = getWhatsAppUrl(formattedMessage);
      const mailtoUrl = getMailtoUrl(leadData);

      setSubmittedLead({
        ...saved,
        formattedMessage,
        waUrl,
        mailtoUrl
      });

      setStep('success');

      // 5. Open WhatsApp tab automatically for fast direct message
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Popup blocked, visitor can use the button:', e);
      }
    } catch (err: any) {
      setSubmitError('Unable to process submission. You can still reach out directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    if (!submittedLead) return;
    navigator.clipboard.writeText(submittedLead.formattedMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleReset = () => {
    setStep('form');
    setSubmittedLead(null);
    setFullName('');
    setEmail('');
    setWhatsappNumber('');
    setCompanyName('');
    setReferenceUrl('');
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
      <div className="relative w-full max-w-2xl bg-[#0F121C] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleReset}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: FORM INPUTS */}
        {step === 'form' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quotation Request Form</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <form onSubmit={handleProceedToReview} className="space-y-4">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-xs focus:outline-none transition-colors ${
                      errors.fullName ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                    }`}
                  />
                  {errors.fullName && <p className="text-rose-400 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-xs focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                    }`}
                  />
                  {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Row 2: Company Name (Optional) & WhatsApp Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Brand Name <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp / Creator Brand"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp / Phone <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Row 3: Selected Service & Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Selected Service <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as ServiceCategory)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none cursor-pointer"
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
                    Estimated Budget Range <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value as BudgetRange)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none cursor-pointer"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Timeline Deadline & Reference Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Deadline / Timeline
                  </label>
                  <select
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value as DeadlineOption)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none cursor-pointer"
                  >
                    {DEADLINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Reference / Inspiration URL <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="https://example.com/site-or-video"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 focus:border-purple-500 text-white text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Project Description (Required) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Description & Key Requirements <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Outline your project goals, must-have features, target audience, brand colors, or any specific AI requirements..."
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-white text-xs focus:outline-none transition-colors resize-none leading-relaxed ${
                    errors.projectDescription ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
                {errors.projectDescription && (
                  <p className="text-rose-400 text-[11px] mt-1">{errors.projectDescription}</p>
                )}
              </div>

              {/* CTA to Step 2 */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review Quotation Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2.5">
                  Review your information on the next step before sending.
                </p>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: REVIEW SUMMARY */}
        {step === 'review' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                  Step 2 of 2
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Review Your Quotation Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[11px]">Client Name:</span>
                  <span className="text-white font-medium">{fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address:</span>
                  <span className="text-white font-medium">{email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[11px]">Selected Service:</span>
                  <span className="text-purple-300 font-semibold">{service}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Estimated Budget:</span>
                  <span className="text-white font-medium">{budget}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[11px]">Company / Brand:</span>
                  <span className="text-white font-medium">{companyName || 'Private / Individual'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Target Timeline:</span>
                  <span className="text-white font-medium">{deadline}</span>
                </div>
              </div>

              {referenceUrl && (
                <div className="pb-2 border-b border-slate-800/80">
                  <span className="text-slate-500 block text-[11px]">Reference Link:</span>
                  <span className="text-blue-400 font-mono break-all">{referenceUrl}</span>
                </div>
              )}

              <div>
                <span className="text-slate-500 block text-[11px] mb-1">Project Requirements:</span>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/70">
                  {projectDescription}
                </p>
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting quotation request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm & Send via WhatsApp & Email</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Go Back to Modify Form
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & MULTI-CHANNEL DISPATCH VIEW */}
        {step === 'success' && submittedLead && (
          <div className="text-center py-2 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Quotation Request Registered!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                Your project inquiry has been securely stored. You can now press Send in WhatsApp or verify via email.
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
                  <span>Send via Email Client</span>
                </a>

                <button
                  onClick={handleCopyMessage}
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied!' : 'Copy Summary'}</span>
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
              Done / Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
