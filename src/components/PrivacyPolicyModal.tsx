import React from 'react';
import { X, ShieldCheck, Mail, Phone, Lock } from 'lucide-react';
import { ASAD_EMAIL, ASAD_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[#0F121C] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">Privacy Policy</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-5 text-xs text-slate-300 leading-relaxed">
          <div>
            <h4 className="text-sm font-semibold text-white mb-1.5">1. Overview</h4>
            <p>
              This website serves as the official portfolio and professional inquiry platform for <strong>Asad Ali Awan</strong>, Web Developer & AI Content Creator. We are dedicated to respecting your privacy, minimizing data collection, and handling all visitor communications with complete confidentiality.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1.5">2. Information Collected & Purpose</h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li>
                <strong className="text-slate-200">Voluntary Inquiry Details:</strong> When you initiate a project inquiry via the contact form or WhatsApp, you voluntarily provide your name, optional email address, optional WhatsApp phone number, desired service, estimated budget, and project description.
              </li>
              <li>
                <strong className="text-slate-200">Purpose of Processing:</strong> This information is used solely to respond to your inquiry, discuss project scopes, prepare accurate estimates, and communicate regarding services.
              </li>
              <li>
                <strong className="text-slate-200">No Sale or Sharing:</strong> Your information is never sold, leased, or distributed to third-party data brokers or advertisers.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1.5">3. Direct Messaging via WhatsApp & Email</h4>
            <p>
              When submitting an inquiry form, the website generates a structured message and directs you to WhatsApp (<code className="text-slate-300 font-mono">https://wa.me/923164227321</code>) or your local email client. The message is only transmitted when you actively press "Send" within the WhatsApp or email interface.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1.5">4. Cookie & Local Storage Governance</h4>
            <p>
              We prioritize privacy and avoid tracking scripts. Local storage is utilized solely to remember your cookie consent selections and retain your profile/lead preferences locally on your browser. No third-party behavioral profiling trackers are loaded without your consent.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-1.5">5. Your Rights & Data Inquiries</h4>
            <p>
              You have the right to request access to, correction of, or deletion of any contact information you have shared with us at any time. Simply contact Asad Ali Awan directly:
            </p>
            <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Email: <a href={`mailto:${ASAD_EMAIL}`} className="text-purple-300 hover:underline">{ASAD_EMAIL}</a></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: <a href="https://wa.me/923164227321" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">03164227321 (+923164227321)</a></span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};
