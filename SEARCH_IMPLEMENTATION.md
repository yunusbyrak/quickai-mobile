# Search Implementation Guide

This document explains the search functionality implementation in the QuickAI app, including components, hooks, and utilities.

## Overview

The search functionality is implemented with the following key features:
- **Debounced search** to prevent excessive API calls
- **Reusable components** for consistent UI across the app
- **Flexible search utilities** for different search scenarios
- **TypeScript support** with proper type definitions

## Components

### SearchBar Component

A reusable search input component with built-in debouncing and clear functionality.

**Location:** `src/components/ui/search-bar.tsx`

**Features:**
- Debounced input handling
- Clear button when text is present
- Customizable styling with variants
- Accessibility support
- Platform-consistent behavior

**Usage:**
```tsx
import { SearchBar } from '@/components'

<SearchBar
  value={query}
  onChangeText={setQuery}
  placeholder="Search notes..."
  onClear={clearSearch}
  returnKeyType="search"
/>
```

**Props:**
- `value`: Current search query
- `onChangeText`: Callback when text changes
- `placeholder`: Placeholder text
- `onClear`: Callback when clear button is pressed
- `showClearButton`: Whether to show clear button (default: true)
- `size`: Component size variant ('default', 'sm', 'lg')
- `className`: Additional CSS classes
- `autoFocus`: Whether to auto-focus on mount
- `returnKeyType`: Keyboard return key type

## Hooks

### useSearch Hook

A custom hook that provides debounced search functionality.

**Location:** `src/hooks/useSearch.ts`

**Features:**
- Configurable debounce delay
- Minimum search length requirement
- Search state management
- Callback support for search events

**Usage:**
```tsx
import { useSearch } from '@/hooks/useSearch'

const { query, debouncedQuery, setQuery, clearSearch, isSearching } = useSearch({
  debounceMs: 300,
  minLength: 0,
  onSearch: (searchQuery) => {
    console.log('Search performed:', searchQuery)
  }
})
```

**Options:**
- `debounceMs`: Debounce delay in milliseconds (default: 300)
- `minLength`: Minimum query length before searching (default: 0)
- `onSearch`: Callback when search is performed

**Returns:**
- `query`: Current input value
- `debouncedQuery`: Debounced search query
- `setQuery`: Function to update query
- `clearSearch`: Function to clear search
- `isSearching`: Boolean indicating if search is in progress

## Utilities

### Search Utilities

Utility functions for filtering and searching notes.

**Location:** `src/utils/search.ts`

**Functions:**

#### `searchNotes(notes, query, options)`
Search through an array of notes.

```tsx
import { searchNotes } from '@/utils/search'

const filteredNotes = searchNotes(notes, query, {
  caseSensitive: false,
  exactMatch: false,
  searchFields: ['title', 'content', 'tag']
})
```

#### `searchNote(note, query, options)`
Search through a single note.

```tsx
import { searchNote } from '@/utils/search'

const matches = searchNote(note, query, {
  caseSensitive: false,
  exactMatch: false
})
```

#### `advancedSearch(notes, query, options)`
Advanced search with multiple terms (AND logic).

```tsx
import { advancedSearch } from '@/utils/search'

const results = advancedSearch(notes, 'audio meeting', {
  caseSensitive: false
})
```

#### `getSearchSuggestions(notes, query, maxSuggestions)`
Get search suggestions based on existing notes.

```tsx
import { getSearchSuggestions } from '@/utils/search'

const suggestions = getSearchSuggestions(notes, 'aud', 5)
```

**Search Options:**
- `caseSensitive`: Whether search should be case sensitive (default: false)
- `exactMatch`: Whether to match exact text (default: false)
- `searchFields`: Array of fields to search in (default: ['title', 'content', 'tag', 'folder_name', 'type'])

## Implementation Examples

### Basic Search Implementation

