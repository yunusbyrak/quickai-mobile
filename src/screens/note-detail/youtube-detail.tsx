
import { HapticButton } from "@/components/ui/haptic-button";
import { Text } from "@/components/ui/text";
import { Note } from "@/types/note";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View, Modal } from "react-native";
import { getYoutubeMeta } from "react-native-youtube-iframe";
import { YoutubeMeta } from "react-native-youtube-iframe";
import { useYoutubeDetail } from "@/hooks/useDetailsHook";
import { getYouTubeVideoId } from "@/utils/functions";
import TranscriptScreen from "./youtube-transcript";

interface NoteDetailYoutubeProps {
    note: Note;
}

export default function YoutubeDetailScreen({
    note
}: NoteDetailYoutubeProps) {
    const router = useRouter();
    const { data: youtubeData, isLoading, error } = useYoutubeDetail(note.id);
    const [thumbnails, setThumbnails] = useState<YoutubeMeta[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [showTranscriptModal, setShowTranscriptModal] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const [selectedTranscriptData, setSelectedTranscriptData] = useState<any[]>([]);

    const handleViewTranscript = (videoIndex: number) => {
        setSelectedVideoIndex(videoIndex);

        // Parse transcript data for the selected video
        if (youtubeData?.transcripted_data && Array.isArray(youtubeData.transcripted_data)) {
            const selectedVideo = (youtubeData.transcripted_data as any)[videoIndex];
            if (selectedVideo && selectedVideo.transcript && Array.isArray(selectedVideo.transcript)) {
                setSelectedTranscriptData(selectedVideo.transcript);
            } else {
                setSelectedTranscriptData([]);
            }
        } else {
            setSelectedTranscriptData([]);
        }

        setShowTranscriptModal(true);
    };

    useEffect(() => {
        if (youtubeData?.url) {
            if (youtubeData.multiple) {
                // Handle multiple URLs
                const urls = youtubeData.url.split(',').map(url => url.trim());
                const videoIds = urls.map(url => getYouTubeVideoId(url)).filter(id => id !== null);

                // Fetch metadata for all videos
                Promise.all(videoIds.map(id => getYoutubeMeta(id!)))
                    .then(metas => setThumbnails(metas));
            } else {
                // Single URL case
                const videoId = getYouTubeVideoId(youtubeData.url);
                if (videoId) {
                    getYoutubeMeta(videoId).then(meta => setThumbnails([meta]));
                }
            }
        }
    }, [youtubeData]);

    if (isLoading) {
        return (
            <View className="flex-1 mb-2">
                <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-2 flex-col">
                    <Text className="text-sm text-foreground/50">Loading YouTube details...</Text>
                </View>
            </View>
        );
    }

    if (error || !youtubeData) {
        return (
            <View className="flex-1 mb-2">
                <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-2 flex-col">
                    <Text className="text-sm text-destructive">Failed to load YouTube details</Text>
                </View>
            </View>
        );
    }

    const renderVideoList = () => {
        if (thumbnails.length === 0) return null;

        const videosToShow = showAll ? thumbnails : thumbnails.slice(0, 1);

        return (
            <View className="flex-col gap-2">
                {videosToShow.map((video, index) => (
                    <View key={index} className="flex-row gap-4">
                        <Image
                            source={{ uri: video?.thumbnail_url }}
                            className="w-20 h-20 rounded-lg"
                            resizeMode="cover"
                        />
                        <View className="flex-1 justify-center gap-2">
                            <View className="flex-col gap-1">
                                <Text className="text-sm" numberOfLines={1}>
                                    {video?.title || youtubeData.title}
                                </Text>
                                <Text className="text-xs text-foreground/50">
                                    {video?.author_name}
                                </Text>
                            </View>
                            <HapticButton
                                hapticType="medium"
                                className="items-start"
                                onPress={() => handleViewTranscript(index)}
                            >
                                <View className="bg-muted-foreground/10 rounded-full p-1 px-2">
                                    <Text className="text-xs">View Transcript</Text>
                                </View>
                            </HapticButton>
                        </View>
                    </View>
                ))}

                {thumbnails.length > 1 && !showAll && (
                    <HapticButton
                        hapticType="light"
                        onPress={() => setShowAll(true)}
                        className="items-center "
                    >
                        <Text className="text-xs text-primary">
                            Show {thumbnails.length - 1} more video{thumbnails.length - 1 > 1 ? 's' : ''}
                        </Text>
                    </HapticButton>
                )}

                {thumbnails.length > 1 && showAll && (
                    <HapticButton
                        hapticType="light"
                        onPress={() => setShowAll(false)}
                        className="items-center py-2"
                    >
                        <Text className="text-xs text-primary">
                            Show less
                        </Text>
                    </HapticButton>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 mb-2">
            <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-2 flex-col">
                {renderVideoList()}
            </View>

            <Modal
                visible={showTranscriptModal}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <TranscriptScreen
                    onClose={() => setShowTranscriptModal(false)}
                    transcriptData={selectedTranscriptData}
                    videoTitle={(youtubeData?.transcripted_data as any)?.[selectedVideoIndex]?.title || thumbnails[selectedVideoIndex]?.title || youtubeData?.title || undefined}
                />
            </Modal>
        </View>
    );
}
