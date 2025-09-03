import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { OnboardingStep } from '@/types/onboarding.d';
import { onboardingData } from '@/constants/onboarding';

interface QuestionStepProps {
    step: OnboardingStep;
    answers: Record<string, string | string[]>;
    onOptionSelect: (questionId: string, optionValue: string) => void;
}

export default function QuestionStep({
    step,
    answers,
    onOptionSelect
}: QuestionStepProps) {
    const question = onboardingData.questions.find(q => q.id === step.id);

    if (!question) return null;

    return (
        <>
            {/* Question Title */}
            <Text className="text-foreground text-2xl font-poppins-bold text-center mb-12 leading-8">
                {question.title}
            </Text>

            {/* Options */}
            <View className="gap-4">
                {question.options?.map((option) => (
                    <Pressable
                        key={option.id}
                        onPress={() => onOptionSelect(question.id, option.value)}
                        className={cn(
                            "w-full p-4 rounded-2xl border transition-all",
                            answers[question.id] === option.value
                                ? "bg-primary/10 border-primary"
                                : "dark:border-[#1E1E1E] border-foreground"
                        )}
                    >
                        <Text className={cn(
                            "text-center font-poppins-medium text-base",
                            answers[question.id] === option.value
                                ? "text-primary"
                                : "text-foreground"
                        )}>
                            {option.label}
                        </Text>
                        {option.description && (
                            <Text className="text-muted-foreground text-sm text-center mt-2">
                                {option.description}
                            </Text>
                        )}
                    </Pressable>
                ))}
            </View>
        </>
    );
}
