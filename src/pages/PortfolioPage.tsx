import React, { useState } from 'react';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { PortfolioProject, ProjectCategory, ServiceCategory } from '../types';
import { ArrowUpRight, ExternalLink, Filter, Layers, CheckCircle, X, ArrowRight, MessageSquare, Code2 } from 'lucide-react';
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
    'AI Videos',
    'AI Images',
    'AI Content'
  ];

  const filteredProjects = PORTFOLIO_PROJECTS.filter((p) => {
    if (activeFilter === 'All Projects') return true;
    return p.category === activeFilter;
  });

  const mapCategoryToService = (category: ProjectCategory): ServiceCategory => {
    switch (category) {
      case 'Websites':
        return 'Website Development';
      case 'AI Videos':
        return 'AI Video Generation';
      case 'AI Images':
        return 'AI Image Generation';
      case 'AI Content':
        return 'AI Content Creation';
      default:
        return 'Website Development';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase block">
          Portfolio & Creative Showcase
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Featured Works & Creative Concepts
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Explore demonstration showcases across responsive web development, cinematic AI video generation, commercial AI visuals, and digital creative content.
        </p>
        <p className="text-xs text-slate-400 font-mono">
          * Demonstration prototypes and concept assets created to illustrate capabilities.
        </p>
      </div>

      {/* Filter Tabs (Interactive Segmented Buttons per Frontend Design Constitution) */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/75 backdrop-blur-md text-xs font-mono text-purple-300 border border-purple-500/20">
                {project.category}
              </div>

              {project.isDemonstration && (
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded bg-slate-900/80 text-[10px] text-slate-400 border border-slate-700">
                  Concept Showcase
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {project.shortDescription}
                </p>

                {/* Tools/Tags: Rendered as clean unboxed typography per Frontend Design Constitution */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4">
                  {project.toolsUsed.map((tool, idx) => (
                    <React.Fragment key={tool}>
                      <span className="font-mono text-[11px] text-slate-400">{tool}</span>
                      {idx < project.toolsUsed.length - 1 && <span className="text-slate-600">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-purple-400 font-medium">Click to inspect project details</span>
                <div className="flex items-center gap-1 text-white font-semibold group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Easy Customization Instructions Notice */}
      <div className="p-6 rounded-2xl bg-[#0B0E17] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <span className="font-semibold text-white block mb-0.5">Customizing Portfolio Projects</span>
          <p className="text-slate-400">
            Easily update, replace, or add your projects anytime by editing <code className="text-purple-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">src/data/portfolioData.ts</code>.
          </p>
        </div>
        <button
          onClick={() => onOpenLeadModal('Website Development')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          Request Project
        </button>
      </div>

      {/* Project Lightbox / Detail Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
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
                  Deliverables & Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedProject.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-900 border border-slate-800">
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
                  {selectedProject.toolsUsed.map((tool, idx) => (
                    <React.Fragment key={tool}>
                      <span className="font-mono text-xs text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2.5 py-1 rounded">
                        {tool}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => onSelectProject(null)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>

                <button
                  onClick={() => {
                    const svc = mapCategoryToService(selectedProject.category);
                    onSelectProject(null);
                    onOpenLeadModal(svc);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Inquire About a Project Like This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
