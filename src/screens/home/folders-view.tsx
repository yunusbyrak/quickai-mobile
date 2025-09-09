import { HapticButton } from "@/components/ui/haptic-button";
import { SearchBar } from "@/components/ui/search-bar";
import { Text } from "@/components/ui/text";
import { FolderList } from "@/components/FolderList";
import { useSearch } from "@/hooks/useSearch";
import { useFolders } from "@/hooks/useFolders";
import { searchFolders } from "@/utils/search";
import type { Folder } from "@/types/folder";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useMemo, useState } from "react";
import { View, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function FoldersView() {
    const router = useRouter()
    const [isGridView, setIsGridView] = useState(false)
    const { query, debouncedQuery, setQuery, clearSearch, isSearching } = useSearch({
        debounceMs: 300,
        minLength: 0
    })

    const { folders, loading, error, refresh, deleteFolder, updateFolder, createFolder } = useFolders()

    // Filter folders based on search query
    const filteredFolders = useMemo(() => {
        if (!debouncedQuery.trim()) return folders
        return searchFolders(folders, debouncedQuery)
    }, [folders, debouncedQuery])

    const handleFolderPress = (folder: Folder) => {
        router.push(`/(main)/folders/folder-detail?folderId=${folder.id}`)
    }

    const handleFolderDelete = async (folderId: string) => {
        try {
            await deleteFolder(folderId)
        } catch (error) {
            Alert.alert('Error', 'Failed to delete folder')
        }
    }

    const handleFolderEdit = (folderId: string) => {
        try {
            if (Platform.OS === 'ios') {
                Alert.prompt(
                    'Edit Folder',
                    'Enter a name for your folder',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'OK', onPress: async (text) => {
                                if (text) {
                                    await updateFolder(folderId, {
                                        title: text
                                    })
                                }
                            }
                        }
                    ]
                );
            } else {
                // Android: Navigate to edit modal
                router.push(`/(main)/folders/folder-edit?folderId=${folderId}`);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to edit folder')
        }
    }

    const handleAddFolder = async () => {
        try {
            if (Platform.OS === 'ios') {
                Alert.prompt(
                    'New Folder',
                    'Enter a name for your new folder',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'OK', onPress: async (text) => {
                                if (text) {
                                    await createFolder({
                                        title: text,
                                        description: ''
                                    })
                                }
                            }
                        }
                    ]
                );
            } else {
                // Android: Navigate to create modal
                router.push('/(main)/folders/folder-create');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create folder')
        }
    }

    return (
        <>
            {/* Search Bar */}
            <View className="px-4 pb-4">
                <View className="flex-row items-center gap-1">
                    <SearchBar
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search folders..."
                        onClear={clearSearch}
                        className="flex-1"
                        returnKeyType="search"
                    />
                    <HapticButton
                        hapticType="medium"
                        onPress={() => setIsGridView(!isGridView)}
                        className="w-12 h-12 bg-background border border-border rounded-full items-center justify-center"
                    >
                        <Ionicons
                            name={isGridView ? "menu-outline" : "grid-outline"}
                            size={20}
                            color="#9CA3AF"
                        />
                    </HapticButton>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 px-4">
                {/* Add Folder Button */}
                <HapticButton
                    hapticType="light"
                    onPress={handleAddFolder}
                    className="mb-4"
                >
                    <View className="flex-row items-center justify-center bg-background border-2 border-dashed border-muted-foreground/30 rounded-xl py-3 px-6">
                        <View className="w-6 border h-6 rounded-full items-center justify-center mr-3">
                            <Ionicons
                                name="add"
                                size={20}
                                color="black"
                            />
                        </View>
                        <Text className="text-foreground font-semibold text-base">
                            Add Folder
                        </Text>
                    </View>
                </HapticButton>

                <FolderList
                    folders={filteredFolders}
                    onFolderPress={handleFolderPress}
                    onFolderDelete={handleFolderDelete}
                    onFolderEdit={handleFolderEdit}
                    isGridView={isGridView}
                />
            </View>
        </>
    )
}
