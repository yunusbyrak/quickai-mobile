import React, { useRef, FC, useEffect, useState } from 'react';
import {
    AudioContext,
    AudioManager,
    AudioRecorder,
    RecorderAdapterNode,
    AudioBufferSourceNode,
    AudioBuffer,
} from 'react-native-audio-api';


import { SafeAreaView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

const SAMPLE_RATE = 16000; // Standard iOS sample rate

const Record: FC = () => {
    const recorderRef = useRef<AudioRecorder | null>(null);
    const aCtxRef = useRef<AudioContext | null>(null);
    const recorderAdapterRef = useRef<RecorderAdapterNode | null>(null);
    const audioBuffersRef = useRef<AudioBuffer[]>([]);

    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [recordedAudio, setRecordedAudio] = useState<AudioBuffer[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        const initializeAudio = async () => {
            try {
                const permissionGranted = await AudioManager.requestRecordingPermissions();

                if (permissionGranted) {
                    recorderRef.current = new AudioRecorder({
                        sampleRate: SAMPLE_RATE,
                        bufferLengthInSamples: SAMPLE_RATE,
                    });
                    setHasPermission(true);
                    setIsInitialized(true);
                } else {
                    setHasPermission(false);
                }
            } catch (error) {
                setHasPermission(false);
                setIsInitialized(false);
            }
        };

        initializeAudio();

        return () => {
            aCtxRef.current?.close();
        };
    }, []);

    const setupRecording = () => {
        AudioManager.setAudioSessionOptions({
            iosCategory: 'playAndRecord',
            iosMode: 'measurement',
            iosOptions: ['defaultToSpeaker', 'allowBluetooth', 'mixWithOthers'],
        });
    };


    const startRecording = async () => {
        if (!hasPermission || !isInitialized || !recorderRef.current) {
            alert('Audio not ready');
            return;
        }

        try {
            // Clear previous recording
            setRecordedAudio([]);
            audioBuffersRef.current = [];

            // Setup audio session
            setupRecording();

            // Create audio context
            aCtxRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });

            if (aCtxRef.current.state === 'suspended') {
                await aCtxRef.current.resume();
            }

            // Create recorder adapter
            recorderAdapterRef.current = aCtxRef.current.createRecorderAdapter();
            recorderAdapterRef.current.connect(aCtxRef.current.destination);
            recorderRef.current.connect(recorderAdapterRef.current);

            // Setup audio data collection
            recorderRef.current.onAudioReady((event) => {
                const { buffer } = event;
                audioBuffersRef.current.push(buffer);
                setRecordedAudio([...audioBuffersRef.current]);

                // Update duration
                const totalDuration = audioBuffersRef.current.reduce((total, buf) => total + buf.duration, 0);
                setDuration(totalDuration);
            });

            // Start recording
            recorderRef.current.start();
            setIsRecording(true);

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
            alert('Recording failed');
        }
    };

    const pauseRecording = () => {
        if (recorderRef.current && isRecording && !isPaused) {
            recorderRef.current.stop();
            setIsPaused(true);
        }
    };

    const resumeRecording = () => {
        if (recorderRef.current && isRecording && isPaused) {
            recorderRef.current.start();
            setIsPaused(false);
        }
    };

    const stopRecording = () => {
        if (recorderRef.current && isRecording) {
            recorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);

            // Calculate total duration
            const totalDuration = audioBuffersRef.current.reduce((total, buffer) => total + buffer.duration, 0);
            setDuration(totalDuration);
        }
    };

    const playRecording = async () => {
        if (recordedAudio.length === 0) {
            alert('No recorded audio to play');
            return;
        }

        try {
            setIsPlaying(true);

            // Create new audio context for playback
            const playbackContext = new AudioContext({ sampleRate: SAMPLE_RATE });

            if (playbackContext.state === 'suspended') {
                await playbackContext.resume();
            }

            const tNow = playbackContext.currentTime;
            let nextStartAt = tNow + 0.1;

            // Play all recorded buffers sequentially
            for (let i = 0; i < recordedAudio.length; i++) {
                const source = playbackContext.createBufferSource();
                source.buffer = recordedAudio[i];
                source.connect(playbackContext.destination);
                source.start(nextStartAt);
                nextStartAt += recordedAudio[i].duration;
            }

            // Calculate total playback duration
            const totalDuration = recordedAudio.reduce((total, buffer) => total + buffer.duration, 0);

            // Stop playing indicator after playback completes
            setTimeout(() => {
                setIsPlaying(false);
                playbackContext.close();
            }, (totalDuration + 1) * 1000);

        } catch (error) {
            setIsPlaying(false);
            alert('Playback failed');
        }
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


    return (
        <SafeAreaView className="flex-1 bg-black p-6">
            <View className="flex-1 justify-center items-center gap-8">
                {/* Title */}
                <Text className="text-white text-2xl font-bold text-center">
                    Voice Recorder
                </Text>

                {/* Duration Display */}
                <View className="items-center">
                    <Text className="text-white text-4xl font-mono">
                        {formatDuration(duration)}
                    </Text>
                    <Text className="text-gray-400 text-sm mt-1">
                        {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Stopped'}
                    </Text>
                </View>

                {/* Recording Controls */}
                <View className="flex-row gap-4">
                    {/* Start Recording */}
                    <Button
                        onPress={startRecording}
                        disabled={!hasPermission || !isInitialized || isRecording}
                        className={`w-20 h-20 rounded-full ${!hasPermission || !isInitialized || isRecording ? 'opacity-50 bg-gray-600' : 'bg-green-600'}`}
                    >
                        <Text className="text-white text-lg">▶️</Text>
                    </Button>

                    {/* Pause/Resume */}
                    <Button
                        onPress={isPaused ? resumeRecording : pauseRecording}
                        disabled={!isRecording}
                        className={`w-20 h-20 rounded-full ${!isRecording ? 'opacity-50 bg-gray-600' : 'bg-yellow-600'}`}
                    >
                        <Text className="text-white text-lg">
                            {isPaused ? '▶️' : '⏸️'}
                        </Text>
                    </Button>

                    {/* Stop Recording */}
                    <Button
                        onPress={stopRecording}
                        disabled={!isRecording}
                        className={`w-20 h-20 rounded-full ${!isRecording ? 'opacity-50 bg-gray-600' : 'bg-red-600'}`}
                    >
                        <Text className="text-white text-lg">⏹️</Text>
                    </Button>
                </View>

                {/* Playback Control */}
                <Button
                    onPress={playRecording}
                    disabled={recordedAudio.length === 0 || isPlaying}
                    className={`px-8 py-4 rounded-full ${recordedAudio.length === 0 || isPlaying ? 'opacity-50 bg-gray-600' : 'bg-blue-600'}`}
                >
                    <Text className="text-white text-lg font-medium">
                        {isPlaying ? '🔊 Playing...' : '🔊 Play Recording'}
                    </Text>
                </Button>

            </View>
        </SafeAreaView>
    );
};

export default Record;
