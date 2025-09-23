import { HapticButton } from "@/components";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/context/ThemeContext";
import { useTranscript } from "@/hooks/useTranscript";
import { generateTranscriptHTML } from "@/templates/transcript-templates";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { memo, useEffect, useMemo } from "react";
import { View, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AudioTranscriptionSegment {
    avg_logprob: number
    compression_ratio: number
    end: number
    id: number
    no_speech_prob: number
    seek: number
    start: number
    temperature: number
    text: string
}

interface AudioTranscriptProps {
    onClose: () => void;
    content: string;
    segments: AudioTranscriptionSegment[];
    title: string;
}

const AudioTranscriptSegmentItem = memo(({ segment }: { segment: AudioTranscriptionSegment }) => {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Pressable className="mb-4">
            <View className="flex-row items-center mb-1 gap-1">
                <Ionicons
                    name="play"
                    size={16}
                    color="#666"
                />
                <Text className="text-xs text-gray-500">
                    {formatTime(segment.start)}
                </Text>
            </View>
            <Text className="text-foreground leading-5 text-sm">
                {segment.text.trim()}
            </Text>
        </Pressable>
    );
});

export default function AudioTranscript({
    onClose,
    content,
    segments,
    title
}: AudioTranscriptProps) {
    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();

    // Generate custom HTML for the transcript with segments using template
    const customHTML = useMemo(() => {
        return generateTranscriptHTML('audio', {
            title: title || 'Transcript',
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            content: content,
            segments: segments.map(segment => ({
                start: segment.start,
                text: segment.text.trim()
            }))
        });
    }, [segments, title, content]);

    const {
        isLoading,
        error,
        printTranscript,
        shareTranscript,
        clearError
    } = useTranscript({
        onSuccess: () => {
            console.log('Operation successful');
            // Clear any previous errors on success
            clearError();
        },
        onError: (err) => {
            console.error('Operation failed:', err);
            // Show user-friendly error message
            Alert.alert(
                'Sharing Error',
                err.message || 'Failed to share transcript. Please try again.',
                [
                    { text: 'OK', onPress: clearError }
                ]
            );
        }
    });

    // Show error alert when error state changes
    useEffect(() => {
        if (error) {
            Alert.alert(
                'Sharing Error',
                error.message || 'Failed to share transcript. Please try again.',
                [
                    { text: 'OK', onPress: clearError }
                ]
            );
        }
    }, [error, clearError]);

    return (
        <View className="flex-1 bg-muted gap-3" style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View className="px-2 flex-row justify-between items-center">
                <HapticButton
                    onPress={() => onClose()}
                    className="rounded-full"
                >
                    <Ionicons
                        className="-ml-0.5"
                        name="chevron-back-outline"
                        size={30}
                        color={isDark ? 'white' : 'black'}
                    />
                </HapticButton>

                <View className="flex-row gap-2 mr-2">
                    <HapticButton
                        hapticType="medium"
                        className="rounded-full items-center justify-center"
                        accessibilityRole="button"
                        accessibilityLabel="Note options"
                        onPress={() => shareTranscript(content, title)}
                    >
                        <Ionicons name="share-outline" size={26} color={isDark ? 'white' : 'black'} />
                    </HapticButton>
                    <HapticButton
                        onPress={() => printTranscript(title, customHTML)}
                        className="rounded-full"
                        disabled={isLoading}
                    >
                        <Ionicons
                            name={"print-outline"}
                            size={26}
                            color={isDark ? 'white' : 'black'}
                        />
                    </HapticButton>
                </View>

            </View>
            <View className="px-4" >
                <Text
                    variant="h3"
                    className="text-foreground font-medium"
                >
                    {title}
                </Text>
            </View>
            <View
                className="flex-1 rounded-2xl shadow-xs bg-background border border-foreground/5 mx-4 p-4"
            >
                <Text variant='h4' className="text-[#fdb728] mb-4 font-semibold">Transcript</Text>
                <FlashList
                    data={segments}
                    renderItem={({ item }) => <AudioTranscriptSegmentItem segment={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    estimatedItemSize={80}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}
