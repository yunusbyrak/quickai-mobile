import { View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { FlashList } from '@shopify/flash-list'
import { NoteItem } from './NoteItem'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'

export interface NotesListProps {
    notes: Note[]
    onNotePress?: (note: Note) => void
    onNoteDelete?: (noteId: string) => void
    onNoteFavorite?: (noteId: string, favorite: boolean) => void
    onNoteShare?: (noteId: string) => void
    onNoteAddToCategory?: (noteId: string, remove: boolean) => void
    isGridView?: boolean
    className?: string
    emptyState?: React.ReactNode
}

const DefaultEmptyState = () => (
    <View className="flex-1 items-center justify-center py-8">
        <Text className="text-muted-foreground text-center text-lg">
            No notes found
        </Text>
        <Text className="text-muted-foreground text-center text-sm mt-1">
            Start by creating your first note
        </Text>
    </View>
)

// Grid row data type for FlashList
interface GridRowData {
    type: 'row'
    notes: Note[]
    rowIndex: number
    isLastRow: boolean
    remainingItems: number
}

// Helper function to create grid data
const createGridData = (notes: Note[], gridColumns: number): GridRowData[] => {
    const rows: GridRowData[] = []
    const totalRows = Math.ceil(notes.length / gridColumns)

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
        const startIndex = rowIndex * gridColumns
        const endIndex = startIndex + gridColumns
        const rowNotes = notes.slice(startIndex, endIndex)
        const isLastRow = rowIndex === totalRows - 1
        const remainingItems = notes.length % gridColumns

        rows.push({
            type: 'row',
            notes: rowNotes,
            rowIndex,
            isLastRow,
            remainingItems
        })
    }

    return rows
}

export const NotesList = React.forwardRef<
    React.ElementRef<typeof View>,
    NotesListProps
>(({ notes, onNotePress, onNoteDelete, onNoteFavorite, onNoteShare, onNoteAddToCategory, isGridView = false, className, emptyState, ...props }, ref) => {
    if (notes.length === 0) {
        return (
            <View ref={ref} className={cn('flex-1', className)} {...props}>
                {emptyState || <DefaultEmptyState />}
            </View>
        )
    }

    // TODO small screen should be 2 columns
    const gridColumns = 3;

    // Memoized grid data
    const gridData = useMemo(() => {
        return isGridView ? createGridData(notes, gridColumns) : []
    }, [notes, isGridView, gridColumns])

    // Memoized render function for grid rows
    const renderGridRow = useCallback(({ item }: { item: GridRowData }) => {
        return (
            <View className="flex-row mb-2">
                {item.notes.map((note, index) => (
                    <NoteItem
                        onDelete={onNoteDelete}
                        onFavorite={onNoteFavorite}
                        onShare={onNoteShare}
                        onAddToCategory={onNoteAddToCategory}
                        className={cn(
                            'bg-background border-primary/20',
                            index < item.notes.length - 1 ? 'mr-2' : '', // Add margin right except for last item
                            item.notes.length < gridColumns ? 'mr-2' : '' // Add margin right for incomplete rows
                        )}
                        key={note.id}
                        note={note}
                        gridColumns={gridColumns}
                        variant="grid"
                        onPress={onNotePress}
                    />
                ))}
                {/* Add empty views to fill remaining space in incomplete rows */}
                {item.isLastRow && item.remainingItems > 0 && item.remainingItems < gridColumns && (
                    Array.from({ length: gridColumns - item.remainingItems }, (_, index) => (
                        <View key={`empty-${index}`} className="flex-1" />
                    ))
                )}
            </View>
        )
    }, [onNotePress, gridColumns])

    // Memoized render function for list items
    const renderListItem = useCallback(({ item }: { item: Note }) => {
        return (
            <View className="mb-2">
                <NoteItem
                    className='bg-background border-primary/20'
                    key={item.id}
                    note={item}
                    variant="list"
                    onPress={onNotePress}
                    onDelete={onNoteDelete}
                    onFavorite={onNoteFavorite}
                    onShare={onNoteShare}
                    onAddToCategory={onNoteAddToCategory}
                />
            </View>
        )
    }, [onNotePress])

    // Memoized key extractors
    const gridKeyExtractor = useCallback((item: GridRowData) => `row-${item.rowIndex}`, [])
    const listKeyExtractor = useCallback((item: Note) => item.id, [])

    if (isGridView) {
        return (
            <View ref={ref} className={cn('flex-1', className)} {...props}>
                <FlashList
                    data={gridData}
                    renderItem={renderGridRow}
                    keyExtractor={gridKeyExtractor}
                    estimatedItemSize={130} // Estimated height for grid rows with spacing
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                />
            </View>
        )
    }

    return (
        <View ref={ref} className={cn('flex-1', className)} {...props}>
            <FlashList
                data={notes}
                renderItem={renderListItem}
                keyExtractor={listKeyExtractor}
                estimatedItemSize={90} // Estimated height for list items with spacing
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
            />
        </View>
    )
})

NotesList.displayName = 'NotesList'
