import React from 'react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceCategory } from '../types';
import { Code, Sparkles, Image, Video, Layers, CheckCircle2, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import { ASAD_WHATSAPP_INTL } from '../utils/whatsapp';

interface ServicesPageProps {
  onOpenLeadModal: (service?: ServiceCategory) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenLeadModal }) => {
  const serviceIcons = [Code, Sparkles, Image, Video, Layers];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block">
          Professional Services & Solutions
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          High-Impact Web Engineering & AI Creative Services
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Designed for international businesses, entrepreneurs, startups, and content creators. Every solution is tailored to your brand identity with clear deliverables and fast turnarounds.
        </p>
      </div>

      {/* Services List / Cards */}
      <div className="space-y-8">
        {SERVICES_DATA.map((service, index) => {
          const Icon = serviceIcons[index % serviceIcons.length];
          return (
            <div
              key={service.id}
              className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#0F121C] border border-slate-800 hover:border-slate-700 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left zone: Title, description, and highlights */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                        Service 0{index + 1}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {service.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300">
                    <span className="font-semibold text-purple-300 block mb-1">Key Focus:</span>
                    {service.highlight}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{service.deliverableTimeframe}</span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onOpenLeadModal(service.category)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Discuss Your Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right zone: Detailed feature checklist */}
                <div className="lg:col-span-7 bg-[#090B12] p-6 rounded-xl border border-slate-800/70">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                    Deliverables & Capabilities Included:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-900/60 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">
                      Need a custom package combining web & video?
                    </span>
                    <a
                      href={`https://wa.me/${ASAD_WHATSAPP_INTL}?text=${encodeURIComponent(`Hello Asad, I am looking for custom solutions in ${service.title}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Service Consultation CTA */}
      <div className="p-8 rounded-2xl bg-gradient-to-b from-[#131728] to-[#0A0D17] border border-slate-800 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Not Sure Which Service Fits Your Project?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Reach out directly to discuss your goals. We can review your ideas and define the exact scope, timeline, and budget.
        </p>
        <button
          onClick={() => onOpenLeadModal('Multiple Services')}
          className="px-6 py-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Request Custom Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
