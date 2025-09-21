import { Text } from "@/components/ui/text";
import { Note } from "@/types/note";
import { View } from "react-native";
import { SeekBar } from "@/components/ui/seek-bar";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioDetail } from "@/hooks/useDetailsHook";
import { useEffect, useState } from "react";
import { HapticButton } from "@/components/ui/haptic-button";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "@/components/ui/modal";
import AudioTranscript from "./audio-transcript";

interface NoteDetailAudioProps {
    note: Note;
}

export default function NoteDetailAudio({ note }: NoteDetailAudioProps) {
    const audioPlayer = useAudioPlayer();
    const [showTranscriptModal, setShowTranscriptModal] = useState(false);
    const { data: audioDetail, isLoading, error } = useAudioDetail(note.id);

    // Load audio when detail is available
    useEffect(() => {
        if (audioDetail?.audioUrl) {
            audioPlayer.loadAudio(audioDetail.audioUrl);
        }
    }, [audioDetail?.audioUrl, audioPlayer]);

    const handleSeek = (value: number) => {
        audioPlayer.setSliderValue(value);
    };

    const handleSeekStart = () => {
        audioPlayer.setIsSeeking(true);
    };

    const handleSeekComplete = async () => {
        audioPlayer.setIsSeeking(false);
        if (audioPlayer.durationMillis > 0) {
            const positionMillis = audioPlayer.sliderValue * audioPlayer.durationMillis;
            await audioPlayer.seekTo(positionMillis);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <View className="flex-1 mb-2">
                <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-4 flex-col">
                    <View className="py-8 items-center">
                        <Text className="text-muted-foreground">
                            Loading audio details...
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // Show error state
    if (error) {
        return (
            <View className="flex-1 mb-2">
                <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-4 flex-col">
                    <View className="py-8 items-center">
                        <Text className="text-muted-foreground">
                            Error loading audio details
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // Show no audio available state
    return (
        <View className="flex-1 mb-2">
            <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-4 flex-col">
                {audioDetail?.audioUrl && <SeekBar
                    positionMillis={audioPlayer.positionMillis}
                    durationMillis={audioPlayer.durationMillis}
                    sliderValue={audioPlayer.sliderValue}
                    isPlaying={audioPlayer.isPlaying}
                    isBuffering={audioPlayer.isBuffering}
                    isSeeking={audioPlayer.isSeeking}
                    onPlayPause={audioPlayer.togglePlayPause}
                    onSeek={handleSeek}
                    onSeekStart={handleSeekStart}
                    onSeekComplete={handleSeekComplete}
                />}
                <View className="relative">
                    <Text variant='h4' className="text-[#fdb728]">Transcript</Text>
                    <Text variant='p' numberOfLines={15} className="text-sm font-light">
                        {audioDetail?.transcript}
                    </Text>
                    <LinearGradient
                        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                        style={{
                            position: 'absolute',
                            bottom: -4,
                            left: 0,
                            right: 0,
                            height: 24,
                            zIndex: 10,
                        }}
                        pointerEvents="none"
                    />
                </View>
                <HapticButton
                    hapticType="medium"
                    className="items-start"
                    onPress={() => { setShowTranscriptModal(true) }}
                >
                    <View className="bg-muted-foreground/10 rounded-full p-1 px-3">
                        <Text className="text-xs">View Transcript</Text>
                    </View>
                </HapticButton>
            </View>

            <Modal
                visible={showTranscriptModal}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <AudioTranscript
                    onClose={() => setShowTranscriptModal(false)}
                    segments={audioDetail?.segments || []}
                    videoTitle={note.title || ''}
                />
            </Modal>

        </View>
    );
}
