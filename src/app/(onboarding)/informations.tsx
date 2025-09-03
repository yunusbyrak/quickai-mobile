import { View, ScrollView, Pressable, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import Slide1 from '@/screens/onboarding/informations/Slide1';
import Slide2 from '@/screens/onboarding/informations/Slide2';
import Slide3 from '@/screens/onboarding/informations/Slide3';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
    { id: 1, title: "Upload, Link, or Record" },
    { id: 2, title: "Save Time" },
    { id: 3, title: "Instant Answers" }
];

export default function Informations() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            const nextIndex = currentSlide + 1;
            setCurrentSlide(nextIndex);
            scrollViewRef.current?.scrollTo({
                x: nextIndex * SCREEN_WIDTH,
                animated: true
            });
        } else {
            router.push('/(onboarding)/questions');
        }
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        scrollViewRef.current?.scrollTo({
            x: index * SCREEN_WIDTH,
            animated: true
        });
    };

    const handleScroll = (event: any) => {
        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        if (slideIndex !== currentSlide) {
            setCurrentSlide(slideIndex);
        }
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{
                paddingBottom: Math.max(insets.bottom, 16),
            }}
        >
            {/* Header Gradient Image - Starts from status bar */}
            <View className="absolute top-0 left-0 right-0 items-center">
                <Image
                    source={require('~/assets/images/header-gradient.png')}
                    className="w-full"
                    resizeMode="cover"
                />
            </View>

            {/* Horizontal Slider */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                className="flex-1"
                bounces={false}
                scrollEventThrottle={16}
                style={{ paddingTop: Math.max(insets.top, 16) }}
            >
                <Slide1 />
                <Slide2 />
                <Slide3 />
            </ScrollView>

            {/* Navigation Dots */}
            <View className="flex-row justify-center items-center gap-2 mb-6">
                {slides.map((_, index) => (
                    <Pressable
                        key={index}
                        onPress={() => goToSlide(index)}
                        className={cn(
                            "w-2 h-2 rounded-full",
                            index === currentSlide ? "bg-foreground" : "bg-muted-foreground/30"
                        )}
                    />
                ))}
            </View>

            {/* Next Button */}
            <View className="px-4 pb-4">
                <Button
                    onPress={nextSlide}
                    className="w-full h-14 rounded-2xl"
                >
                    <Text className="text-lg font-poppins-semibold">
                        Next
                    </Text>
                </Button>
            </View>
        </View>
    );
}
