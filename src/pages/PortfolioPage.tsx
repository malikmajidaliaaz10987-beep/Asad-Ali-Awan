import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { PortfolioProject, ProjectCategory, ServiceCategory } from '../types';
import { ArrowUpRight, ExternalLink, Filter, Layers, CheckCircle, X, ArrowRight, MessageSquare, Bot, Play, Sparkles } from 'lucide-react';
import { ASAD_WHATSAPP_INTL } from '../utils/whatsapp';

interface PortfolioPageProps {
  onOpenLeadModal: (service?: ServiceCategory) => void;
  selectedProject: PortfolioProject | null;
  onSelectProject: (project: PortfolioProject | null) => void;
}

type FilterType = 'All Projects' | ProjectCategory;

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onOpenLeadModal,
  selectedProject,
  onSelectProject
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All Projects');

  const filterTabs: FilterType[] = [
    'All Projects',
    'Websites',
    'AI Chatbots',
    'AI Videos',
    'AI Images',
    'AI Tools & Automation'
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (activeFilter === 'All Projects') return true;
    return p.category === activeFilter;
  });

  const mapCategoryToService = (category: ProjectCategory): ServiceCategory => {
    switch (category) {
      case 'Websites':
        return 'Business Website Development';
      case 'AI Chatbots':
        return 'AI Chatbot Development';
      case 'AI Videos':
        return 'AI Video Generation';
      case 'AI Images':
        return 'AI Image Generation';
      case 'AI Tools & Automation':
        return 'AI Workflow Automation';
      default:
        return 'Business Website Development';
    }
  };

  const handleLiveDemoClick = (e: React.MouseEvent, project: PortfolioProject) => {
    e.stopPropagation();
    if (!project.liveDemoUrl) return;

    if (project.liveDemoUrl === '#open-chatbot') {
      // Find and trigger the chatbot button on page
      const chatBtn = document.querySelector('button[aria-label="Toggle AI Voice Assistant"]') as HTMLButtonElement | null;
      if (chatBtn) {
        chatBtn.click();
      } else {
        window.location.hash = 'ai-assistant';
      }
    } else {
      window.open(project.liveDemoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block">
          Portfolio & Client Solutions
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Featured Works, AI Demos & Creative Projects
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Explore production showcases across responsive web development, conversational AI chatbots, cinematic AI video generation, commercial visuals, and automated workflow pipelines.
        </p>
        <p className="text-xs text-slate-400 font-mono">
          * Production-grade prototypes, interactive demonstrations, and creative assets engineered for global clients.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0C0F1A] border border-slate-800/80 rounded-xl w-fit">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0F121C] border border-slate-800 hover:border-purple-500/50 transition-all duration-300 flex flex-col"
          >
            {/* Visual Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F121C] via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* Category tag */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-purple-300 border border-purple-500/20">
                {project.category}
              </div>

              {project.badge && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-purple-900/80 backdrop-blur-md text-[10px] font-semibold text-purple-200 border border-purple-700/60 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-purple-300" />
                  <span>{project.badge}</span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {project.shortDescription}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mb-4">
                  {project.toolsUsed.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {tool}
                    </span>
                  ))}
                  {project.toolsUsed.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      +{project.toolsUsed.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {project.liveDemoUrl ? (
                  <button
                    type="button"
                    onClick={(e) => handleLiveDemoClick(e, project)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-purple-400 font-medium">Concept Asset</span>
                )}

                <div className="flex items-center gap-1 text-white font-semibold group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Lightbox / Detail Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-3xl bg-[#0F121C] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => onSelectProject(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded bg-black/80 backdrop-blur-md text-xs font-mono text-purple-300">
                  {selectedProject.category}
                </div>
                {selectedProject.badge && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-purple-900/90 text-xs font-semibold text-white border border-purple-600/40">
                    {selectedProject.badge}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Category: <span className="text-purple-300 font-semibold">{selectedProject.category}</span>
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Project Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedProject.fullDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Deliverables & Key Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedProject.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Tools & Technologies Used
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {selectedProject.toolsUsed.map((tool) => (
                    <span
                      key={tool}
                      className="font-mono text-xs text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2.5 py-1 rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                {selectedProject.liveDemoUrl && (
                  <button
                    type="button"
                    onClick={(e) => handleLiveDemoClick(e, selectedProject)}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-lg bg-emerald-950/20 hover:bg-emerald-950/40 flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Live Demo</span>
                  </button>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onSelectProject(null)}
                    className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      const svc = mapCategoryToService(selectedProject.category);
                      onSelectProject(null);
                      onOpenLeadModal(svc);
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Similar Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
