import React from 'react'
import { View, ScrollView } from 'react-native'
import { SearchBar } from '@/components'
import { useSearch } from '@/hooks/useSearch'
import { searchNotes } from '@/utils/search'
import { NotesList } from '@/components'
import { Text } from '@/components/ui/text'
import type { Note } from '@/types/note'

interface SearchExampleProps {
  notes: Note[]
  onNotePress?: (note: Note) => void
  isGridView?: boolean
  className?: string
}

/**
 * Example component showing how to use the search functionality
 * This can be used in folders, favorites, or any other screen that needs search
 */
export const SearchExample: React.FC<SearchExampleProps> = ({
  notes,
  onNotePress,
  isGridView = false,
  className
}) => {
  // Search functionality with debouncing
  const { query, debouncedQuery, setQuery, clearSearch, isSearching } = useSearch({
    debounceMs: 300,
    minLength: 0,
    onSearch: (searchQuery) => {
      console.log('Search performed:', searchQuery)
    }
  })

  // Filter notes based on search query
  const filteredNotes = React.useMemo(() => {
    if (!debouncedQuery.trim()) return notes
    return searchNotes(notes, debouncedQuery)
  }, [notes, debouncedQuery])

  return (
    <View className={`flex-1 ${className || ''}`}>
      {/* Search Bar */}
      <View className="px-4 pb-4">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes..."
          onClear={clearSearch}
          returnKeyType="search"
        />
      </View>

      {/* Search Status */}
      {isSearching && (
        <View className="px-4 pb-2">
          <Text className="text-muted-foreground text-sm">
            Searching...
          </Text>
        </View>
      )}

      {/* Results Count */}
      {debouncedQuery.trim() && (
        <View className="px-4 pb-2">
          <Text className="text-muted-foreground text-sm">
            {filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      {/* Notes List */}
      <ScrollView className="flex-1 px-4">
        <NotesList
          notes={filteredNotes}
          isGridView={isGridView}
          onNotePress={onNotePress}
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
    </View>
  )
}
