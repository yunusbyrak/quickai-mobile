import { ScrollView, StyleSheet, View, ActivityIndicator, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Text } from "./ui/text";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "./ui/button";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { HapticButton } from "./ui/haptic-button";
import { THEME } from "@/lib/theme";
import { SvgIcon } from "./ui/svg-icon";
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useRouter } from "expo-router";



const getIconForNoteType = (type: string | null) => {
    switch (type) {
        case 'audio':
            return 'graphic-eq'
        case 'pdf':
            return 'picture-as-pdf'
        case 'youtube':
            return 'play-circle-outline'
        case 'image':
            return 'image'
        case 'website':
            return 'language'
        case 'meet':
        case 'zoom':
        case 'teams':
            return 'videocam'
        default:
            return 'graphic-eq'
    }
}

const getColorForNoteType = (type: string | null) => {
    switch (type) {
        case 'audio':
            return '#FF6B35'
        case 'pdf':
            return '#E53E3E'
        case 'youtube':
            return '#FF0000'
        case 'image':
            return '#805AD5'
        case 'website':
            return '#38A169'
        case 'meet':
        case 'zoom':
        case 'teams':
            return '#3182CE'
        default:
            return '#FF6B35'
    }
}

const renderNoteIcon = (type: string | null, size: number, color: string, status: string | null) => {
    if (status === 'running') {
        return <ActivityIndicator size="small" color={color} />
    }

    if (status === 'failed') {
        return <MaterialIcons name="error" size={size} color={'red'} />
    }

    // Use SVG icons for specific types
    if (type === 'youtube' || type === 'image' || type === 'pdf') {
        return <SvgIcon name={type as 'youtube' | 'image' | 'pdf'} size={size} color={color} />
    }

    // Use MaterialIcons for other types
    const iconName = getIconForNoteType(type) as any
    return <MaterialIcons name={iconName} size={size} color={color} />
}

interface NoteOption {
    id: string;
    title: string;
    description: string;
    type: string;
    iconType: 'svg' | 'material' | 'ionic';
    iconName?: string;
    onPress: () => void;
}

export default function NoteAddModal() {
    const router = useRouter();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const snapPoints = useMemo(() => ["65%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

    // Menu action handlers
    const handleRecordAudio = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
        console.log("Record Audio pressed");
        router.push('/audio-recording');
        // router.push('/audio-test');
    }, []);

    const handleTakePicture = useCallback(() => {
        console.log("Take Picture pressed");
        bottomSheetModalRef.current?.dismiss();
        router.push('/image-scan');
    }, []);

    const handleUploadPDF = useCallback(() => {
        console.log("Upload PDF pressed");
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleEnterText = useCallback(() => {
        console.log("Enter Text pressed");
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleYouTubeVideo = useCallback(() => {
        console.log("YouTube Video pressed");
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleUploadImage = useCallback(() => {
        console.log("Upload Image pressed");
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleUploadAudio = useCallback(() => {
        console.log("Upload Audio pressed");
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const handleUploadViaURL = useCallback(() => {
        console.log("Upload via URL pressed");
        bottomSheetModalRef.current?.dismiss();
    }, []);

    // Note options array
    const noteOptions: NoteOption[] = [
        {
            id: 'record-audio',
            title: 'Record Audio',
            description: 'Start recording your voice',
            type: 'audio',
            iconType: 'svg',
            onPress: handleRecordAudio
        },
        {
            id: 'take-picture',
            title: 'Take Picture',
            description: 'Capture a photo with camera',
            type: 'image',
            iconType: 'svg',
            onPress: handleTakePicture
        },
        {
            id: 'upload-pdf',
            title: 'Upload PDF',
            description: 'Select a PDF document',
            type: 'pdf',
            iconType: 'svg',
            onPress: handleUploadPDF
        },
        {
            id: 'enter-text',
            title: 'Enter Text',
            description: 'Type or paste your text',
            type: 'text',
            iconType: 'ionic',
            iconName: 'text-outline',
            onPress: handleEnterText
        },
        {
            id: 'youtube-video',
            title: 'Use YouTube Video',
            description: 'Add a YouTube video URL',
            type: 'youtube',
            iconType: 'svg',
            onPress: handleYouTubeVideo
        },
        {
            id: 'upload-image',
            title: 'Upload Image',
            description: 'Select from gallery',
            type: 'image',
            iconType: 'material',
            iconName: 'photo-library',
            onPress: handleUploadImage
        },
        {
            id: 'upload-audio',
            title: 'Upload Audio',
            description: 'Select audio file from device',
            type: 'audio',
            iconType: 'material',
            iconName: 'audiotrack',
            onPress: handleUploadAudio
        },
        // {
        //     id: 'upload-url',
        //     title: 'Upload via URL',
        //     description: 'Website, recording, PDF, image file',
        //     type: 'website',
        //     iconType: 'svg',
        //     onPress: handleUploadViaURL
        // }
    ];

    // Helper function to render icon based on type
    const renderOptionIcon = (option: NoteOption) => {
        // const color = getColorForNoteType(option.type);
        const color = '#333';

        if (option.iconType === 'svg') {
            return renderNoteIcon(option.type, 20, color, null);
        } else if (option.iconType === 'material' && option.iconName) {
            return <MaterialIcons name={option.iconName as any} size={20} color={color} />;
        } else if (option.iconType === 'ionic' && option.iconName) {
            return <Ionicons name={option.iconName as any} size={20} color={color} />;
        }

        return renderNoteIcon(option.type, 20, color, null);
    };

    // renders
    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
            />
        ),
        []
    );

    return (
        <>
            <View className="flex-row items-center justify-center px-4 pt-4 bg-transparent absolute bottom-10 right-0 left-0">
                <HapticButton
                    onPress={handlePresentModalPress}
                    className="h-12 bg-foreground rounded-full items-center justify-center flex-row px-6 gap-2"
                >
                    <MaterialIcons name="add" size={24} color="white" />
                    <Text className="font-medium text-background">New Note</Text>
                </HapticButton>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                backdropComponent={renderBackdrop}
                onChange={handleSheetChanges}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                backgroundStyle={{
                    backgroundColor: THEME.light.muted
                }}
            >
                <BottomSheetView className="h-full px-4 py-2 gap-3">

                    {/* Header */}
                    <View className="flex-row items-center justify-between">
                        <Text className="font-bold text-xl">New Notes</Text>
                        <HapticButton className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center" onPress={() => bottomSheetModalRef.current?.dismiss()}>
                            <Ionicons name="close-outline" size={24} color={THEME.light.ring} />
                        </HapticButton>
                    </View>

                    {/* Content */}
                    <ScrollView className="flex-1 h-full" showsVerticalScrollIndicator={false}>
                        <View className="gap-2 pb-10">
                            {noteOptions.map((option) => (
                                <HapticButton
                                    key={option.id}
                                    className={cn(' bg-background rounded-lg shadow-sm shadow-black/5 p-3 ')}
                                    onPress={option.onPress}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View className={cn("rounded-lg items-center justify-center w-10 h-10 bg-muted")}>
                                            {renderOptionIcon(option)}
                                        </View>
                                        <View className="flex-1 flex-col gap-1">
                                            <Text variant="small" className="font-semibold text-foreground text-start" numberOfLines={1}>
                                                {option.title}
                                            </Text>
                                            <View className="flex-row items-center gap-2">
                                                <Text className="text-muted-foreground text-xs">
                                                    {option.description}
                                                </Text>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
});
