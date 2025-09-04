import React, { useCallback, useMemo } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    withSpring
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { onboardingData } from '@/constants/onboarding';
import { useTheme } from '@/context/ThemeContext';
import PromoStep from '@/screens/onboarding/questions/PromoStep';
import ReminderStep from '@/screens/onboarding/questions/ReminderStep';
import QuestionStep from '@/screens/onboarding/questions/QuestionStep';
import { useAuth } from '@/context/AuthContext';
import { useOnboardingStore } from '@/store/onboarding';





export default function Questions() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { session } = useAuth();
    const { markCompleted } = useOnboardingStore();
    const { isDark } = useTheme();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

    // Get steps from onboarding data
    const steps = useMemo(() => onboardingData.steps, []);
    const currentStep = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex]);
    const progress = useMemo(() => ((currentStepIndex + 1) / steps.length) * 100, [currentStepIndex, steps.length]);

    // Animation values
    const progressValue = useSharedValue(0);
    const questionOpacity = useSharedValue(1);
    const questionTranslateY = useSharedValue(0);

    // Initialize animation values on mount and when component returns
    useEffect(() => {
        questionOpacity.value = 1;
        questionTranslateY.value = 0;
        progressValue.value = 0;
    }, []);

    // Reset animation values when component comes into focus (e.g., from router.push)
    useFocusEffect(
        React.useCallback(() => {
            questionOpacity.value = 1;
            questionTranslateY.value = 0;
        }, [])
    );

    // Update progress animation when step index changes
    useEffect(() => {
        progressValue.value = withTiming(progress, {
            duration: 300, // Reduced from 600ms
            easing: Easing.out(Easing.cubic)
        });

        // Reset question animation values when step changes
        questionOpacity.value = withTiming(1, { duration: 200 }); // Reduced from 300ms
        questionTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 }); // Optimized spring
    }, [currentStepIndex, progress]);

    // Animated styles
    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${progressValue.value}%`
    }));

    const animatedQuestionStyle = useAnimatedStyle(() => ({
        opacity: questionOpacity.value,
        transform: [{ translateY: questionTranslateY.value }]
    }));

    const handleOptionSelect = useCallback((questionId: string, optionValue: string) => {
        if (currentStep?.type === 'questions') {
            setAnswers(prev => ({
                ...prev,
                [questionId]: optionValue
            }));

            // Animate step transition
            questionOpacity.value = withTiming(0, { duration: 150 });
            questionTranslateY.value = withSpring(-15, { damping: 15, stiffness: 200 });

            // Auto-advance to next step after animation
            setTimeout(() => {
                if (currentStepIndex < steps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                    // Reset animation values for new step
                    questionOpacity.value = withTiming(1, { duration: 200 });
                    questionTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
                } else {
                    // All steps completed - navigate to main app
                    router.replace('/(main)/home');
                }
            }, 150);
        }
    }, [currentStep?.type, currentStepIndex, steps.length, router]);

    const handleNext = useCallback(() => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            // All steps completed - navigate to main app
            markCompleted(session?.user?.id || '');
            router.replace('/(main)/home');
        }
    }, [currentStepIndex, steps.length, router]);

    const handleBack = useCallback(() => {
        if (currentStepIndex > 0) {
            // Animate step transition when going back
            questionOpacity.value = withTiming(0, { duration: 150 });
            questionTranslateY.value = withSpring(15, { damping: 15, stiffness: 200 });

            setTimeout(() => {
                setCurrentStepIndex(currentStepIndex - 1);
            }, 150);
        } else {
            router.back();
        }
    }, [currentStepIndex, router]);

    const isAnswered = useMemo(() => {
        if (currentStep?.type === 'questions') {
            const question = onboardingData.questions.find(q => q.id === currentStep.id);
            return question && answers[question.id];
        }
        return true; // For non-question steps, always allow continue
    }, [currentStep, answers]);

    if (!currentStep) {
        return null;
    }

    return (
        <View
            className="flex-1 bg-background"
            style={{
                paddingBottom: Math.max(insets.bottom, 16),
            }}
        >
            {/* Header Gradient Image */}
            <View className="absolute top-0 left-0 right-0 items-center">
                <Image
                    source={require('~/assets/images/header-gradient.png')}
                    className="w-full"
                    resizeMode="cover"
                />
            </View>

            {/* Header with Back Button and Progress */}
            <View
                className="flex-row items-center justify-between px-4 pb-4"
                style={{ paddingTop: Math.max(insets.top, 16) }}
            >
                <TouchableOpacity onPress={handleBack} className="p-2">
                    <MaterialIcons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>

                {/* Progress Bar */}
                <View className="flex-1 mx-4 h-2 bg-white rounded-full">
                    <Animated.View
                        className="h-full bg-primary rounded-full"
                        style={animatedProgressStyle}
                    />
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <Animated.View className="flex-1 justify-center min-h-[600px]" style={animatedQuestionStyle}>
                    {currentStep.type === 'questions' ? (
                        <QuestionStep
                            step={currentStep}
                            answers={answers}
                            onOptionSelect={handleOptionSelect}
                        />
                    ) : currentStep.type === 'promo' ? (
                        <PromoStep step={currentStep} />
                    ) : currentStep.type === 'reminder' ? (
                        <ReminderStep step={currentStep} />
                    ) : null}
                </Animated.View>
            </ScrollView>

            {/* Continue Button */}
            <View className="px-4 pb-4">
                <Button
                    onPress={handleNext}
                    className={cn(
                        "w-full h-14 rounded-2xl",
                        isAnswered ? "bg-primary" : "bg-gray-300"
                    )}
                    disabled={!isAnswered}
                >
                    <Text className={cn(
                        "text-lg font-poppins-semibold",
                        isAnswered ? "text-white" : "text-gray-500"
                    )}>
                        {currentStepIndex === steps.length - 1 ? 'Get Started' :
                         currentStep.type === 'promo' ? 'Continue' :
                         currentStep.type === 'reminder' ? 'Continue' : 'Next'}
                    </Text>
                </Button>
            </View>
        </View>
    );
}
