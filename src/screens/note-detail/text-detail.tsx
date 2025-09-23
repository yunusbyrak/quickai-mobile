import { SvgIcon } from "@/components";
import { Text } from "@/components/ui/text";
import { useTextDetail } from "@/hooks/useDetailsHook";
import { Note } from "@/types/note";
import { View } from "react-native";

interface TextDetailProps {
    note: Note;
}

export default function TextDetail({ note }: TextDetailProps) {

    const { data: textDetail, isLoading, error } = useTextDetail(note.id);

    if (isLoading) {

        return (
            <View className="flex-1 mb-2">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 mb-2">
                <Text>Error</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 mb-2">
            <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4 gap-4 flex-col">

                <View className="gap-2">
                    <Text className="text-[#fdb728] font-semibold text-lg">Snippet</Text>
                    <Text className="text-sm" numberOfLines={5}>{textDetail?.snippet}</Text>
                </View>
            </View>

        </View>
    )
}
