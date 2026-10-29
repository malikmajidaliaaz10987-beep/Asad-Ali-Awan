import React from 'react';
import { PageType, ServiceCategory } from '../types';
import { Mail, Phone, ArrowUpRight, Shield, Cookie } from 'lucide-react';
import { ASAD_EMAIL, ASAD_WHATSAPP_NUMBER, ASAD_WHATSAPP_INTL } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onOpenPrivacyPolicy: () => void;
  onOpenCookieSettings: () => void;
  onOpenLeadModalWithService: (service: ServiceCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacyPolicy,
  onOpenCookieSettings,
  onOpenLeadModalWithService
}) => {
  const currentYear = 2026;

  const handleNav = (page: PageType) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#06080E] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1: Identity & Brand */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white tracking-tight">ASAD ALI AWAN</h3>
            <p className="text-purple-300 font-medium text-xs">
              Web Developer & AI Content Creator
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Helping businesses, startups, and creators build high-converting websites and extraordinary AI-powered visuals and video content.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2">
              {(['home', 'services', 'portfolio', 'about', 'contact'] as PageType[]).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handleNav(page)}
                    className="hover:text-white transition-colors capitalize text-left cursor-pointer"
                  >
                    {page === 'portfolio' ? 'Portfolio / My Work' : page === 'about' ? 'About Me' : page}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Core Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLeadModalWithService('Website Development')}
                  className="hover:text-purple-300 transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>Website Development</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLeadModalWithService('AI Content Creation')}
                  className="hover:text-purple-300 transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>AI Content Creation</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLeadModalWithService('AI Image Generation')}
                  className="hover:text-purple-300 transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>AI Image Generation</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLeadModalWithService('AI Video Generation')}
                  className="hover:text-purple-300 transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span>AI Video Generation</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Direct Inquiries */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Direct Inquiries
            </h4>
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${ASAD_WHATSAPP_INTL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">WhatsApp (Call & Chat)</span>
                  <span className="text-xs text-slate-200 font-mono font-medium">{ASAD_WHATSAPP_NUMBER}</span>
                </div>
              </a>

              <a
                href={`mailto:${ASAD_EMAIL}`}
                className="flex items-center gap-2 hover:text-purple-300 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">Email Address</span>
                  <span className="text-xs text-slate-200 break-all">{ASAD_EMAIL}</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {currentYear} ASAD ALI AWAN. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <button
              onClick={onOpenPrivacyPolicy}
              className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={onOpenCookieSettings}
              className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>Cookie Settings</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
