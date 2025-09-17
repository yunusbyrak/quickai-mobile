import { ActivityIndicator, View, Animated } from "react-native";
import { Text } from "./ui/text";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef } from "react";

interface LoaderModalProps {
    isVisible: boolean;
    title?: string;
}

export default function LoaderModal({ isVisible, title }: LoaderModalProps) {
    const { isDark } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [isVisible, fadeAnim]);

    if (!isVisible) return null;

    return (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className='absolute items-center justify-center flex-1 w-full h-full bg-black/20'
        >
            <View className='gap-2 bg-muted p-4 rounded-lg'>
                <ActivityIndicator
                    size="large"
                    color={isDark ? 'white' : 'black'}
                />
                {title && <Text className="text-muted-foreground text-sm">
                    {title}
                </Text>}
            </View>
        </Animated.View>
    );
}