```tsx
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { SearchBar, NotesList } from '@/components'
import { useSearch } from '@/hooks/useSearch'
import { searchNotes } from '@/utils/search'
import type { Note } from '@/types/note'

interface SearchableNotesProps {
  notes: Note[]
  onNotePress?: (note: Note) => void
}

export const SearchableNotes: React.FC<SearchableNotesProps> = ({
  notes,
  onNotePress
}) => {
  const { query, debouncedQuery, setQuery, clearSearch } = useSearch({
    debounceMs: 300,
    minLength: 0
  })

  const filteredNotes = useMemo(() => {
    if (!debouncedQuery.trim()) return notes
    return searchNotes(notes, debouncedQuery)
  }, [notes, debouncedQuery])

  return (
    <View className="flex-1">
      <View className="px-4 pb-4">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes..."
          onClear={clearSearch}
        />
      </View>

      <NotesList
        notes={filteredNotes}
        onNotePress={onNotePress}
        emptyState={
          debouncedQuery.trim() ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-muted-foreground text-center text-lg">
                No notes found for "{debouncedQuery}"
              </Text>
            </View>
          ) : undefined
        }
      />
    </View>
  )
}
```

### Folder Search Implementation

```tsx
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { SearchBar, NotesList } from '@/components'
import { useSearch } from '@/hooks/useSearch'
import { searchNotes } from '@/utils/search'
import { useNotes } from '@/hooks/useNotes'
import type { Note } from '@/types/note'

interface FolderSearchProps {
  folderId: string
  onNotePress?: (note: Note) => void
}

export const FolderSearch: React.FC<FolderSearchProps> = ({
  folderId,
  onNotePress
}) => {
  const { notes } = useNotes({ folderId })

  const { query, debouncedQuery, setQuery, clearSearch } = useSearch({
    debounceMs: 300,
    minLength: 0
  })

  const filteredNotes = useMemo(() => {
    if (!debouncedQuery.trim()) return notes
    return searchNotes(notes, debouncedQuery, {
      searchFields: ['title', 'content', 'tag', 'type']
    })
  }, [notes, debouncedQuery])

  return (
    <View className="flex-1">
      <View className="px-4 pb-4">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search in folder..."
          onClear={clearSearch}
        />
      </View>

      <NotesList
        notes={filteredNotes}
        onNotePress={onNotePress}
      />
    </View>
  )
}
```

## Best Practices

### Performance
1. **Use debouncing** to prevent excessive filtering operations
2. **Memoize filtered results** to avoid unnecessary re-computations
3. **Set appropriate minimum search length** to avoid searching on single characters
4. **Use useMemo** for expensive filtering operations

### User Experience
1. **Provide clear feedback** when searching (loading states, result counts)
2. **Show appropriate empty states** for no results
3. **Allow easy clearing** of search queries
4. **Use consistent placeholders** across the app

### Accessibility
1. **Provide proper accessibility labels** for search inputs
2. **Support keyboard navigation** and screen readers
3. **Use semantic HTML elements** where applicable

### Code Organization
1. **Extract search logic** into reusable hooks
2. **Create consistent search components** across the app
3. **Use TypeScript** for type safety
4. **Follow the established patterns** in the codebase

## Future Enhancements

1. **Search history** - Remember recent searches
2. **Search suggestions** - Auto-complete based on existing content
3. **Advanced filters** - Date ranges, note types, etc.
4. **Search highlighting** - Highlight matching terms in results
5. **Global search** - Search across all notes and folders
6. **Search analytics** - Track popular search terms

## Testing

When testing the search functionality:

1. **Test debouncing** - Ensure search doesn't fire on every keystroke
2. **Test edge cases** - Empty queries, special characters, long queries
3. **Test performance** - Large datasets, rapid typing
4. **Test accessibility** - Screen readers, keyboard navigation
5. **Test different note types** - Audio, PDF, YouTube, etc.

## Troubleshooting

### Common Issues

1. **Search not working**: Check if debouncedQuery is being used instead of query
2. **Performance issues**: Ensure filtering is memoized and debounced
3. **Type errors**: Make sure Note type includes all searchable fields
4. **UI not updating**: Check if filteredNotes is being passed to components

### Debug Tips

1. Add console.log to useSearch hook to track search state
2. Use React DevTools to monitor re-renders
3. Check if search utilities are returning expected results
4. Verify that search fields exist in the Note type
