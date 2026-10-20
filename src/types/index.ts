export type PageType = 'home' | 'services' | 'portfolio' | 'about' | 'contact';

export type ServiceCategory =
  | 'Website Development'
  | 'AI Content Creation'
  | 'AI Image Generation'
  | 'AI Video Generation'
  | 'Multiple Services'
  | 'Other';

export type BudgetRange =
  | 'Under $100'
  | '$100–$500'
  | '$500–$1,000'
  | '$1,000+'
  | 'Not decided yet';

export interface LeadSubmission {
  id: string;
  fullName: string;
  email?: string;
  whatsappNumber?: string;
  service: ServiceCategory;
  budget?: BudgetRange;
  projectDescription: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'archived';
}

export type ProjectCategory = 'Websites' | 'AI Videos' | 'AI Images' | 'AI Content';

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
}

export interface CookiePreferences {
  strictlyNecessary: boolean;
  analytics: boolean;
  marketing: boolean;
  hasConsented: boolean;
  consentDate?: string;
}
