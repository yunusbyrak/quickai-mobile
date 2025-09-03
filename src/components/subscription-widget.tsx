import React from 'react';
import { View, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const premiumFeatures = [
    {
        id: 1,
        text: 'Create unlimited transcripts',
        icon: 'star' as const,
    },
    {
        id: 2,
        text: 'Record voice up to 2-hours',
        icon: 'star' as const,
    },
    {
        id: 3,
        text: 'Rewrite in famous author\'s style',
        icon: 'star' as const,
    },
    {
        id: 4,
        text: 'Turn your ideas into mind maps, flashcards, to-do lists, and more instantly',
        icon: 'star' as const,
    },
    {
        id: 5,
        text: 'Support 90+ Languages',
        icon: 'star' as const,
    },
    {
        id: 6,
        text: 'FREE high accuracy transcription',
        icon: 'star' as const,
    },
];

interface SubscriptionWidgetProps {
    onUpgrade?: () => void;
}

export function SubscriptionWidget({ onUpgrade }: SubscriptionWidgetProps) {
    return (
        <View className="bg-primary rounded-2xl p-6 mx-4 mb-6">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-white text-xl font-poppins-semibold">
                    Upgrade To Premium
                </Text>
                <View className="w-16 h-16">
                    <Image
                        source={require('~/assets/images/logo-3d.png')}
                        className="w-16 h-16"
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* Features List */}
            <View className="gap-3 mb-6">
                {premiumFeatures.map((feature) => (
                    <View key={feature.id} className="flex-row items-center gap-3">
                        <MaterialIcons
                            name={feature.icon}
                            size={16}
                            color="#FFF"
                        />
                        <Text className="text-white text-sm font-poppins flex-1">
                            {feature.text}
                        </Text>
                    </View>
                ))}
            </View>

            {/* CTA Button */}
            <Button
                variant="secondary"
                className="w-full h-12 rounded-xl"
                onPress={onUpgrade}
            >
                <Text className="text-black dark:text-white text-base font-poppins-semibold">
                    Subscribe Now
                </Text>
            </Button>
        </View>
    );
}
