import React, { useState, useEffect } from 'react';
import { X, Inbox, Download, Trash2, Calendar, Phone, Mail, User, Check, RefreshCw } from 'lucide-react';
import { LeadSubmission } from '../types';
import { getStoredLeads, clearLeads } from '../utils/leadStorage';

interface LeadVaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadVaultDrawer: React.FC<LeadVaultDrawerProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<LeadSubmission[]>([]);

  const loadLeads = () => {
    setLeads(getStoredLeads());
  };

  useEffect(() => {
    if (isOpen) {
      loadLeads();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `asad_leads_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear stored leads from this device?')) {
      clearLeads();
      setLeads([]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl bg-[#0F121C] border border-slate-700 rounded-2xl shadow-2xl p-6 text-left max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Owner Lead Vault</h3>
              <p className="text-xs text-slate-400">
                Persistent storage of inquiries submitted through this website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="py-3 flex items-center justify-between border-b border-slate-800 shrink-0 text-xs">
          <span className="text-slate-300 font-medium">
            Total Leads Saved: <strong className="text-white font-mono">{leads.length}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={loadLeads}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
              title="Refresh leads"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {leads.length > 0 && (
              <>
                <button
                  onClick={exportAsJSON}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={handleClear}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Clear leads"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {leads.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm">No inquiries recorded yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When visitors submit the "Start Your Project" or Contact form, inquiries are automatically saved here with full details.
              </p>
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{lead.fullName}</h4>
                    <span className="text-[11px] font-mono text-purple-400 block">
                      {lead.service} {lead.budget ? `· ${lead.budget}` : ''}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(lead.timestamp).toLocaleDateString()} {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-slate-300 pt-1 text-[11px]">
                  {lead.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{lead.email}</span>
                    </div>
                  )}
                  {lead.whatsappNumber && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span className="font-mono">{lead.whatsappNumber}</span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 rounded bg-black/60 text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px] border border-slate-800">
                  {lead.projectDescription}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
