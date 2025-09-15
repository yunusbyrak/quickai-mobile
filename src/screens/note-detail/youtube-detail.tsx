
import { HapticButton } from "@/components/ui/haptic-button";
import { Text } from "@/components/ui/text";
import { Note } from "@/types/note";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { getYoutubeMeta } from "react-native-youtube-iframe";
import { YoutubeMeta } from "react-native-youtube-iframe";

interface NoteDetailYoutubeProps {
    note: Note;
}

export default function YoutubeDetailScreen({
    note
}: NoteDetailYoutubeProps) {
    const videoId = 'RcYjXbSJBN8';

    const [meta, setMeta] = useState<YoutubeMeta | null>(null);
    useEffect(() => {
        getYoutubeMeta(videoId).then(setMeta);
    }, []);

    return (
        <View className="flex-1 mb-2">
            <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-2 flex-col">
                <View className="flex-row gap-4">
                    <View className="gap-2 overflow-hidden">
                        <Image
                            source={{ uri: meta?.thumbnail_url }}
                            className="w-20 h-20 rounded-lg"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="flex-1 justify-center gap-2">
                        <View className="flex-col gap-1">
                            <Text className="text-sm" numberOfLines={1}>{meta?.title}</Text>
                            <Text className="text-xs text-foreground/50">{meta?.author_name}</Text>
                        </View>
                        <HapticButton
                            hapticType="medium"
                            className="items-start"
                        >
                            <View className="bg-muted-foreground/10 rounded-full p-1 px-2">
                                <Text className="text-xs">View Transcript</Text>
                            </View>
                        </HapticButton>
                    </View>
                </View>
            </View>

        </View>
    );
}
