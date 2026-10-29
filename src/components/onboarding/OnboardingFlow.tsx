import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { LeadGenerationForm } from './LeadGenerationForm';
import { UserProfile, LeadFormData, OnboardingStep } from '../../types/onboarding';

interface OnboardingFlowProps {
  onComplete: (lead?: LeadFormData) => void;
  onOpenPrivacyPolicy: () => void;
}

export const ONBOARDING_COMPLETED_KEY = 'asad_onboarding_completed_v1';
export const USER_PROFILE_KEY = 'asad_user_profile_v1';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onOpenPrivacyPolicy,
}) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'lead-form'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(() => {
    try {
      const stored = localStorage.getItem(USER_PROFILE_KEY);
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  });

  const handleWelcomeContinue = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
    setCurrentStep('lead-form');
  };

  const handleLeadSubmitSuccess = (lead: LeadFormData) => {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch {
      // ignore
    }
    onComplete(lead);
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
  };

  if (currentStep === 'welcome') {
    return (
      <WelcomeScreen
        onContinue={handleWelcomeContinue}
        onOpenPrivacyPolicy={onOpenPrivacyPolicy}
      />
    );
  }

  return (
    <LeadGenerationForm
      userProfile={userProfile}
      onSubmitSuccess={handleLeadSubmitSuccess}
      onBackToWelcome={handleBackToWelcome}
      onOpenPrivacyPolicy={onOpenPrivacyPolicy}
    />
  );
};
