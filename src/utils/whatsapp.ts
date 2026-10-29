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
  companyName?: string;
  service: string;
  budget?: string;
  deadline?: string;
  referenceUrl?: string;
  projectDescription: string;
}): string {
  const emailText = lead.email?.trim() ? lead.email.trim() : 'Not provided';
  const phoneText = lead.whatsappNumber?.trim() ? lead.whatsappNumber.trim() : 'Not provided';
  const companyText = lead.companyName?.trim() ? lead.companyName.trim() : 'Individual / Private';
  const budgetText = lead.budget?.trim() ? lead.budget.trim() : 'Not decided yet';
  const deadlineText = lead.deadline?.trim() ? lead.deadline.trim() : 'Standard';
  const refText = lead.referenceUrl?.trim() ? lead.referenceUrl.trim() : 'None provided';

  return `Hello Asad Ali Awan! I would like to request a project quotation.

Name: ${lead.fullName.trim()}
Company: ${companyText}
Email: ${emailText}
WhatsApp / Phone: ${phoneText}
Selected Service: ${lead.service}
Estimated Budget: ${budgetText}
Timeline / Deadline: ${deadlineText}
Reference / Inspiration: ${refText}

Project Requirements:
${lead.projectDescription.trim()}

Please review my requirements and let me know the next steps. Thank you!`;
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
  companyName?: string;
  service: string;
  budget?: string;
  deadline?: string;
  referenceUrl?: string;
  projectDescription: string;
}): string {
  const subject = encodeURIComponent(`Project Quotation Request from ${lead.fullName} [${lead.service}]`);
  const body = encodeURIComponent(
    `Hello Asad Ali Awan,\n\nI would like to request a project quotation.\n\n` +
      `Name: ${lead.fullName}\n` +
      `Company: ${lead.companyName || 'N/A'}\n` +
      `Email: ${lead.email || 'Not provided'}\n` +
      `Service: ${lead.service}\n` +
      `Estimated Budget: ${lead.budget || 'Not decided yet'}\n` +
      `Target Deadline: ${lead.deadline || 'Standard'}\n` +
      `Reference Link: ${lead.referenceUrl || 'None'}\n\n` +
      `Project Description:\n${lead.projectDescription}\n\nLooking forward to your quotation.`
  );
  return `mailto:${ASAD_EMAIL}?subject=${subject}&body=${body}`;
}
