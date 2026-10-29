import React, { useState } from 'react';
import { PageType } from '../types';
import { Menu, X, ArrowUpRight, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenLeadModal: () => void;
  onOpenAdminModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenLeadModal,
  onOpenAdminModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Portfolio', page: 'portfolio' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' }
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090A0F]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 lg:px-8 py-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-lg font-bold tracking-tight text-white hover:text-purple-300 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          ASAD ALI AWAN
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'hover:text-white text-slate-400'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Account */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Admin Vault Trigger (visible to admin or accessible to unlock) */}
          {onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              title="Admin User Directory (Restricted to Asad Ali Awan)"
              className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isAdmin
                  ? 'bg-purple-950/80 text-purple-300 border-purple-700 hover:bg-purple-900'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* User Account if authenticated (e.g. Asad) */}
          {user && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {(user.displayName || user.email)[0].toUpperCase()}
              </div>
              <span className="text-xs text-slate-300 max-w-[100px] truncate" title={user.email}>
                {user.displayName || user.email.split('@')[0]}
              </span>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="text-slate-500 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={onOpenLeadModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-sm hover:shadow-purple-500/20 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Your Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              title="Admin Directory"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0C0F19] px-6 py-5 space-y-3">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`text-left text-sm py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-purple-950/60 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            {user && (
              <div className="flex items-center justify-between py-2 px-3 bg-slate-900 rounded-lg text-xs text-slate-300">
                <span>{user.email}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-400 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}

            <button
              onClick={() => {
                onOpenLeadModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-center"
            >
              Start Your Project
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
