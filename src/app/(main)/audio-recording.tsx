import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, Alert, Platform, AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { Text } from '@/components/ui/text';
import { HapticButton } from '@/components/ui/haptic-button';
import { useTheme } from '@/context/ThemeContext';
import { router, Stack } from 'expo-router';
import { cn } from '@/lib/utils';

import {
    AudioContext,
    AudioManager,
    AudioRecorder,
    RecorderAdapterNode,
    AudioBufferSourceNode,
    AudioBuffer,
} from 'react-native-audio-api';
import AudioVisualizer from '@/components/AudioVisualizer/AudioVisualizer';


const SAMPLE_RATE = 44100;

export default function AudioRecording() {
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const recorderRef = useRef<AudioRecorder | null>(null);
    const aCtxRef = useRef<AudioContext | null>(null);
    const recorderAdapterRef = useRef<RecorderAdapterNode | null>(null);
    const audioBuffersRef = useRef<AudioBuffer[]>([]);
    const [recordedAudio, setRecordedAudio] = useState<AudioBuffer[]>([]);


    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [hasPermission, setHasPermission] = useState(true); // Assume permission for now

    // Request permissions and setup audio
    useEffect(() => {
        setupAudio();
        return () => {
            cleanup();
        };
    }, []);

    const setupAudio = async () => {
        try {
            const permissionGranted = await AudioManager.requestRecordingPermissions();
            if (permissionGranted) {
                recorderRef.current = new AudioRecorder({
                    sampleRate: SAMPLE_RATE,
                    bufferLengthInSamples: SAMPLE_RATE,
                });
                setHasPermission(true);
            } else {
                setHasPermission(false);
            }
            console.log('Audio setup complete');
        } catch (error) {
            console.error('Failed to setup audio:', error);
            setHasPermission(false);
        }
    };

    const cleanup = () => {
        setDuration(0);
        console.log('cleanup', duration);
        aCtxRef.current?.close();
    };

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        if (!hasPermission) {
            Alert.alert('Permission required', 'Please grant microphone permission to record audio');
            return;
        }

        try {

            audioBuffersRef.current = [];

            AudioManager.setAudioSessionOptions({
                iosCategory: 'playAndRecord',
                iosMode: 'measurement',
                iosOptions: ['defaultToSpeaker', 'allowBluetooth', 'mixWithOthers'],
            });

            aCtxRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });

            if (aCtxRef.current.state === 'suspended') {
                await aCtxRef.current.resume();
            }

            recorderAdapterRef.current = aCtxRef.current.createRecorderAdapter();
            recorderAdapterRef.current.connect(aCtxRef.current.destination);
            recorderRef.current?.connect(recorderAdapterRef.current);

            // Setup audio data collection
            recorderRef.current?.onAudioReady((event) => {
                const { buffer } = event;
                audioBuffersRef.current.push(buffer);
                setRecordedAudio([...audioBuffersRef.current]);

                // Update duration
                const totalDuration = audioBuffersRef.current.reduce((total, buf) => total + buf.duration, 0);
                setDuration(totalDuration * 1000);
            });

            recorderRef.current?.start();
            setIsRecording(true);
            setIsPaused(false);

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
            if (recorderRef.current) {
                recorderRef.current.stop();
            }
            if (aCtxRef.current) {
                aCtxRef.current.close();
            }
            aCtxRef.current = null;
            recorderAdapterRef.current = null;
            setIsRecording(false);
            setIsPaused(false);
            setDuration(0);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const pauseRecording = async () => {
        try {
            if (recorderRef.current && isRecording && !isPaused) {
                recorderRef.current.stop();
                setIsPaused(true);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            console.error('Failed to pause recording:', error);
            Alert.alert('Error', 'Failed to pause recording.');
        }
    };

    const resumeRecording = async () => {
        try {
            if (recorderRef.current && isRecording && isPaused) {
                recorderRef.current.start();
                setIsPaused(false);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            console.error('Failed to resume recording:', error);
            Alert.alert('Error', 'Failed to resume recording.');
        }
    };

    const stopRecording = async () => {
        try {
            if (recorderRef.current && isRecording) {
                recorderRef.current.stop();
                setIsRecording(false);
                setIsPaused(false);

                // Calculate total duration
                const totalDuration = audioBuffersRef.current.reduce((total, buffer) => total + buffer.duration, 0);
                console.log('totalDuration', totalDuration);
                // setDuration(totalDuration);
                setDuration(0);
            }

            // Clean up intervals first to prevent memory leaks
            cleanup();

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            // TODO: Handle the recorded audio file (save to database, etc.)
            console.log('Recording saved (mock)');

            // Navigate back or to a processing screen
            router.back();
        } catch (error) {
            console.error('Failed to stop recording:', error);
            Alert.alert('Error', 'Failed to save recording');
        }
    };


    // Auto-start recording when component mounts and has permission
    useEffect(() => {
        if (hasPermission) {
            const timer = setTimeout(() => {
                startRecording();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [hasPermission]);

    // Handle app state changes to cleanup when app goes to background
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                cleanup();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, []);

    // Cleanup when screen loses focus (navigation away)
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                // This runs when screen loses focus
                cleanup();
            };
        }, [])
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal',
                    title: 'New recording',
                    headerTransparent: true,
                    headerShown: true,
                    headerTintColor: isDark ? 'white' : 'black',
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                }}
            />
            <View
                className="flex-1 bg-background"
                style={{
                    paddingTop: Math.max(insets.top, 16),
                    paddingBottom: Math.max(insets.bottom, 16),
                }}
            >
                {/* Content */}
                <View className="flex-1 px-6 pt-20">

                    {/* Instructions */}
                    <View className="mb-12">
                        <Text className="text-muted-foreground text-sm leading-6 mb-2">
                            - Transcript will be generated automatically after recording.
                        </Text>
                        <Text className="text-muted-foreground text-sm leading-6">
                            - Please speak slowly and clearly to ensure the transcription quality.
                        </Text>
                    </View>

                    {/* Waveform Visualization */}
                    <View className="flex-1 justify-center items-center mb-8">
                        {/* TODO Waveform */}
                    </View>

                    {/* Subscription Notice */}
                    <View className="mb-8">
                        <Text className="text-center text-muted-foreground text-sm">
                            Please <Text className="underline">subscribe</Text> for recordings &gt;5 minutes
                        </Text>
                    </View>

                    {/* Timer */}
                    <View className="mb-8">
                        <Text className="text-center text-muted-foreground text-lg font-mono">
                            {formatTime(duration)}
                        </Text>
                    </View>

                    {/* Control Buttons */}
                    <View className="flex-row justify-center gap-6 pb-8">
                        <HapticButton
                            onPress={isPaused ? resumeRecording : pauseRecording}
                            disabled={!isRecording}
                            className={cn(
                                "w-32 h-12 rounded-full border-2 border-destructive",
                                "flex-row items-center justify-center",
                                !isRecording && "opacity-50"
                            )}
                        >
                            <Text className="text-destructive font-medium text-base">
                                {isPaused ? 'RESUME' : 'PAUSE'}
                            </Text>
                        </HapticButton>

                        <HapticButton
                            onPress={stopRecording}
                            disabled={!isRecording}
                            className={cn(
                                "w-32 h-12 rounded-full bg-destructive",
                                "flex-row items-center justify-center",
                                !isRecording && "opacity-50"
                            )}
                        >
                            <Text className="text-white font-medium text-base">
                                DONE
                            </Text>
                        </HapticButton>
                    </View>
                </View>
            </View>
        </>
    );
}
