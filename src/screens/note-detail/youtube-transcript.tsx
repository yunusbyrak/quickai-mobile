import { View, ActivityIndicator } from "react-native"
import { Text } from "@/components/ui/text"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { HapticButton } from "@/components"
import { useTheme } from "@/context/ThemeContext"
import { FlashList } from '@shopify/flash-list'
import React, { useMemo, useCallback, useState, useEffect } from "react"



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

// Memoized transcript segment component for better performance
const TranscriptSegmentItem = React.memo(({ segment }: { segment: TranscriptSegment }) => {
    const formattedTime = useMemo(() => {
        const totalSeconds = Math.floor(segment.offset / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, [segment.offset]);

    const endTime = useMemo(() => {
        const totalSeconds = Math.floor((segment.offset + segment.duration) / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, [segment.offset, segment.duration]);

    const cleanText = useMemo(() => {
        return segment.text.replace(/\n/g, ' ');
    }, [segment.text]);

    return (
        <View className="mb-4">
            <View className="flex-col items-start">
                <View className="rounded">
                    <Text className="text-orange-500 text-xs font-medium">
                        [{formattedTime} - {endTime}]
                    </Text>
                </View>
                <Text className="text-gray-900 text-sm w-full">
                    {cleanText}
                </Text>
            </View>
        </View>
    );
});

export default function TranscriptScreen({
    onClose,
    transcriptData,
    videoTitle
}: TranscriptScreenProps) {
    const insets = useSafeAreaInsets();
    const { isDark } = useTheme();

    const [displayedSegments, setDisplayedSegments] = useState<TranscriptSegment[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const ITEMS_PER_PAGE = 50;

    const currentTranscript = useMemo(() => {
        return transcriptData && transcriptData.length > 0 ? transcriptData : [];
    }, [transcriptData]);

    useEffect(() => {
        if (currentTranscript.length > 0) {
            const initialSegments = currentTranscript.slice(0, ITEMS_PER_PAGE);
            setDisplayedSegments(initialSegments);
            setCurrentPage(1);
        } else {
            setDisplayedSegments([]);
            setCurrentPage(0);
        }
    }, [currentTranscript]);

    const loadMoreSegments = useCallback(() => {
        if (isLoadingMore || displayedSegments.length >= currentTranscript.length) return;

        setIsLoadingMore(true);

        setTimeout(() => {
            const nextPage = currentPage + 1;
            const startIndex = nextPage * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const newSegments = currentTranscript.slice(startIndex, endIndex);

            setDisplayedSegments(prev => [...prev, ...newSegments]);
            setCurrentPage(nextPage);
            setIsLoadingMore(false);
        }, 300);
    }, [currentPage, displayedSegments.length, currentTranscript, isLoadingMore]);

    const renderTranscriptItem = useCallback(({ item }: { item: TranscriptSegment }) => {
        return <TranscriptSegmentItem segment={item} />;
    }, []);

    const keyExtractor = useCallback((item: TranscriptSegment, index: number) => {
        return `${item.offset}-${index}`;
    }, []);

    const ListFooter = useCallback(() => {
        if (!isLoadingMore) return <View className="h-4" />;

        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#f97316" />
                <Text className="text-xs text-foreground/50 mt-2">Loading more...</Text>
            </View>
        );
    }, [isLoadingMore]);

    const handleEndReached = useCallback(() => {
        if (displayedSegments.length < currentTranscript.length && !isLoadingMore) {
            loadMoreSegments();
        }
    }, [displayedSegments.length, currentTranscript.length, isLoadingMore, loadMoreSegments]);

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
                <FlashList
                    data={displayedSegments}
                    renderItem={renderTranscriptItem}
                    keyExtractor={keyExtractor}
                    ListFooterComponent={ListFooter}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    estimatedItemSize={80}
                    removeClippedSubviews={true}
                />
            </View>
        </View>
    )
}
