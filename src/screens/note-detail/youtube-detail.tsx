import YoutubeVideo from "@/components/youtube-video";
import { Note } from "@/types/note";
import { View } from "react-native";

interface NoteDetailYoutubeProps {
    note: Note;
}

export default function YoutubeDetailScreen({
    note
}: NoteDetailYoutubeProps) {
    return (
        <View className="mb-2">
            <YoutubeVideo videoId="RcYjXbSJBN8" />
        </View>
    );
}
