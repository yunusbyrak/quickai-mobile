import { ScrollView, View } from "react-native";
import { Text } from "./ui/text";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { THEME } from "@/lib/theme";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Ionicons } from "@expo/vector-icons";
import { HapticButton } from "./ui/haptic-button";
import { cn } from "@/lib/utils";

export default function NoteBottom() {

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const snapPoints = useMemo(() => ['65%'], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        []
    );

    const noteOptions = [
        {
            id: 'record-audio',
            title: 'Record Audio',
            description: 'Start recording your voice',
            type: 'audio',
            iconType: 'svg',
        },
        {
            id: 'take-picture',
            title: 'Take Picture',
            description: 'Capture a photo with camera',
            type: 'image',
            iconType: 'svg',
        },
        {
            id: 'upload-pdf',
            title: 'Upload PDF',
            description: 'Select a PDF document',
            type: 'pdf',
            iconType: 'svg',
        },
        {
            id: 'enter-text',
            title: 'Enter Text',
            description: 'Type or paste your text',
            type: 'text',
            iconType: 'ionic',
            iconName: 'text-outline',
        },
        {
            id: 'youtube-video',
            title: 'Use YouTube Video',
            description: 'Add a YouTube video URL',
            type: 'youtube',
            iconType: 'svg',
        },
        {
            id: 'upload-image',
            title: 'Upload Image',
            description: 'Select from gallery',
            type: 'image',
            iconType: 'material',
            iconName: 'photo-library',
        },
        {
            id: 'upload-audio',
            title: 'Upload Audio',
            description: 'Select audio file from device',
            type: 'audio',
            iconType: 'material',
            iconName: 'audiotrack',
        },
    ];

    const renderOptionIcon = (option: any) => {
        const color = '#333';

        return <Ionicons name={option.iconName as any} size={20} color={color} />;
    };

    return (
        <>
            <View className="absolute bottom-0 left-0 right-0  pb-10 px-4 w-full bg-white rounded-t-xl">
                <View className="flex-row justify-between items-center gap-2 pt-2">
                    <Button className="bg-foreground rounded-full active:bg-foreground/80" onPress={handlePresentModalPress} >
                        <Text>AI Templates</Text>
                        <Ionicons name="chevron-up-outline" size={20} color={THEME.light.background} />
                    </Button>
                    <View className="flex-1 relative">
                        <Input placeholder="Chat with AI..." editable={false} className="placeholder:text-foreground/80 rounded-full bg-muted border border-black/15" />
                        <Ionicons name="mic-outline" size={20} className="absolute right-3 top-2.5" color={THEME.light.mutedForeground} />
                    </View>
                </View>
            </View>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                backdropComponent={renderBackdrop}
                onChange={handleSheetChanges}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                backgroundStyle={{
                    backgroundColor: THEME.light.muted,
                }}>
                <BottomSheetView className="h-full gap-3 px-4 py-2">
                    <ScrollView className="h-full flex-1" showsVerticalScrollIndicator={false}>
                        <View className="gap-2 pb-10">
                            {noteOptions.map((option) => (
                                <HapticButton
                                    key={option.id}
                                    className={cn(' rounded-lg bg-background p-3 shadow-sm shadow-black/5 ')}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View
                                            className={cn('h-10 w-10 items-center justify-center rounded-lg bg-muted')}>
                                            {renderOptionIcon(option)}
                                        </View>
                                        <View className="flex-1 flex-col gap-1">
                                            <Text
                                                variant="small"
                                                className="text-start font-semibold text-foreground"
                                                numberOfLines={1}>
                                                {option.title}
                                            </Text>
                                            <View className="flex-row items-center gap-2">
                                                <Text className="text-xs text-muted-foreground">{option.description}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </HapticButton>
                            ))}
                        </View>
                    </ScrollView>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}
