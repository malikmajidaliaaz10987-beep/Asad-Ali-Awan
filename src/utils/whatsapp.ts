import { LeadSubmission } from '../types';

export const ASAD_WHATSAPP_NUMBER = '03164227321';
export const ASAD_WHATSAPP_INTL = '923164227321';
export const ASAD_EMAIL = 'malikmajidaliaa.z10987@gmail.com';

/**
 * Builds the exact human-readable text specified in Section 7 of the master brief.
 */
export function buildLeadWhatsAppMessage(lead: {
  fullName: string;
  email?: string;
  whatsappNumber?: string;
  service: string;
  budget?: string;
  projectDescription: string;
}): string {
  const emailText = lead.email?.trim() ? lead.email.trim() : 'Not provided';
  const phoneText = lead.whatsappNumber?.trim() ? lead.whatsappNumber.trim() : 'Not provided';
  const budgetText = lead.budget?.trim() ? lead.budget.trim() : 'Not decided yet';

  return `Hello Asad Ali Awan! I am interested in your services.

Name: ${lead.fullName.trim()}
Email: ${emailText}
WhatsApp: ${phoneText}
Service: ${lead.service}
Budget: ${budgetText}
Project Details: ${lead.projectDescription.trim()}

Please contact me to discuss my project.`;
}

/**
 * Generates the official WhatsApp click-to-chat URL.
 */
export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${ASAD_WHATSAPP_INTL}?text=${encoded}`;
}

/**
 * Generates default fast-chat URL.
 */
export function getDefaultWhatsAppUrl(customGreeting?: string): string {
  const text = customGreeting || 'Hello Asad Ali Awan! I would like to discuss a project with you.';
  return `https://wa.me/${ASAD_WHATSAPP_INTL}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates a prefilled mailto URL as a reliable secondary direct fallback.
 */
export function getMailtoUrl(lead: {
  fullName: string;
  email?: string;
  service: string;
  budget?: string;
  projectDescription: string;
}): string {
  const subject = encodeURIComponent(`Project Inquiry from ${lead.fullName} (${lead.service})`);
  const body = encodeURIComponent(
    `Hello Asad Ali Awan,\n\nI would like to discuss a project with you.\n\n` +
      `Name: ${lead.fullName}\n` +
      `Email: ${lead.email || 'Not provided'}\n` +
      `Service: ${lead.service}\n` +
      `Budget: ${lead.budget || 'Not decided yet'}\n` +
      `Project Details:\n${lead.projectDescription}\n\nLooking forward to hearing from you.`
  );
  return `mailto:${ASAD_EMAIL}?subject=${subject}&body=${body}`;
}
