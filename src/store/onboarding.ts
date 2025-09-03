import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OnboardingState } from '@/types/onboarding.d';
import { zustandStorage } from '@/lib/storage/zustand';

interface OnboardingStore extends OnboardingState {
    setCurrentStep: (step: number) => void;
    setAnswer: (questionId: string, answer: string | string[]) => void;
    markCompleted: () => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
    persist(
        (set, get) => ({
            currentStep: 0,
            answers: {},
            completed: false,

            setCurrentStep: (step: number) =>
                set({ currentStep: step }),

            setAnswer: (questionId: string, answer: string | string[]) =>
                set((state) => ({
                    answers: {
                        ...state.answers,
                        [questionId]: answer
                    }
                })),

            markCompleted: () =>
                set({ completed: true }),

            reset: () =>
                set({ currentStep: 0, answers: {}, completed: false })
        }),
        {
            name: 'onboarding-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
