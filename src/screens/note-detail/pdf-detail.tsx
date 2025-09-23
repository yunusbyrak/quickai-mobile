import { SvgIcon } from "@/components";
import { Text } from "@/components/ui/text";
import { usePdfDetail } from "@/hooks/useDetailsHook";
import { Note } from "@/types/note";
import { View } from "react-native";

interface PdfDetailProps {
    note: Note;
}

export default function PDFDetail({ note }: PdfDetailProps) {

    const { data: pdfDetail, isLoading, error } = usePdfDetail(note.id);

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

                <View className="flex-row items-center gap-2">
                    <View className="rounded-lg bg-muted-foreground/10 p-2">
                        <SvgIcon name="pdf" size={26} color="black" />
                    </View>
                    <View>
                        <Text className="text-sm font-semibold" numberOfLines={1}>{note.title}</Text>
                        <Text className="text-xs text-muted-foreground">{pdfDetail?.pages_count} pages</Text>
                    </View>
                </View>

                <View className="gap-2">
                    <Text className="text-[#fdb728] font-semibold text-lg">Snippet</Text>
                    <Text className="text-sm" numberOfLines={5}>{pdfDetail?.snippet}</Text>
                </View>
            </View>

        </View>
    )
}
