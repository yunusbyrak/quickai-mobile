export interface OnboardingQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: 'single-select' | 'multi-select' | 'text-input';
  options?: OnboardingOption[];
  required?: boolean;
}

export interface OnboardingOption {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface OnboardingStep {
  id: string;
  type: 'questions' | 'promo' | 'reminder' | 'custom';
  title: string;
  component?: string;
  data?: any;
}

export interface PromoStep {
  id: string;
  type: 'promo';
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  ctaText: string;
  features?: string[];
}

export interface ReminderStep {
  id: string;
  type: 'reminder';
  title: string;
  description: string;
  image?: string;
  ctaText: string;
}

export interface OnboardingData {
  steps: OnboardingStep[];
  questions: OnboardingQuestion[];
}

export interface OnboardingState {
  currentStep: number;
  answers: Record<string, string | string[]>;
  completed: boolean;
}
