import { useState, useMemo } from 'react'
import { HapticButton, NotesList, SearchBar } from '@/components'
import { useNotes } from '@/hooks/useNotes'
import type { Note } from '@/types/note'
import { useSearch } from '@/hooks/useSearch'
import { searchNotes } from '@/utils/search'
import { supabase } from '@/lib/supabase'
import { ScrollView, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui/text'
import { useRouter } from 'expo-router'

interface NotesViewProps {
    folderId?: string | null,
    favorite?: boolean
}

export default function NotesView({
    folderId,
    favorite
}: NotesViewProps) {
    const router = useRouter()
    const [isGridView, setIsGridView] = useState(false)
    const { notes, loading, error, refresh, deleteNote, updateNoteFavorite, updateNoteFolder } = useNotes({
        folderId,
        favorite
    })

    // Search functionality with debouncing
    const { query, debouncedQuery, setQuery, clearSearch, isSearching } = useSearch({
        debounceMs: 300,
        minLength: 0
    })

    // Filter notes based on search query
    const filteredNotes = useMemo(() => {
        if (!debouncedQuery.trim()) return notes
        return searchNotes(notes, debouncedQuery)
    }, [notes, debouncedQuery])

    const onNotePress = (note: Note) => {
        router.push(`/(main)/notes/note-detail?noteId=${note.id}`)
    }

    const onNoteDelete = async (noteId: string) => {
        await deleteNote(noteId)
    }

    const onNoteFavorite = async (noteId: string, favorite: boolean) => {
        await updateNoteFavorite(noteId, favorite)
    }

    const onNoteShare = (noteId: string) => {
        router.push(`/(main)/notes/note-detail?=${noteId}`); // Remove the braces in params
    }

    const onNoteAddToCategory = (noteId: string, remove: boolean) => {
        if (remove) {
            updateNoteFolder(noteId, null)
        } else {
            router.push(`/(main)/notes/note-add-folder?noteId=${noteId}`);
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
                        placeholder="Search notes..."
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
            <ScrollView className="flex-1 px-4">
                <NotesList
                    notes={filteredNotes}
                    isGridView={isGridView}
                    onNotePress={onNotePress}
                    onNoteDelete={onNoteDelete}
                    onNoteFavorite={onNoteFavorite}
                    onNoteShare={onNoteShare}
                    onNoteAddToCategory={onNoteAddToCategory}
                    emptyState={
                        debouncedQuery.trim() ? (
                            <View className="flex-1 items-center justify-center py-8">
                                <Text className="text-muted-foreground text-center text-lg">
                                    No notes found for "{debouncedQuery}"
                                </Text>
                                <Text className="text-muted-foreground text-center text-sm mt-1">
                                    Try a different search term
                                </Text>
                            </View>
                        ) : undefined
                    }
                />
            </ScrollView>
        </>
    )
}
