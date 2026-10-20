import React, { useState, useEffect } from 'react';
import { PageType, ServiceCategory, PortfolioProject } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LeadModal } from './components/LeadModal';
import { CookieBanner } from './components/CookieBanner';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { LeadVaultDrawer } from './components/LeadVaultDrawer';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { Database, Inbox } from 'lucide-react';

const WELCOME_POPUP_DISMISSED_KEY = 'asad_welcome_popup_dismissed_v1';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadModalService, setLeadModalService] = useState<ServiceCategory | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  // Compliance & Modals
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCookieCustomizerOpen, setIsCookieCustomizerOpen] = useState(false);
  const [isLeadVaultOpen, setIsLeadVaultOpen] = useState(false);

  // Handle URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'services', 'portfolio', 'about', 'contact'].includes(hash)) {
        setCurrentPage(hash as PageType);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Welcome Lead-Capture Popup (Section 7)
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(WELCOME_POPUP_DISMISSED_KEY);
      if (!dismissed) {
        // Appears after a pleasant 7-second dwell, not immediately before render
        const timer = setTimeout(() => {
          setIsLeadModalOpen(true);
          sessionStorage.setItem(WELCOME_POPUP_DISMISSED_KEY, 'true');
        }, 7000);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleOpenLeadModal = (service?: ServiceCategory) => {
    setLeadModalService(service);
    setIsLeadModalOpen(true);
  };

  const handleCloseLeadModal = () => {
    setIsLeadModalOpen(false);
    try {
      sessionStorage.setItem(WELCOME_POPUP_DISMISSED_KEY, 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-200 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-200">
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenLeadModal={() => handleOpenLeadModal()}
      />

      {/* Main Content View (Strictly 5 Primary Pages) */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenLeadModal={handleOpenLeadModal}
            onSelectProject={(proj) => setSelectedProject(proj)}
          />
        )}
        {currentPage === 'services' && (
          <ServicesPage onOpenLeadModal={handleOpenLeadModal} />
        )}
        {currentPage === 'portfolio' && (
          <PortfolioPage
            onOpenLeadModal={handleOpenLeadModal}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage onOpenLeadModal={handleOpenLeadModal} />
        )}
        {currentPage === 'contact' && <ContactPage />}
      </main>

      {/* Discreet Owner Leads Quick Access Trigger */}
      <div className="w-full bg-[#05060A] py-2 px-6 border-t border-slate-900/60 text-center">
        <button
          onClick={() => setIsLeadVaultOpen(true)}
          className="text-[11px] text-slate-500 hover:text-purple-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Client Lead Vault (View & Export Stored Inquiries)</span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenCookieSettings={() => setIsCookieCustomizerOpen(true)}
        onOpenLeadModalWithService={(service) => handleOpenLeadModal(service)}
      />

      {/* Fixed WhatsApp Button on All 5 Pages */}
      <FloatingWhatsApp />

      {/* Lead Capture Modal (Welcome popup & CTA triggers) */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={handleCloseLeadModal}
        preselectedService={leadModalService}
        title="Start Your Project"
        subtitle="Tell me about your website or AI creative vision. Let's discuss scope, timeline, and pricing."
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Cookie Consent Banner & Preferences Customizer */}
      <CookieBanner
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        forceOpenModal={isCookieCustomizerOpen}
        onCloseModal={() => setIsCookieCustomizerOpen(false)}
      />

      {/* Owner Lead Inquiries Drawer */}
      <LeadVaultDrawer
        isOpen={isLeadVaultOpen}
        onClose={() => setIsLeadVaultOpen(false)}
      />
    </div>
  );
}
