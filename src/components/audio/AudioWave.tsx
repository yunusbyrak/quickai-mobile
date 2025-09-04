import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Animated } from 'react-native';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';

interface AudioWaveProps {
    isRecording: boolean;
    isPaused: boolean;
    recording: Audio.Recording | null;
}

export const AudioWave = React.memo(({ isRecording, isPaused, recording }: AudioWaveProps) => {
    const [realtimeWave, setRealtimeWave] = useState<number[]>(() => Array(25).fill(0));
    const animation = useRef<LottieView>(null);

    // Generate realistic static wave pattern for right side
    const staticWave = useMemo(() =>
        Array.from({ length: 25 }, (_, i) => {
            const audioPosition = i / 24; // 0 to 1

            let height;
            if (audioPosition < 0.1) {
                // Beginning - gradual rise from dots to bars
                height = 6 + (audioPosition * 10) * 25;
            } else if (audioPosition > 0.9) {
                // End - gradual fall from bars to dots
                height = 6 + ((1 - audioPosition) * 10) * 25;
            } else {
                // Middle - varied heights with natural randomness
                const baseHeight = 10 + Math.random() * 30;
                const variation = 0.8 + 0.4 * (0.5 - Math.abs(audioPosition - 0.5));
                height = baseHeight * variation;
            }

            // Clamp height between 8 and 120 (much taller)
            return Math.max(8, Math.min(120, height));
        }), []
    );

    const realtimeAnimValues = useRef(
        Array.from({ length: 25 }, () => new Animated.Value(0))
    ).current;
    const staticAnimValues = useRef(
        Array.from({ length: 25 }, (_, i) => new Animated.Value(staticWave[i]))
    ).current;

    const meteringInterval = useRef<NodeJS.Timeout | null>(null);

    // Memoize wave update callback for performance
    const updateWaveData = useCallback((newHeight: number) => {
        setRealtimeWave(prev => [...prev.slice(1), newHeight]);
    }, []);

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (meteringInterval.current) {
                clearInterval(meteringInterval.current);
                meteringInterval.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (isRecording && !isPaused && recording) {
            meteringInterval.current = setInterval(async () => {
                try {
                    const status = await recording.getStatusAsync();
                    if (status.isRecording && status.metering !== undefined) {
                        // Convert dB to normalized value with better sensitivity
                        const normalizedLevel = Math.max(0, Math.min(1, (status.metering + 60) / 60));

                        // Create realistic height with variation (8 to 100 range)
                        let waveHeight = 8 + (normalizedLevel * 92); // 8 to 100 range

                        // Add small dummy waves occasionally for realism
                        const shouldAddSmallWave = Math.random() < 0.3; // 30% chance
                        if (shouldAddSmallWave && waveHeight > 40) {
                            // Sometimes add a small wave instead of big one for variety
                            waveHeight = Math.random() < 0.5 ?
                                8 + Math.random() * 15 : // Small wave (8-23px)
                                waveHeight; // Keep original big wave
                        }

                        // Update realtime wave (scroll from right to left)
                        updateWaveData(waveHeight);
                    }
                } catch (error) {
                    console.log('Error getting metering data:', error);
                }
            }, 150); // Reduced frequency for better performance

            return () => {
                if (meteringInterval.current) {
                    clearInterval(meteringInterval.current);
                    meteringInterval.current = null;
                }
            };
        } else {
            if (meteringInterval.current) {
                clearInterval(meteringInterval.current);
                meteringInterval.current = null;
            }
            setRealtimeWave(Array(25).fill(0));
        }
    }, [isRecording, isPaused, recording, updateWaveData]);

    // Animate realtime wave with optimized batch animations
    useEffect(() => {
        const animations = realtimeWave.map((value, index) =>
            Animated.timing(realtimeAnimValues[index], {
                toValue: value,
                duration: 100,
                useNativeDriver: false,
            })
        );

        // Batch animations for better performance
        Animated.parallel(animations).start();
    }, [realtimeWave, realtimeAnimValues]);

    return (
        <View className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            <View className='items-center justify-center'>
                <LottieView
                    autoPlay
                    resizeMode='cover'
                    ref={animation}
                    loop={true}
                    speed={recording && !isPaused ? 0.3 : 0}
                    style={{

                        height: 300,
                        width: '60%',
                    }}
                    source={require('~/assets/lottie/wave.json')}
                />
            </View>
            <View className="flex-row items-center justify-center h-40 px-2">

                {realtimeAnimValues.map((animValue, index) => (
                    <Animated.View
                        key={`real-${index}`}
                        style={{
                            width: 6,
                            height: animValue,
                            backgroundColor: '#FF6B35', // Orange
                            borderRadius: animValue.interpolate({
                                inputRange: [8, 100],
                                outputRange: [3, 50], // Pill shape - radius is half of height
                            }),
                            marginRight: 3,
                        }}
                    />
                ))}


                {staticAnimValues.map((animValue, index) => {
                    const height = staticWave[index];
                    const isDot = height < 15;

                    return (
                        <Animated.View
                            key={`static-${index}`}
                            style={{
                                width: 6,
                                height: height,
                                backgroundColor: '#9CA3AF', // Gray
                                borderRadius: isDot ? 2 : height / 2, // Dots vs pills
                                marginRight: index === staticAnimValues.length - 1 ? 0 : 3,
                            }}
                        />
                    );
                })}
            </View>
        </View>
    );
});
