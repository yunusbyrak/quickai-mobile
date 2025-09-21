import { HapticButton } from "@/components";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { memo } from "react";
import { View, Pressable } from "react-native";
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
    segments: AudioTranscriptionSegment[];
    videoTitle: string;
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
    segments,
    videoTitle
}: AudioTranscriptProps) {

    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();

    return (
        <View className="flex-1 bg-muted gap-3" style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
        }}>
            <View className="px-2">
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
            </View>
            <View className="px-4" >
                <Text
                    variant="h3"
                    className="text-foreground font-medium"
                >
                    Transcript
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
