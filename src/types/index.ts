export type PageType = 'home' | 'services' | 'portfolio' | 'about' | 'contact';

export type ServiceCategory =
  | 'Business Website Development'
  | 'E-commerce Website Development'
  | 'AI Chatbot Development'
  | 'AI Image Generation'
  | 'AI Video Generation'
  | 'AI Workflow Automation'
  | 'Website Development'
  | 'AI Content Creation'
  | 'Multiple Services'
  | 'Other';

export type BudgetRange =
  | 'Under $500'
  | '$500–$1,500'
  | '$1,500–$3,500'
  | '$3,500–$7,500'
  | '$7,500+'
  | 'Not decided yet';

export type DeadlineOption =
  | 'Within 1–2 weeks (Urgent)'
  | '2–4 weeks (Standard)'
  | '1–2 months'
  | 'Flexible / Ongoing';

export interface LeadSubmission {
  id: string;
  fullName: string;
  email?: string;
  whatsappNumber?: string;
  companyName?: string;
  service: ServiceCategory;
  budget?: BudgetRange;
  deadline?: DeadlineOption | string;
  referenceUrl?: string;
  projectDescription: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'archived';
  source?: string;
}

export type ProjectCategory =
  | 'Websites'
  | 'AI Chatbots'
  | 'AI Videos'
  | 'AI Images'
  | 'AI Tools & Automation'
  | 'AI Content';

export interface PortfolioProject {
  id: string;
  title: string;
  category: ProjectCategory;
  image: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  toolsUsed: string[];
  externalLink?: string;
  liveDemoUrl?: string;
  badge?: string;
  isDemonstration?: boolean;
}

export interface ServiceDetail {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  description: string;
  features: string[];
  highlight: string;
  deliverableTimeframe: string;
  startingPrice?: string;
}

export interface CookiePreferences {
  strictlyNecessary: boolean;
  analytics: boolean;
  marketing: boolean;
  hasConsented: boolean;
  consentDate?: string;
}
