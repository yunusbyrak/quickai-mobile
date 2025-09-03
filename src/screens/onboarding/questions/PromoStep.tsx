import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { OnboardingStep } from '@/types/onboarding.d';

interface PromoStepProps {
    step: OnboardingStep;
}

export default function PromoStep({ step }: PromoStepProps) {
    return (
        <View className="items-center">
            <Text className="text-foreground text-2xl font-poppins-bold text-center mb-4 leading-8">
                {step.data?.title}
            </Text>
            {step.data?.subtitle && (
                <Text className="text-muted-foreground text-lg text-center mb-8">
                    {step.data.subtitle}
                </Text>
            )}
            <Text className="text-foreground text-base text-center mb-8 leading-6">
                {step.data?.description}
            </Text>

            {/* Features List */}
            {step.data?.features && (
                <View className="w-full mb-8">
                    {step.data.features.map((feature: string, index: number) => (
                        <View key={index} className="flex-row items-center mb-3">
                            <View className="w-2 h-2 bg-primary rounded-full mr-3" />
                            <Text className="text-foreground text-base">{feature}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
