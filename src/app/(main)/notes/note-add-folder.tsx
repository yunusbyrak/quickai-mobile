import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, router } from "expo-router";
import { useFolders } from "@/hooks/useFolders";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";
import { useSearch } from "@/hooks/useSearch";
import type { Folder } from "@/types/folder";
import { HapticButton } from "@/components";

export default function NoteAddFolder() {
    const { noteId } = useLocalSearchParams<{ noteId: string }>();
    const { folders } = useFolders();
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [isGridView, setIsGridView] = useState(false);

    const { query, setQuery } = useSearch({
        debounceMs: 300,
        minLength: 0
    });

    // Filter folders based on search query
    const filteredFolders = useMemo(() => {
        if (!query.trim()) return folders;
        return folders.filter(folder =>
            folder.title?.toLowerCase().includes(query.toLowerCase())
        );
    }, [folders, query]);

    const handleFolderSelect = (folderId: string) => {
        setSelectedFolder(prev => prev === folderId ? null : folderId);
    };

    const handleSaveChanges = () => {
        console.log('Selected folder:', selectedFolder);
        // TODO: Implement save logic
        // updateNoteFolder(noteId, selectedFolder as string);
        router.back();
    };

    return (
        <View className="bg-muted flex-1">
            {/* Modal Header */}
            <View className="pt-2 pb-4">
                {/* Drag Indicator */}
                <View className="flex-row items-center justify-center mb-4 mt-4">
                    <View className="w-16 h-2 bg-muted-foreground/30 rounded-full" />
                </View>

                {/* Title */}
                <Text variant="h2" className="text-foreground text-center font-semibold">
                    Select Folder
                </Text>
            </View>

            {/* Search and View Controls */}
            <View className="px-4 mb-4">
                <View className="flex-row items-center gap-1">
                    {/* Search Bar */}
                    <View className="flex-1">
                        <SearchBar
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search folders..."
                            className="bg-background border-border"
                        />
                    </View>

                    {/* View Toggle Buttons */}
                    <View className="flex-row gap-1">
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
            </View>

            {/* Folder List */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {isGridView ? (
                    <View className="flex-row flex-wrap justify-between">
                        {filteredFolders.map((folder) => (
                            <View key={folder.id} className="w-[30%] mb-6">
                                <FolderSelectItem
                                    folder={folder}
                                    isSelected={selectedFolder === folder.id}
                                    onToggle={() => handleFolderSelect(folder.id)}
                                    variant="grid"
                                />
                            </View>
                        ))}
                    </View>
                ) : (
                    filteredFolders.map((folder) => (
                        <FolderSelectItem
                            key={folder.id}
                            folder={folder}
                            isSelected={selectedFolder === folder.id}
                            onToggle={() => handleFolderSelect(folder.id)}
                            variant="list"
                        />
                    ))
                )}
            </ScrollView>

            {/* Save Button */}
            <View className="px-4 pb-8 pt-4">
                <Button
                    onPress={handleSaveChanges}
                    className={cn(
                        "w-full rounded-xl h-12",
                        selectedFolder
                            ? "bg-primary"
                            : "bg-muted"
                    )}
                    disabled={!selectedFolder}
                >
                    <Text className={cn(
                        "font-semibold text-base",
                        selectedFolder
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                    )}>
                        Save Changes
                    </Text>
                </Button>
            </View>
        </View>
    );
}

interface FolderSelectItemProps {
    folder: Folder;
    isSelected: boolean;
    onToggle: () => void;
    variant?: 'list' | 'grid';
}

function FolderSelectItem({ folder, isSelected, onToggle, variant = 'list' }: FolderSelectItemProps) {
    if (variant === 'grid') {
        return (
            <TouchableOpacity
                onPress={onToggle}
                className={cn("items-center", !isSelected && "opacity-50")}
                activeOpacity={0.7}
            >
                {/* Folder Icon with Radio Button */}
                <View className="relative w-16 h-16 items-center justify-center mb-2">
                    <Image
                        source={require('~/assets/images/folder.png')}
                        style={{ width: 54, height: 54 }}
                        resizeMode="contain"
                    />
                    <View className={cn(
                        "absolute top-0 -right-1 w-5 h-5 rounded-full border-2 items-center justify-center",
                        isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                    )}>
                        {isSelected && (
                            <View className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                    </View>
                </View>

                {/* Folder Info */}
                <View className="items-center px-1">
                    <Text className="text-foreground text-sm font-medium text-center mb-1" numberOfLines={2}>
                        {folder.title || 'Untitled Folder'}
                    </Text>
                    <Text className="text-muted-foreground text-xs text-center">
                        {folder.count} {folder.count === 1 ? 'item' : 'items'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onToggle}
            className={cn("flex-row items-center py-3 px-1 pr-4", !isSelected && "opacity-50")}
            activeOpacity={0.7}
        >
            <View className="flex-row items-center shadow shadow-black rounded-lg">
                {/* Folder Icon */}
                <View className="w-12 h-12 items-center justify-center mr-3">
                    <Image
                        source={require('~/assets/images/folder.png')}
                        style={{ width: 48, height: 48 }}
                        resizeMode="contain"
                    />
                </View>

                {/* Folder Info */}
                <View className="flex-1">
                    <Text className="text-foreground text-base font-medium">
                        {folder.title || 'Untitled Folder'}
                    </Text>
                    <Text className="text-muted-foreground text-sm">
                        {folder.count} {folder.count === 1 ? 'item' : 'items'}
                    </Text>
                </View>

                {/* Radio Button */}
                <View className={cn(
                    "w-6 h-6 rounded-full border-2 items-center justify-center",
                    isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                )}>
                    {isSelected && (
                        <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
