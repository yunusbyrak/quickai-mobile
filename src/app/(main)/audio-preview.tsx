import React, { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Text } from '@/components/ui/text';
import { ProcessingStatus, type ProcessingStep } from '@/components/audio/ProcessingStatus';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { PreviewContent } from '@/components/audio/PreviewContent';

export default function AudioPreview() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { audioUri } = useLocalSearchParams<{ audioUri?: string }>();
    const [audioPosition, setAudioPosition] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Debug log the audio URI
    useEffect(() => {
        console.log('📱 Audio Preview loaded with URI:', audioUri);
    }, [audioUri]);

    const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
        { id: 'upload', title: 'Upload Confirmed', status: 'completed' },
        { id: 'transcribe', title: 'Speech Recognized & Transcribed', status: 'completed' },
        { id: 'structure', title: 'AI Structuring the Content', status: 'processing' },
        { id: 'finish', title: 'Finish', status: 'pending' },
    ]);

    // Simulate processing steps
    useEffect(() => {
        const timer = setTimeout(() => {
            setProcessingSteps(prev => prev.map(step =>
                step.id === 'structure' ? { ...step, status: 'completed' } :
                    step.id === 'finish' ? { ...step, status: 'processing' } :
                        step
            ));
        }, 3000);

        const finishTimer = setTimeout(() => {
            setProcessingSteps(prev => prev.map(step =>
                step.id === 'finish' ? { ...step, status: 'completed' } : step
            ));
        }, 6000);

        return () => {
            clearTimeout(timer);
            clearTimeout(finishTimer);
        };
    }, []);

    const handlePositionUpdate = (newPosition: number) => {
        setAudioPosition(newPosition);
    };

    const handleDurationUpdate = (newDuration: number) => {
        setAudioDuration(newDuration);
    };

    const handlePlaybackStateChange = (playing: boolean) => {
        setIsPlaying(playing);
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: insets.top }}
        >
            {/* Header with Back Button */}
            <View className="px-4 py-4">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200"
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color="#000" style={{ marginLeft: 4 }} />
                </Pressable>
            </View>

            <View className='flex-1'>

            </View>

            {/* Audio Player Controls */}
            <View className="px-4 mb-4">
                <AudioPlayer
                    audioUri={audioUri}
                    onPositionUpdate={handlePositionUpdate}
                    onDurationUpdate={handleDurationUpdate}
                    onPlaybackStateChange={handlePlaybackStateChange}
                />
            </View>

            {/* Processing Status */}
            <View className="px-4" style={{ paddingBottom: insets.bottom + 20 }}>
                <ProcessingStatus
                    steps={processingSteps}
                    message="Organizing brilliance... This'll be quicker than your coffee break. Please do not leave the app."
                />
            </View>
        </View>
    );
}
