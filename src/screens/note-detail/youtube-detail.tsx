
import { HapticButton } from "@/components/ui/haptic-button";
import { Text } from "@/components/ui/text";
import { Note } from "@/types/note";
import { useRouter } from "expo-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Image, View, Modal } from "react-native";
import { getYoutubeMeta } from "react-native-youtube-iframe";
import { YoutubeMeta } from "react-native-youtube-iframe";
import { useYoutubeDetail } from "@/hooks/useDetailsHook";
import { getYouTubeVideoId } from "@/utils/functions";
import TranscriptScreen from "./youtube-transcript";

interface NoteDetailYoutubeProps {
    note: Note;
}

export default function YoutubeDetail({
    note
}: NoteDetailYoutubeProps) {
    const router = useRouter();
    const { data: youtubeData, isLoading, error } = useYoutubeDetail(note.id);
    const [thumbnails, setThumbnails] = useState<YoutubeMeta[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [showTranscriptModal, setShowTranscriptModal] = useState(false);
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
    const [selectedTranscriptData, setSelectedTranscriptData] = useState<any[]>([]);

    const parsedTranscriptData = useMemo(() => {
        if (!youtubeData?.transcripted_data || !Array.isArray(youtubeData.transcripted_data)) {
            return [];
        }

        return youtubeData.transcripted_data.map((video: any) => {
            if (video && video.transcript && Array.isArray(video.transcript)) {
                return {
                    ...video,
                    transcript: video.transcript
                };
            }
            return {
                ...video,
                transcript: []
            };
        });
    }, [youtubeData?.transcripted_data]);

    const handleViewTranscript = useCallback((videoIndex: number) => {
        setSelectedVideoIndex(videoIndex);

        const selectedVideo = parsedTranscriptData[videoIndex];
        if (selectedVideo && selectedVideo.transcript) {
            setSelectedTranscriptData(selectedVideo.transcript);
        } else {
            setSelectedTranscriptData([]);
        }

        setShowTranscriptModal(true);
    }, [parsedTranscriptData]);

    const videoIds = useMemo(() => {
        if (!youtubeData?.url) return [];

        if (youtubeData.multiple) {
            const urls = youtubeData.url.split(',').map(url => url.trim());
            return urls.map(url => getYouTubeVideoId(url)).filter(id => id !== null) as string[];
        } else {
            const videoId = getYouTubeVideoId(youtubeData.url);
            return videoId ? [videoId] : [];
        }
    }, [youtubeData?.url, youtubeData?.multiple]);

    useEffect(() => {
        if (videoIds.length > 0) {
            Promise.all(videoIds.map(id => getYoutubeMeta(id)))
                .then(metas => setThumbnails(metas))
                .catch(() => {
                    setThumbnails([]);
                });
        }
    }, [videoIds]);

    const videosToShow = useMemo(() => {
        return showAll ? thumbnails : thumbnails.slice(0, 1);
    }, [thumbnails, showAll]);

    const VideoItem = useCallback(({ video, index }: { video: YoutubeMeta; index: number }) => (
        <View className="flex-row gap-4">
            <Image
                source={{ uri: video?.thumbnail_url }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
            />
            <View className="flex-1 justify-center gap-2">
                <View className="flex-col gap-1">
                    <Text className="text-sm" numberOfLines={1}>
                        {video?.title || youtubeData?.title}
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
    ), [youtubeData?.title, handleViewTranscript]);

    const renderVideoList = useCallback(() => {
        if (thumbnails.length === 0) return null;

        return (
            <View className="flex-col gap-2">
                {videosToShow.map((video, index) => (
                    <VideoItem key={index} video={video} index={index} />
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
    }, [thumbnails.length, videosToShow, showAll, VideoItem]);

    const selectedVideoTitle = useMemo(() => {
        return parsedTranscriptData[selectedVideoIndex]?.title ||
               thumbnails[selectedVideoIndex]?.title ||
               youtubeData?.title ||
               undefined;
    }, [parsedTranscriptData, selectedVideoIndex, thumbnails, youtubeData?.title]);

    const handleCloseModal = useCallback(() => {
        setShowTranscriptModal(false);
    }, []);

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
                    onClose={handleCloseModal}
                    transcriptData={selectedTranscriptData}
                    videoTitle={selectedVideoTitle}
                />
            </Modal>
        </View>
    );
}
