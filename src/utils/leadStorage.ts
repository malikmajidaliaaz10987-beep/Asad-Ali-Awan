import { LeadSubmission } from '../types';

const LEADS_STORAGE_KEY = 'asad_portfolio_leads_v1';

export function getStoredLeads(): LeadSubmission[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read stored leads', err);
    return [];
  }
}

export function saveLead(
  lead: Omit<LeadSubmission, 'id' | 'timestamp' | 'status'>
): LeadSubmission {
  const newLead: LeadSubmission = {
    ...lead,
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    status: 'new'
  };

  const current = getStoredLeads();
  const updated = [newLead, ...current];

  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to write lead to localStorage', err);
  }

  // Optional backend endpoint sync (if backend is active)
  try {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).catch(() => {
      // Quiet background failure: offline or client-only mode
    });
  } catch {
    // Ignore fetch error
  }

  return newLead;
}

export function clearLeads(): void {
  try {
    localStorage.removeItem(LEADS_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}
