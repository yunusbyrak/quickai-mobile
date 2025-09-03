import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { OnboardingStep } from '@/types/onboarding.d';

interface ReminderStepProps {
    step: OnboardingStep;
}

export default function ReminderStep({ step }: ReminderStepProps) {
    return (
        <View className="items-center">
            <Text className="text-foreground text-2xl font-poppins-bold text-center mb-4 leading-8">
                {step.data?.title}
            </Text>
            <Text className="text-foreground text-base text-center mb-8 leading-6">
                {step.data?.description}
            </Text>

            {/* Placeholder for illustration */}
            <View className="w-32 h-32 bg-primary/10 rounded-full items-center justify-center mb-8">
                <MaterialIcons name="notifications" size={48} color="#FF6700" />
            </View>
        </View>
    );
}
