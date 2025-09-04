import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface RecordingControlsProps {
    recordingState: 'idle' | 'recording' | 'paused';
    recordingTime: number;
    onCancel: () => void;
    onDone: () => void;
    onRecord: () => void;
    onPause: () => void;
}

export const RecordingControls = React.memo(({
    recordingState,
    recordingTime,
    onCancel,
    onDone,
    onRecord,
    onPause
}: RecordingControlsProps) => {
    const insets = useSafeAreaInsets();

    const handleCancelPress = () => {
        if (recordingState === 'idle') {
            onCancel();
            return;
        }

        Alert.alert(
            'Are you sure?',
            'Are you sure you want to cancel recording?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    style: 'destructive',
                    onPress: onCancel,
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View className="absolute bottom-0 left-0 right-0 pb-8" style={{ paddingBottom: insets.bottom + 32 }}>
            <View className="flex-row items-center justify-center gap-16">
                {/* Cancel Button */}
                <View className="items-center">
                    <TouchableOpacity
                        onPress={handleCancelPress}
                        className="w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm"
                    >
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-sm text-foreground mt-2">
                        Cancel
                    </Text>
                </View>

                {/* Record/Done Button (Center) */}
                <View className="items-center">
                    <TouchableOpacity
                        onPress={() => {
                            console.log('🔘 Center button pressed, state:', recordingState);
                            if (recordingState === 'idle') {
                                console.log('🎯 Calling onRecord function');
                                onRecord();
                            } else {
                                console.log('✅ Calling onDone function');
                                onDone();
                            }
                        }}
                        className="w-20 h-20 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                    >
                        {recordingState === 'idle' ? (
                            <View className="w-4 h-4 bg-white rounded-full" />
                        ) : (
                            <View className="w-6 h-6 bg-white" />
                        )}
                    </TouchableOpacity>
                    <Text className="text-sm font-bold text-foreground mt-2">
                        {recordingState === 'idle' ? 'Record' : 'Done'}
                    </Text>
                </View>

                {/* Pause/Resume Button */}
                <View className="items-center">
                    <TouchableOpacity
                        onPress={onPause}
                        disabled={recordingState === 'idle'}
                        className={cn(
                            "w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm",
                            recordingState === 'idle' && "opacity-50"
                        )}
                    >
                        {recordingState === 'paused' ? (
                            <Ionicons name="play" size={24} color="#000" />
                        ) : (
                            <Ionicons name="pause" size={24} color="#000" />
                        )}
                    </TouchableOpacity>
                    <Text className="text-sm  text-foreground mt-2">
                        {recordingState === 'paused' ? 'Resume' : 'Pause'}
                    </Text>
                </View>
            </View>
        </View>
    );
});
