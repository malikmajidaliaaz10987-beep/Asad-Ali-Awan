import React from 'react';
import { PageType, ServiceCategory, PortfolioProject } from '../types';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { SERVICES_DATA } from '../data/servicesData';
import { ArrowRight, ArrowUpRight, Code, Video, Sparkles, Image, CheckCircle, Shield, Zap, Layers, MessageSquare } from 'lucide-react';
import { ASAD_WHATSAPP_INTL } from '../utils/whatsapp';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  onOpenLeadModal: (service?: ServiceCategory) => void;
  onSelectProject: (project: PortfolioProject) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenLeadModal,
  onSelectProject
}) => {
  const serviceIcons = [Code, Sparkles, Image, Video, Layers];

  return (
    <div className="w-full space-y-20 lg:space-y-28 pb-16">
      {/* 1. HERO SECTION (Split-Screen per Frontend Design Constitution) */}
      <section className="relative pt-8 sm:pt-14 lg:pt-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Unboxed natural kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wider uppercase">
              <span>Web Development</span>
              <span className="text-slate-600">·</span>
              <span>AI Content Creation</span>
              <span className="text-slate-600">·</span>
              <span>Video & Image AI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Building Powerful Websites.{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                Creating Extraordinary AI Content.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              I'm Asad Ali Awan, a web developer and AI content creator helping businesses and creators bring their ideas to life through modern websites, AI-powered visuals, and engaging video content.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenLeadModal()}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('portfolio')}
                className="px-6 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl border border-slate-700/70 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Explore My Work</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-8 text-xs text-slate-400">
              <div>
                <span className="block text-xl font-bold text-white font-mono tabular-nums">100%</span>
                <span className="text-slate-400">Custom Engineering</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="block text-xl font-bold text-white font-mono tabular-nums">24–48h</span>
                <span className="text-slate-400">Direct Inquiries Response</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="block text-xl font-bold text-white font-mono tabular-nums">Global</span>
                <span className="text-slate-400">International Clients</span>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Photo Container */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <ProfilePhoto variant="hero" className="w-full max-w-md lg:max-w-none" />
          </div>
        </div>
      </section>

      {/* 2. SERVICES HIGHLIGHTS */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block mb-1">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Services Designed to Grow Your Business
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Detailed Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.slice(0, 3).map((service, idx) => {
            const Icon = serviceIcons[idx];
            return (
              <div
                key={service.id}
                className="group p-6 rounded-2xl bg-[#0F121C] border border-slate-800 hover:border-purple-600/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-400 mb-6">
                    {service.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{service.deliverableTimeframe}</span>
                  <button
                    onClick={() => onOpenLeadModal(service.category)}
                    className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Discuss Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SELECTED PORTFOLIO PREVIEW */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase block mb-1">
              Featured Work
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Recent Projects & Visual Creations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_PROJECTS.slice(0, 2).map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0F121C] border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] text-white font-mono">
                  {project.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {project.shortDescription}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono text-purple-300">Click to view details</span>
                  <div className="flex items-center gap-1 text-slate-200 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY WORK WITH ASAD ALI AWAN */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 lg:p-12 rounded-3xl bg-gradient-to-b from-[#101424] to-[#0A0D16] border border-slate-800">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block mb-1">
              Why Work With Me
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineering Precision Meets Generative AI Artistry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              When you hire me, you work directly with the specialist who crafts your code, directs your AI visuals, and coordinates every milestone with clear communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Zap className="w-5 h-5 text-purple-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">End-to-End Creative Synergy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No need to manage a separate web developer and video creator. I blend modern web code with bespoke AI visuals for cohesive branding.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Shield className="w-5 h-5 text-blue-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Transparent & Direct Communication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct WhatsApp and email updates. Honest timelines, realistic expectations, and regular milestone reviews.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Code className="w-5 h-5 text-indigo-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Conversion-Focused Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every website and piece of content is engineered with clear calls-to-action to turn visitors into leads and paying clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="py-14 px-6 lg:px-12 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 border border-purple-800/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Launch Your Next High-Impact Digital Project?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whether you need a high-converting website, custom AI videos, or photorealistic marketing imagery, let's connect and make it happen.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onOpenLeadModal()}
                className="px-6 py-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${ASAD_WHATSAPP_INTL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 text-xs font-semibold text-black bg-[#25D366] hover:bg-[#20bd5a] rounded-xl transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
