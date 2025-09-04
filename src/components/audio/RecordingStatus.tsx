import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { RecordingTimer } from './RecordingTimer';

interface RecordingStatusProps {
    recordingState: 'idle' | 'recording' | 'paused';
}

export const RecordingStatus = React.memo(({ recordingState }: RecordingStatusProps) => {
    return (
        <View className="absolute top-16 left-4 z-10">
            {/* Recording Status */}
            <View className="flex-row items-center gap-2 mb-1">
                {recordingState === 'recording' && (
                    <View className="w-3 h-3 bg-orange-500 rounded-full" />
                )}
                <RecordingTimer
                    isRecording={recordingState === 'recording'}
                    isPaused={recordingState === 'paused'}
                />
            </View>

            {/* Date */}
            <Text className="text-2xl font-bold text-foreground">
                {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })}
            </Text>
        </View>
    );
});
