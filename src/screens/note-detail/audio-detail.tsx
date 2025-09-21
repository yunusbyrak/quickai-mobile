import { Text } from "@/components/ui/text";
import { Note } from "@/types/note";
import { View } from "react-native";
import { SeekBar } from "@/components/ui/seek-bar";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useState, useEffect } from "react";

interface NoteDetailAudioProps {
    note: Note;
}

export default function NoteDetailAudio({ note }: NoteDetailAudioProps) {
    const audioPlayer = useAudioPlayer();
    const [audioUri, setAudioUri] = useState<string | null>(null);

    // Extract audio URI from note - you may need to adjust this based on your note structure
    useEffect(() => {
        // Test with the provided URL for now
        const testUri = "http://127.0.0.1:54321/storage/v1/object/sign/audio/6ff03371-213e-4dde-8d45-cdb96bcd4fdf/99d8973e-01cf-47b7-ac0c-ac6556c3f770.mp3?token=eyJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdWRpby82ZmYwMzM3MS0yMTNlLTRkZGUtOGQ0NS1jZGI5NmJjZDRmZGYvOTlkODk3M2UtMDFjZi00N2I3LWFjMGMtYWM2NTU2YzNmNzcwLm1wMyIsImlhdCI6MTc1ODQyNTE5NiwiZXhwIjoxNzYxMDE3MTk2fQ.FjsLlf4-gnPvSQ17CUWs4Ame6XiBNQxANQsTohwWZDY";

        // Try to get URI from note first, fallback to test URI
        const uri = (note as any).audio_url || (note as any).file_url || testUri;
        if (uri) {
            setAudioUri(uri);
            audioPlayer.loadAudio(uri);
        }
    }, [note, audioPlayer]);

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

    return (
        <View className="flex-1 mb-2">
            <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-4 flex-col">
                {audioUri ? (
                    <SeekBar
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
                    />
                ) : (
                    <View className="py-8 items-center">
                        <Text className="text-muted-foreground">
                            No audio file available
                        </Text>
                    </View>
                )}

            </View>
        </View>
    );
}
