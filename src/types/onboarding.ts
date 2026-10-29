export type OnboardingStep = 'welcome' | 'lead-form' | 'completed';

export interface UserProfile {
  name?: string;
  email?: string;
  photoURL?: string;
  isGuest?: boolean;
  provider?: string;
}

export type LeadServiceCategory =
  | 'Website Development'
  | 'AI Chatbot Development'
  | 'AI Image Generation'
  | 'AI Video Generation'
  | 'Other';

export interface LeadFormData {
  fullName: string;
  email: string;
  whatsapp?: string;
  businessName?: string;
  service: LeadServiceCategory;
  budget?: string;
  details?: string;
  consent: boolean;
}
