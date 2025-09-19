import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams, router } from 'expo-router';
import { useFolders } from '@/hooks/useFolders';
import { SearchBar } from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import type { Folder } from '@/types/folder';
import { HapticButton } from '@/components';
import { useNotes } from '@/hooks/useNotes';

export default function NoteAddFolder() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { folders } = useFolders();
  const { updateNoteFolder } = useNotes();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(false);

  const { query, setQuery } = useSearch({
    debounceMs: 300,
    minLength: 0,
  });

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!query.trim()) return folders;
    return folders.filter((folder) => folder.title?.toLowerCase().includes(query.toLowerCase()));
  }, [folders, query]);

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolder((prev) => (prev === folderId ? null : folderId));
  };

  const handleSaveChanges = () => {
    console.log('Selected folder:', selectedFolder);
    if (!selectedFolder) return;
    updateNoteFolder(noteId, selectedFolder as string);
    router.back();
  };

  return (
    <View className="flex-1 bg-muted">
      {/* Modal Header */}
      <View className="pb-4 pt-2">
        {/* Drag Indicator */}
        <View className="mb-4 mt-4 flex-row items-center justify-center">
          <View className="h-2 w-16 rounded-full bg-muted-foreground/30" />
        </View>

        {/* Title */}
        <Text variant="h2" className="text-center font-semibold text-foreground">
          Select Folder
        </Text>
      </View>

      {/* Search and View Controls */}
      <View className="mb-4 px-4">
        <View className="flex-row items-center gap-1">
          {/* Search Bar */}
          <View className="flex-1">
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Search folders..."
              className="border-border bg-background"
            />
          </View>

          {/* View Toggle Buttons */}
          <View className="flex-row gap-1">
            <HapticButton
              hapticType="medium"
              onPress={() => setIsGridView(!isGridView)}
              className="h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
              <Ionicons
                name={isGridView ? 'menu-outline' : 'grid-outline'}
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
              <View key={folder.id} className="mb-6 w-[30%]">
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
          className={cn('h-12 w-full rounded-xl', selectedFolder ? 'bg-primary' : 'bg-muted')}
          disabled={!selectedFolder}>
          <Text
            className={cn(
              'text-base font-semibold',
              selectedFolder ? 'text-primary-foreground' : 'text-muted-foreground'
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

function FolderSelectItem({
  folder,
  isSelected,
  onToggle,
  variant = 'list',
}: FolderSelectItemProps) {
  if (variant === 'grid') {
    return (
      <TouchableOpacity
        onPress={onToggle}
        className={cn('items-center', !isSelected && 'opacity-50')}
        activeOpacity={0.7}>
        {/* Folder Icon with Radio Button */}
        <View className="relative mb-2 h-16 w-16 items-center justify-center">
          <Image
            source={require('~/assets/images/folder.png')}
            style={{ width: 54, height: 54 }}
            resizeMode="contain"
          />
          <View
            className={cn(
              'absolute -right-1 top-0 h-5 w-5 items-center justify-center rounded-full border-2',
              isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
            )}>
            {isSelected && <View className="h-1.5 w-1.5 rounded-full bg-white" />}
          </View>
        </View>

        {/* Folder Info */}
        <View className="items-center px-1">
          <Text className="mb-1 text-center text-sm font-medium text-foreground" numberOfLines={2}>
            {folder.title || 'Untitled Folder'}
          </Text>
          <Text className="text-center text-xs text-muted-foreground">
            {folder.count} {folder.count === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onToggle}
      className={cn('flex-row items-center px-1 py-3 pr-4', !isSelected && 'opacity-50')}
      activeOpacity={0.7}>
      <View className="flex-row items-center rounded-lg">
        {/* Folder Icon */}
        <View className="mr-3 h-12 w-12 items-center justify-center">
          <Image
            source={require('~/assets/images/folder.png')}
            style={{ width: 48, height: 48 }}
            resizeMode="contain"
          />
        </View>

        {/* Folder Info */}
        <View className="flex-1">
          <Text className="text-base font-medium text-foreground">
            {folder.title || 'Untitled Folder'}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {folder.count} {folder.count === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {/* Radio Button */}
        <View
          className={cn(
            'h-6 w-6 items-center justify-center rounded-full border-2',
            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
          )}>
          {isSelected && <View className="h-2 w-2 rounded-full bg-white" />}
        </View>
      </View>
    </TouchableOpacity>
  );
}
