import { HapticButton } from "@/components";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/context/ThemeContext";
import { useFolderStore } from "@/store/folder";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import NotesView from "@/screens/home/notes-view";
import { ContextMenu, type ContextMenuAction } from '@/components/ui/context-menu'

export default function FolderDetail() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { updateFolder, deleteFolder } = useFolderStore()
    const { isDark } = useTheme()
    const { folderId } = useLocalSearchParams<{ folderId: string }>()

    // Get folder data from store
    const folders = useFolderStore((state) => state.folders)
    const folder = useMemo(() => {
        return folders.find(f => f.id === folderId)
    }, [folders, folderId])

    const actions: ContextMenuAction[] = [
        {
            id: 'edit',
            title: 'Edit Folder',
            systemIcon: 'pencil',
        },
        {
            id: 'delete',
            title: 'Delete',
            systemIcon: 'trash',
            destructive: true,
        },
    ];

    const onContextMenuActionPress = async (actionId: string, action: ContextMenuAction) => {
        switch (actionId) {
            case 'edit':
                router.push(`/(main)/folders/folder-edit?folderId=${folderId}`)
                break;
            case 'delete':
                Alert.alert(
                    'Delete Folder',
                    'Are you sure you want to delete this folder? This action cannot be undone.',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                                deleteFolder(folderId)
                            },
                        },
                    ],
                    { cancelable: true }
                );
                break;
        }
    }

    return (
        <View
            className='flex-1 bg-muted'
            style={{
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 16),
            }}
        >
            {/* Header Gradient Image */}
            <View className="absolute top-0 left-0 right-0 items-center">
                <Image
                    source={require('~/assets/images/header-gradient.png')}
                    className="w-full"
                    resizeMode="cover"
                />
            </View>


            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pb-4">
                <View className="flex-row items-center gap-2">
                    <HapticButton
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-background rounded-full items-center justify-center"
                    >
                        <Ionicons name="chevron-back-outline" size={24} color={isDark ? 'white' : 'black'} />
                    </HapticButton>
                    <Text variant="h3" className="font-bold text-foreground font-poppins-bold">
                        {folder?.title || 'Folder'} ({folder?.count || 0})
                    </Text>
                </View>
                <ContextMenu
                    previewBackgroundColor='transparent'
                    actions={actions}
                    onActionPress={onContextMenuActionPress}
                >
                    <HapticButton
                        hapticType="medium"
                        onPress={() => router.push('/settings')}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        accessibilityRole="button"
                        accessibilityLabel="Settings"
                    >
                        <Ionicons name="settings-outline" size={22} color={isDark ? 'white' : 'black'} />
                    </HapticButton>
                </ContextMenu>

            </View>

            {/* Folder Content */}
            <NotesView
                folderId={folderId}
            />
        </View>
    )
}
