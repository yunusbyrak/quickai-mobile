import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import Animated, { LayoutAnimationConfig, ZoomInRotate } from 'react-native-reanimated';

import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
    const { isDark, themeMode, setTheme } = useTheme();

    return (
        <LayoutAnimationConfig skipEntering>
            <Animated.View
                className="items-center justify-center"
                key={"toggle-" + (isDark ? 'dark' : 'light')}
                entering={ZoomInRotate}>
                <Pressable
                    onPress={() => setTheme(isDark ? 'light' : 'dark')}
                    className="opacity-80">
                    {isDark
                        ? ({ pressed }) => (
                            <View className={cn('px-0.5', pressed && 'opacity-50')}>
                                <Ionicons name="moon-outline" size={24} color="#FF6700" />
                            </View>
                        )
                        : ({ pressed }) => (
                            <View className={cn('px-0.5', pressed && 'opacity-50')}>
                                <Ionicons name="sunny-outline" size={24} color="#FF6700" />
                            </View>
                        )}
                </Pressable>
            </Animated.View>
        </LayoutAnimationConfig>
    );
}
