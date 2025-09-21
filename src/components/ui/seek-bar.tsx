import Slider from '@react-native-community/slider';
import { View, Pressable } from 'react-native';
import { Text } from './text';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';

interface SeekBarProps {
    positionMillis: number;
    durationMillis: number;
    sliderValue: number;
    isPlaying: boolean;
    isBuffering: boolean;
    isSeeking: boolean;
    onPlayPause: () => void;
    onSeek: (value: number) => void;
    onSeekStart: () => void;
    onSeekComplete: () => void;
    className?: string;
}

const formatTime = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const SeekBar = ({
    positionMillis,
    durationMillis,
    sliderValue,
    isPlaying,
    isBuffering,
    isSeeking,
    onPlayPause,
    onSeek,
    onSeekStart,
    onSeekComplete,
    className
}: SeekBarProps) => {
    const handleSliderValueChange = (value: number) => {
        onSeek(value);
    };

    const handleSliderTouchStart = () => {
        onSeekStart();
    };

    const handleSliderTouchEnd = () => {
        onSeekComplete();
    };

    return (
        <View className={cn("w-full bg-gray-100 rounded-lg p-4 py-1", className)}>
            <View className="flex-row items-center space-x-4">
                {/* Play/Pause Button */}
                <Pressable
                    onPress={onPlayPause}
                    className="w-8 h-8 items-center justify-center"
                    disabled={isBuffering}
                >
                    {isBuffering ? (
                        <View className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Ionicons
                            name={isPlaying ? 'pause' : 'play'}
                            size={20}
                            color="black"
                        />
                    )}
                </Pressable>

                {/* Time Display */}
                <Text className="text-xs text-black">
                    {formatTime(positionMillis)} / {formatTime(durationMillis)}
                </Text>

                {/* Progress Slider */}
                <View className="flex-1 ml-2">
                    <Slider
                        minimumValue={0}
                        maximumValue={1}
                        value={isSeeking ? sliderValue : (durationMillis > 0 ? positionMillis / durationMillis : 0)}
                        onValueChange={handleSliderValueChange}
                        onSlidingStart={handleSliderTouchStart}
                        onSlidingComplete={handleSliderTouchEnd}
                        minimumTrackTintColor="#3b82f6"
                        maximumTrackTintColor="rgba(156, 163, 175, 0.5)"
                        thumbTintColor="white"
                        style={{ width: '100%' }}
                    />
                </View>
            </View>
        </View>
    );
};
