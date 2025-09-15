import { useState } from 'react';
import { View, Pressable, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '@/lib/utils';

export interface NoteDetailCardProps {
    title: string;
    children: React.ReactNode;
    defaultCollapsed?: boolean;
    footer?: React.ReactNode;
    onToggle?: (isCollapsed: boolean) => void;
    onViewMore?: () => void;
    onShare?: () => void;
    onCopy?: () => void;
    showViewMore?: boolean;
    showShare?: boolean;
    showCopy?: boolean;
}

export default function NoteDetailCard({
    title,
    children,
    defaultCollapsed = false,
    footer,
    onToggle,
    onViewMore,
    onShare,
    onCopy,
    showViewMore = true,
    showShare = true,
    showCopy = true,
}: NoteDetailCardProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [animation] = useState(new Animated.Value(defaultCollapsed ? 0 : 1));

    const toggleCollapsed = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        onToggle?.(newCollapsed);

        Animated.timing(animation, {
            toValue: newCollapsed ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View className="bg-white rounded-2xl shadow-sm shadow-black/5 border border-foreground/5">
            {/* Header */}
            <Pressable
                onPress={toggleCollapsed}
                className={cn('px-4 pt-3 relative', {
                    'pb-3': isCollapsed,
                })}
            >
                <View className={`flex-row items-center justify-between ${!isCollapsed ? 'border-b border-gray-100 pb-3' : ''}`}>
                    <View className="flex-1">
                        <Text variant="h4" className="text-gray-900 text-base">
                            {title}
                        </Text>
                    </View>

                    <View className="flex-row items-center space-x-2">
                        <Animated.View
                            style={{
                                transform: [{ rotate: rotateInterpolate }],
                            }}
                        >
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color="#6B7280"
                            />
                        </Animated.View>
                    </View>
                </View>
            </Pressable>

            {/* Content */}
            {!isCollapsed && (
                <Animated.View
                    style={{
                        opacity: animation,
                    }}
                    className="overflow-hidden relative"
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 24,
                            zIndex: 30,
                        }}
                        pointerEvents="none"
                    />
                    <ScrollView
                        className="max-h-[300px]"
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>
                </Animated.View>
            )}

            {/* Gradient separation and buttons */}
            {!isCollapsed && (showViewMore || showShare || showCopy) && (
                <View className="relative">
                    {/* Gradient overlay */}
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                        style={{
                            position: 'absolute',
                            top: -24,
                            left: 0,
                            right: 0,
                            height: 24,
                            zIndex: 10,
                        }}
                        pointerEvents="none"
                    />

                    {/* Buttons */}
                    <View className="px-4 pb-4 pt-2">
                        <View className="flex-row items-center justify-between">
                            {/* View More Button (Left) */}
                            {showViewMore && (
                                <Pressable
                                    onPress={onViewMore}
                                    className="px-3 py-2 rounded-full bg-gray-100 active:bg-gray-200"
                                >
                                    <Text className="text-gray-700 text-sm font-medium">
                                        View More
                                    </Text>
                                </Pressable>
                            )}

                            {/* Icon Buttons (Right) */}
                            <View className="flex-row items-center">
                                {showShare && (
                                    <Pressable
                                        onPress={onShare}
                                        className="w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center active:bg-gray-50 mr-2"
                                    >
                                        <Ionicons
                                            name="share-outline"
                                            size={16}
                                            color="#374151"
                                        />
                                    </Pressable>
                                )}

                                {showCopy && (
                                    <Pressable
                                        onPress={onCopy}
                                        className="w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center active:bg-gray-50"
                                    >
                                        <Ionicons
                                            name="copy-outline"
                                            size={16}
                                            color="#374151"
                                        />
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Footer */}
            {footer && (
                <View className="px-4 pb-4">
                    {footer}
                </View>
            )}

        </View>
    );
}
