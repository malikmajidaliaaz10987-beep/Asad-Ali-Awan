import React from 'react';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { ServiceCategory } from '../types';
import { ArrowRight, Code, Sparkles, MessageSquare, Compass, ShieldCheck, Mail, CheckCircle } from 'lucide-react';
import { ASAD_WHATSAPP_INTL, ASAD_EMAIL, ASAD_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface AboutPageProps {
  onOpenLeadModal: (service?: ServiceCategory) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenLeadModal }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16 space-y-16">
      {/* Hero Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
        {/* Left: Profile Photo */}
        <div className="lg:col-span-5 flex justify-center">
          <ProfilePhoto variant="about" className="w-full max-w-md lg:max-w-none" />
        </div>

        {/* Right: Narrative & Introduction */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block">
              About The Specialist
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Meet Asad Ali Awan
            </h1>
            <p className="text-xs font-mono text-purple-300">
              Web Developer | AI Content Creator | AI Video & Image Generation Specialist
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F121C] border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
            "I'm Asad Ali Awan, a web developer and AI content creator passionate about building modern digital experiences and producing creative visual content. My work combines website development, thoughtful design, and AI-powered video and image creation to help clients communicate their ideas online."
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              In today's fast-moving digital landscape, having a website is only half the formula. Businesses and creators need captivating visual assets—from cinematic promotional videos to branded imagery—that immediately hook an audience.
            </p>
            <p>
              I bridge the gap between technical web development and modern generative AI tools. Rather than juggling multiple freelancers or agencies, you collaborate directly with an agile creator who can engineer your frontend codebase and simultaneously produce your digital creative content.
            </p>
          </div>

          {/* Core Areas of Interest & Focus */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Professional Focus Areas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-200">Modern Responsive Web Engineering</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-200">Cinematic AI Video Generation</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-200">Commercial AI Imagery & Concept Art</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">High-Converting Visual Landing Pages</span>
              </div>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLeadModal()}
              className="px-6 py-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Discuss a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${ASAD_WHATSAPP_INTL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 text-xs font-medium text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Creative Approach & Philosophy */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0A0D17] border border-slate-800 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block mb-1">
            Work Ethics & Approach
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Creative & Professional Approach
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-purple-400 font-mono text-sm font-bold">01. Discovery & Alignment</div>
            <h4 className="text-base font-semibold text-white">Understanding Your Goal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every project begins with a clear conversation about your target audience, required deliverables, design tastes, and expected timeline.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-blue-400 font-mono text-sm font-bold">02. Agile Execution</div>
            <h4 className="text-base font-semibold text-white">Rapid Prototyping & Iteration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              I produce functional prototypes, test visual variations, and share updates regularly so you are never left guessing where the project stands.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-emerald-400 font-mono text-sm font-bold">03. Honest Delivery</div>
            <h4 className="text-base font-semibold text-white">Full Transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean code, full asset handoff, straightforward communication, and ongoing support to ensure your assets function smoothly in the real world.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-400" />
            <span>Dedicated to long-term client relationships and prompt support.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>WhatsApp: <strong className="font-mono text-white">{ASAD_WHATSAPP_NUMBER}</strong></span>
            <span>·</span>
            <span>Email: <strong className="text-white">{ASAD_EMAIL}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
