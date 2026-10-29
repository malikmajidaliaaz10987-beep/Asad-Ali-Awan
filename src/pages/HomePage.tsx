import React, { useState } from 'react';
import { PageType, ServiceCategory, PortfolioProject } from '../types';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { SERVICES_DATA } from '../data/servicesData';
import {
  ArrowRight,
  ArrowUpRight,
  Code,
  Bot,
  Video,
  Image,
  Cpu,
  CheckCircle,
  Shield,
  Zap,
  Layers,
  MessageSquare,
  ChevronDown,
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What services does Asad Ali Awan provide?',
      a: 'Asad Ali Awan provides professional full-stack website development (business websites, SaaS landing pages, e-commerce storefronts), custom AI chatbot development with voice capabilities (powered by Google Gemini), AI video generation (cinematic brand reels, social ads), commercial AI image generation, and intelligent AI workflow automations.'
    },
    {
      q: 'How does the Gemini AI Chatbot work on my website?',
      a: 'The chatbot connects to Google Gemini via a secure server-side proxy (so your API key is never exposed in browser code). It can be customized with your company’s services, pricing, and FAQ knowledge, and includes real-time microphone voice speech-to-text and audio speech synthesis.'
    },
    {
      q: 'What is the typical turnaround time for a project?',
      a: 'Project delivery depends on the scope: standard business websites and landing pages are typically delivered within 3–7 business days, AI chatbots within 2–5 days, and AI video or image packages within 1–4 days. Every project includes structured milestone reviews and revisions.'
    },
    {
      q: 'Do you work with international clients (US, UK, Europe)?',
      a: 'Yes! Over 80% of projects are for clients across the United States, United Kingdom, Europe, and UAE. Communication is handled via WhatsApp, email, or video call with clear milestones and time-zone flexibility.'
    },
    {
      q: 'How do we get started or request a quotation?',
      a: 'Click "Start Your Project" or "Request Quotation" to open the guided quotation form, or reach out directly on WhatsApp at +92 316 4227321. You will receive a detailed estimate and proposal within 24 hours.'
    }
  ];

  return (
    <div className="w-full space-y-20 lg:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 lg:pt-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Natural Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-purple-400 tracking-wider uppercase">
              <span>Web Engineering</span>
              <span className="text-slate-600">·</span>
              <span>AI Chatbots</span>
              <span className="text-slate-600">·</span>
              <span>AI Video & Imagery</span>
              <span className="text-slate-600">·</span>
              <span>Workflow Automation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              Building Powerful Websites.{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                Creating Extraordinary AI Solutions.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              I'm Asad Ali Awan, a full-stack web developer and AI engineer helping global businesses scale through high-converting websites, voice-enabled AI chatbots, cinematic videos, and automated business workflows.
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
                <span>Explore Live Demos</span>
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
                <span className="text-slate-400">Response Guaranteed</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="block text-xl font-bold text-white font-mono tabular-nums">Worldwide</span>
                <span className="text-slate-400">US & International Clients</span>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Photo Container */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <ProfilePhoto variant="hero" className="w-full max-w-md lg:max-w-none" />
          </div>
        </div>
      </section>

      {/* 2. CORE SERVICES HIGHLIGHTS */}
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
            <span>View All 6 Core Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.slice(0, 3).map((service, idx) => {
            const icons = [Code, Bot, Video];
            const Icon = icons[idx] || Code;
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
                  <span className="text-[11px] text-slate-500 font-mono">{service.deliverableTimeframe}</span>
                  <button
                    onClick={() => onOpenLeadModal(service.category)}
                    className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SELECTED PORTFOLIO & LIVE DEMOS PREVIEW */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase block mb-1">
              Featured Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Recent Projects & Interactive Demos
            </h2>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Full Portfolio (5 Categories)</span>
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
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] text-purple-300 font-mono">
                  {project.category}
                </div>
                {project.badge && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-purple-900/80 text-[10px] text-white font-semibold">
                    {project.badge}
                  </div>
                )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Zap className="w-5 h-5 text-purple-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">End-to-End Synergy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No need to manage a separate web developer, chatbot builder, and video creator. I blend modern web code with bespoke AI solutions for cohesive branding.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Shield className="w-5 h-5 text-blue-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Direct Communication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct WhatsApp and email updates. Honest timelines, realistic expectations, and regular milestone reviews with zero friction.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <Code className="w-5 h-5 text-indigo-400 mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Conversion-Focused Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every website and AI assistant is engineered with clear calls-to-action to turn visitors into leads and paying clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE FAQ SECTION (Optimized for GEO / AI Search Grounding) */}
      <section className="px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Common Inquiries About Working With Asad
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about our web engineering, AI chatbots, delivery timelines, and international collaboration.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-[#0F121C] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="py-14 px-6 lg:px-12 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-blue-950/40 border border-purple-800/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Launch Your Next High-Impact Digital Project?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whether you need a high-converting website, custom AI chatbot, videos, or photorealistic marketing imagery, let's connect and make it happen.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onOpenLeadModal()}
                className="px-6 py-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Request Quotation</span>
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
