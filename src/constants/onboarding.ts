import { OnboardingData } from '@/types/onboarding.d';

export const onboardingData: OnboardingData = {
  steps: [
    {
      id: 'primary-use',
      type: 'questions',
      title: 'Primary Use Question'
    },
    {
      id: 'free-trial-promo',
      type: 'promo',
      title: 'Free Trial Offer',
      data: {
        title: "We want you to try Transcribe AI for FREE for 3 days.",
        subtitle: "Experience the power of AI transcription",
        description: "Get unlimited access to all features including AI-powered summaries, translations, and more.",
        ctaText: "Continue",
        features: [
          "Unlimited transcriptions",
          "AI-powered summaries",
          "Multi-language support",
          "Advanced editing tools"
        ]
      }
    },
    {
      id: 'language-preference',
      type: 'questions',
      title: 'Language Preference'
    },
    {
      id: 'trial-reminder',
      type: 'reminder',
      title: 'Trial Reminder',
      data: {
        title: "We'll send you a reminder before your free trial ends.",
        description: "No surprises, just a friendly heads up so you can decide what works best for you.",
        ctaText: "Continue"
      }
    }
  ],
  questions: [
    {
      id: 'primary-use',
      title: 'What best describe your primary use of this app?',
      type: 'single-select',
      required: true,
      options: [
        {
          id: 'academic',
          label: 'Academic Transcription',
          value: 'academic'
        },
        {
          id: 'professional',
          label: 'Professional Transcription',
          value: 'professional'
        },
        {
          id: 'summaries',
          label: 'Creating readable summaries from spoken content',
          value: 'summaries'
        },
        {
          id: 'translation',
          label: 'Language translation & transcription for communication',
          value: 'translation'
        }
      ]
    },
    {
      id: 'language-preference',
      title: 'What languages do you primarily work with or want to transcribe?',
      type: 'single-select',
      required: true,
      options: [
        {
          id: 'english',
          label: 'English',
          value: 'english'
        },
        {
          id: 'non-english',
          label: 'Non-English',
          value: 'non-english'
        },
        {
          id: 'multi-languages',
          label: 'Multi Languages',
          value: 'multi-languages'
        }
      ]
    }
  ]
};
