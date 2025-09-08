import React, { useCallback, useRef, useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector
} from 'react-native-gesture-handler';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const { width: screenWidth } = Dimensions.get('window');

// Tab item interface
export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
}

// Component variants - matching original design
const tabsVariants = cva('flex-row', {
    variants: {
        size: {
            sm: 'h-8',
            default: 'h-10',
            lg: 'h-12',
        },
        variant: {
            default: 'bg-transparent',
            outline: 'bg-transparent border border-border',
            ghost: 'bg-transparent',
        },
    },
    defaultVariants: {
        size: 'default',
        variant: 'default',
    },
});

const tabTriggerVariants = cva(
    'px-4 py-2 rounded-full border mr-1 flex-row items-center justify-center',
    {
        variants: {
            size: {
                sm: 'px-3 py-1',
                default: 'px-4 py-2',
                lg: 'px-5 py-3',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    }
);

const tabTextVariants = cva('text-sm font-medium', {
    variants: {
        size: {
            sm: 'text-xs',
            default: 'text-sm',
            lg: 'text-base',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

// Props interface
export interface AnimatedTabsProps extends VariantProps<typeof tabsVariants> {
    tabs: TabItem[];
    defaultTab?: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
    contentClassName?: string;
    enableSwipe?: boolean;
    swipeThreshold?: number;
    swipeChangeThreshold?: number; // Percentage of screen width to trigger tab change
    headersOnly?: boolean;
    contentOnly?: boolean;
    animationConfig?: {
        duration?: number;
        damping?: number;
        stiffness?: number;
    };
}

export function AnimatedTabs({
    tabs,
    defaultTab,
    activeTab: controlledActiveTab,
    onTabChange,
    className,
    contentClassName,
    enableSwipe = true,
    swipeThreshold = 50,
    swipeChangeThreshold = 0.6, // 60% of screen width
    headersOnly = false,
    contentOnly = false,
    animationConfig = {
        duration: 250,
        damping: 25,
        stiffness: 300,
    },
    size,
    variant,
}: AnimatedTabsProps) {
    const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);

    // Use controlled activeTab if provided, otherwise use internal state
    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
    const [contentWidth, setContentWidth] = useState(screenWidth);

    // Animation values
    const contentTranslateX = useSharedValue(0);
    const isAnimating = useSharedValue(false);
    const tabChangedDuringGesture = useSharedValue(false);

    // Gesture handling
    const startX = useRef(0);

    // Find active tab index
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

    // Update content position
    const updateContent = useCallback((index: number) => {
        'worklet';
        const newPosition = -index * contentWidth;
        contentTranslateX.value = withSpring(newPosition, {
            damping: animationConfig.damping,
            stiffness: animationConfig.stiffness,
            mass: 1,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
        });
    }, [contentWidth, animationConfig]);

    // Handle tab change
    const handleTabChange = useCallback((tabId: string) => {
        if (isAnimating.value) return;

        const newIndex = tabs.findIndex(tab => tab.id === tabId);
        if (newIndex === -1 || newIndex === activeIndex) return;

        isAnimating.value = true;

        // Only update internal state if not controlled
        if (controlledActiveTab === undefined) {
            setInternalActiveTab(tabId);
        }

        updateContent(newIndex);
        onTabChange?.(tabId);

        // Reset animation flag after animation completes
        setTimeout(() => {
            isAnimating.value = false;
        }, animationConfig.duration);
    }, [activeIndex, tabs, onTabChange, updateContent, animationConfig.duration, controlledActiveTab]);

    // Handle swipe gesture with optimized performance using modern Gesture API
    const panGesture = Gesture.Pan()
        .onStart(() => {
            if (!enableSwipe || isAnimating.value) return;
            tabChangedDuringGesture.value = false;
        })
        .onUpdate((event) => {
            if (!enableSwipe || isAnimating.value) return;

            // Direct translation for smooth following
            const currentPosition = -activeIndex * contentWidth;
            const newPosition = currentPosition + event.translationX;

            // Apply bounds checking with smooth resistance
            const minPosition = -(tabs.length - 1) * contentWidth;
            const maxPosition = 0;

            let boundedPosition = newPosition;
            if (newPosition > maxPosition) {
                // Swiping right beyond first tab
                const overscroll = newPosition - maxPosition;
                boundedPosition = maxPosition + overscroll * 0.2; // Reduced resistance
            } else if (newPosition < minPosition) {
                // Swiping left beyond last tab
                const overscroll = newPosition - minPosition;
                boundedPosition = minPosition + overscroll * 0.2; // Reduced resistance
            }

            contentTranslateX.value = boundedPosition;

            // Check if we should change tab during the swipe
            const swipeChangeThresholdPixels = contentWidth * swipeChangeThreshold;

            if (Math.abs(event.translationX) > swipeChangeThresholdPixels && !tabChangedDuringGesture.value) {
                if (event.translationX > 0 && activeIndex > 0) {
                    // Swipe right - go to previous tab
                    tabChangedDuringGesture.value = true;
                    runOnJS(handleTabChange)(tabs[activeIndex - 1].id);
                } else if (event.translationX < 0 && activeIndex < tabs.length - 1) {
                    // Swipe left - go to next tab
                    tabChangedDuringGesture.value = true;
                    runOnJS(handleTabChange)(tabs[activeIndex + 1].id);
                }
            }
        })
        .onEnd((event) => {
            if (!enableSwipe || isAnimating.value) return;

            const { translationX, velocityX } = event;

            // If tab already changed during gesture, don't do anything
            if (tabChangedDuringGesture.value) {
                return;
            }

            // Check if we should change tab on release
            const swipeChangeThresholdPixels = contentWidth * swipeChangeThreshold;
            const shouldChangeTab = Math.abs(translationX) > swipeChangeThresholdPixels || Math.abs(velocityX) > 500;

            if (shouldChangeTab) {
                if (translationX > 0 && activeIndex > 0) {
                    // Swipe right - go to previous tab
                    runOnJS(handleTabChange)(tabs[activeIndex - 1].id);
                } else if (translationX < 0 && activeIndex < tabs.length - 1) {
                    // Swipe left - go to next tab
                    runOnJS(handleTabChange)(tabs[activeIndex + 1].id);
                } else {
                    // Snap back to current position
                    updateContent(activeIndex);
                }
            } else {
                // Snap back to current position
                updateContent(activeIndex);
            }
        })
        .enabled(enableSwipe);

    // Initialize content position
    React.useEffect(() => {
        updateContent(activeIndex);
    }, [activeIndex, updateContent]);

    // Animated styles
    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: contentTranslateX.value }],
    }));

    const tabTextStyle = useCallback((tabId: string) => {
        return useAnimatedStyle(() => {
            const isActive = tabId === activeTab;
            const opacity = withTiming(isActive ? 1 : 0.6, { duration: 200 });
            const scale = withTiming(isActive ? 1 : 0.95, { duration: 200 });

            return {
                opacity,
                transform: [{ scale }],
            };
        });
    }, [activeTab]);

    return (
        <View className={cn('flex-1', className)}>
            {/* Tab Headers - only show if not contentOnly */}
            {!contentOnly && (
                <View
                    className={cn(tabsVariants({ size, variant }), className)}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setContentWidth(width);
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Pressable
                            key={tab.id}
                            className={cn(
                                tabTriggerVariants({ size }),
                                tab.id === activeTab
                                    ? "bg-foreground border-foreground"
                                    : "bg-background border-border"
                            )}
                            onPress={() => handleTabChange(tab.id)}
                        >
                            <Animated.View style={tabTextStyle(tab.id)}>
                                <Text
                                    className={cn(
                                        tabTextVariants({ size }),
                                        tab.id === activeTab
                                            ? "text-background"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {tab.label}
                                </Text>
                            </Animated.View>
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Tab Content - only render if not headersOnly */}
            {!headersOnly && (
                <View className="flex-1 overflow-hidden">
                    <GestureDetector gesture={panGesture}>
                        <Animated.View
                            style={[
                                contentStyle,
                                {
                                    flexDirection: 'row',
                                    width: contentWidth * tabs.length,
                                    height: '100%',
                                },
                            ]}
                        >
                            {tabs.map((tab) => (
                                <View
                                    key={tab.id}
                                    style={{
                                        width: contentWidth,
                                        height: '100%',
                                    }}
                                    className={cn('flex-1', contentClassName)}
                                >
                                    {tab.content}
                                </View>
                            ))}
                        </Animated.View>
                    </GestureDetector>
                </View>
            )}
        </View>
    );
}

// Types are already exported above with the interfaces
