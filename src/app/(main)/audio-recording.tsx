import React, { useState, useEffect, useRef } from 'react';
import { View, Pressable, Alert, Platform, AppState, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';

import { Text } from '@/components/ui/text';
import { HapticButton } from '@/components/ui/haptic-button';
import { useTheme } from '@/context/ThemeContext';
import { router, Stack } from 'expo-router';
import { cn } from '@/lib/utils';

import { AudioContext, AudioManager, AudioRecorder, RecorderAdapterNode, AudioBuffer } from 'react-native-audio-api';
import LoaderModal from '@/components/LoaderModal';
import { transcribeAudio } from '@/services/audio.service';

const SAMPLE_RATE = 44100;

export default function AudioRecording() {
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const recorderRef = useRef<AudioRecorder | null>(null);
    const aCtxRef = useRef<AudioContext | null>(null);
    const recorderAdapterRef = useRef<RecorderAdapterNode | null>(null);
    const audioBuffersRef = useRef<AudioBuffer[]>([]);
    const [recordedAudio, setRecordedAudio] = useState<AudioBuffer[]>([]);


    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [hasPermission, setHasPermission] = useState(true); // Assume permission for now
    const [isReady, setIsReady] = useState(false); // Track when audio is ready to record

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
                setIsReady(true); // Audio is ready to record
            } else {
                setHasPermission(false);
                setIsReady(false);
            }
            console.log('Audio setup complete');
        } catch (error) {
            console.error('Failed to setup audio:', error);
            setHasPermission(false);
            setIsReady(false);
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

    // Convert AudioBuffer to File using FileSystem
    const audioBufferToFile = async (audioBuffers: AudioBuffer[]): Promise<any> => {
        try {
            // Combine all audio buffers into one
            const totalLength = audioBuffers.reduce((total, buffer) => total + buffer.length, 0);
            const combinedBuffer = new Float32Array(totalLength);

            let offset = 0;
            for (const buffer of audioBuffers) {
                const bufferData = buffer.getChannelData(0);
                combinedBuffer.set(bufferData, offset);
                offset += buffer.length;
            }

            // Convert to WAV format
            const wavArrayBuffer = await convertToWav(combinedBuffer, SAMPLE_RATE);

            // Convert ArrayBuffer to base64
            const base64Data = arrayBufferToBase64(wavArrayBuffer);

            // Save to temporary file
            const tempFilePath = (FileSystem.cacheDirectory || FileSystem.documentDirectory) + 'temp_recording.wav';
            await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
                encoding: 'base64'
            });

            // Return file object for FormData
            return {
                uri: tempFilePath,
                type: 'audio/wav',
                name: 'recording.wav'
            };
        } catch (error) {
            console.error('Error converting audio buffer to file:', error);
            throw error;
        }
    };

    // Convert Float32Array to WAV format
    const convertToWav = async (audioData: Float32Array, sampleRate: number): Promise<ArrayBuffer> => {
        const length = audioData.length;
        const arrayBuffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(arrayBuffer);

        // WAV header
        const writeString = (offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + length * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, length * 2, true);

        // Convert float samples to 16-bit PCM
        let offset = 44;
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, audioData[i]));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }

        return arrayBuffer;
    };

    // Helper function to convert ArrayBuffer to base64 string
    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        try {
            const bytes = new Uint8Array(buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            if (typeof btoa !== 'undefined') {
                return btoa(binary);
            } else {
                // Fallback for environments without btoa
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                let result = '';
                let i = 0;
                while (i < binary.length) {
                    const a = binary.charCodeAt(i++);
                    const b = i < binary.length ? binary.charCodeAt(i++) : 0;
                    const c = i < binary.length ? binary.charCodeAt(i++) : 0;
                    const bitmap = (a << 16) | (b << 8) | c;
                    result += chars.charAt((bitmap >> 18) & 63) +
                        chars.charAt((bitmap >> 12) & 63) +
                        chars.charAt((bitmap >> 6) & 63) +
                        chars.charAt(bitmap & 63);
                }
                const padding = binary.length % 3;
                return padding ? result.slice(0, -padding) + '='.repeat(3 - padding) : result;
            }
        } catch (error) {
            console.error('Error converting to base64:', error);
            return '';
        }
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
        // Show loading modal
        setIsModalVisible(true);
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

            cleanup();

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            try {
                // Convert audio buffers to FormData-compatible file object
                const audioFile = await audioBufferToFile(audioBuffersRef.current);

                // Start transcription with the audio file
                const transcriptionResult = await transcribeAudio({
                    audioFile: audioFile,
                });

                console.log('Transcription started:', transcriptionResult);

                // Hide loading modal and navigate back
                setIsModalVisible(false);
                router.back();

            } catch (transcriptionError) {
                console.error('Failed to transcribe audio:', transcriptionError);
                setIsModalVisible(false);
                Alert.alert(
                    'Transcription Error',
                    'Failed to start audio transcription. Please try again.',
                    [
                        { text: 'OK', onPress: () => router.back() }
                    ]
                );
            }

        } catch (error) {
            console.error('Failed to stop recording:', error);
            setIsModalVisible(false);
            Alert.alert('Error', 'Failed to save recording');
        }
    };



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
                            - Tap the green button to start recording.
                        </Text>
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
                        {!isRecording ? (
                            // Start button when not recording
                            <HapticButton
                                onPress={startRecording}
                                disabled={!isReady || !hasPermission}
                                className={cn(
                                    "w-32 h-12 rounded-full bg-green-500",
                                    "flex-row items-center justify-center",
                                    (!isReady || !hasPermission) && "opacity-50"
                                )}
                            >
                                {!isReady ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text className="text-white font-medium text-lg">
                                        START
                                    </Text>
                                )}
                            </HapticButton>
                        ) : (
                            // Recording controls when recording
                            <>
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
                            </>
                        )}
                    </View>
                </View>
            </View>

            <LoaderModal
                isVisible={isModalVisible}
                title="Processing audio..."
            />
        </>
    );
}
