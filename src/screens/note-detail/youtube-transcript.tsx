import { ScrollView, View, Pressable } from "react-native"
import { Text } from "@/components/ui/text"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HapticButton } from "@/components"
import { useTheme } from "@/context/ThemeContext"

// Helper function to format time in HH:MM:SS format
const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}


interface TranscriptSegment {
    lang: string;
    text: string;
    offset: number;
    duration: number;
}

interface TranscriptScreenProps {
    onClose: () => void;
    transcriptData?: TranscriptSegment[];
    videoTitle?: string;
}

export default function TranscriptScreen({
    onClose,
    transcriptData,
    videoTitle
}: TranscriptScreenProps) {
    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();

    // Use the pre-parsed transcript data or fallback to example
    const currentTranscript = transcriptData && transcriptData.length > 0 ? transcriptData : [];

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
                    {videoTitle || 'Untitled Note'}
                </Text>
            </View>
            <View
                className="flex-1 bg-white rounded-2xl shadow-xs border border-foreground/5 mx-4"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View className="px-4 py-4 gap-4">
                        {currentTranscript.map((segment, index) =>
                            <View key={index}>
                                <View className="flex-col items-start">
                                    <View className="rounded">
                                        <Text className="text-orange-500 text-xs font-medium">
                                            [{formatTime(segment.offset)} - {formatTime(segment.offset + segment.duration)}]
                                        </Text>
                                    </View>
                                    <Text className="text-gray-900 text-sm w-full">
                                        {segment.text.replace(/\n/g, ' ')}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}
