import { View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link } from 'expo-router';

const features = [
    {
        id: 1,
        icon: 'graphic-eq',
        title: '99% Accurate Transcription',
        description: 'Capture every detail without a hustle',
        iconLibrary: 'MaterialIcons' as const,
    },
    {
        id: 2,
        icon: 'edit',
        title: 'AI Rewriting',
        description: 'Make your notes clearer and more refined',
        iconLibrary: 'MaterialIcons' as const,
    },
    {
        id: 3,
        icon: 'lightbulb',
        title: 'AI-Powered Creativity Tools',
        description: 'Turn your ideas into Mind Maps, Flashcards, To-Do Lists, and more instantly',
        iconLibrary: 'Ionicons' as const,
    },
    {
        id: 4,
        icon: 'translate',
        title: 'Multilingual Magic',
        description: 'Translate between 90+ languages',
        iconLibrary: 'MaterialIcons' as const,
    },
    {
        id: 5,
        icon: 'highlight',
        title: 'Smart Highlights & Summaries',
        description: 'Extract crucial points and provides concise summaries',
        iconLibrary: 'MaterialCommunityIcons' as const,
    },
];

function FeatureItem({ feature }: { feature: typeof features[0] }) {
    const IconComponent =
        feature.iconLibrary === 'MaterialIcons' ? MaterialIcons :
            feature.iconLibrary === 'Ionicons' ? Ionicons :
                MaterialCommunityIcons;

    return (
        <View className="flex-row items-start gap-1 mb-4">
            <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-start pt-1">
                <IconComponent
                    name={feature.icon as any}
                    size={28}
                    color="#FF6700"
                />
            </View>
            <View className="flex-1">
                <Text className="text-foreground font-medium font-poppins-semibold">
                    {feature.title}
                </Text>
                <Text className="text-muted-foreground text-xs font-poppins leading-5">
                    {feature.description}
                </Text>
            </View>
        </View>
    );
}

export default function Welcome() {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 bg-background px-4"
            style={{
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 16),
            }}
        >
            {/* Header Section */}
            <View className="items-center flex-1 justify-center">
                {/* Logo */}
                <View className="items-center mb-8">
                    <View className="w-28 h-28 items-center justify-center mb-6">
                        <Image
                            source={require('~/assets/images/logo-3d.png')}
                            className="w-28 h-28"
                            resizeMode="contain"
                        />
                    </View>

                    <Text className="text-foreground text-3xl font-poppins-bold text-center mb-2">
                        Quick AI
                    </Text>
                    <Text className="text-primary font-medium font-poppins-medium">
                        Easy, Fast, and Accurate
                    </Text>
                </View>

                {/* Features Section */}
                <View className="w-full">
                    {features.map((feature) => (
                        <FeatureItem key={feature.id} feature={feature} />
                    ))}
                </View>
                <ThemeToggle />
            </View>

            {/* Fixed CTA Button */}
            <View className="pb-4">
                <Link href="/(onboarding)/informations" asChild>
                    <Button
                        className="w-full h-14 rounded-2xl"
                    >
                        <Text className="text-white text-lg font-poppins-semibold">
                            Get Started
                        </Text>
                    </Button>
                </Link>
            </View>
        </View>
    );
}
