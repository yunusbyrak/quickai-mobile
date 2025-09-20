import { Text } from "@/components/ui/text";
import { Note } from "@/types/note";
import { View } from "react-native";

interface NoteDetailAudioProps {
    note: Note;
}

export default function NoteDetailAudio({ note }: NoteDetailAudioProps) {
    return (
        <View className="flex-1 mb-2">
            <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-2 flex-col">
                <Text>Audio Detail</Text>
            </View>
        </View>
    );
}
