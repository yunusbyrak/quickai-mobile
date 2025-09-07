import { View } from 'react-native'
import React from 'react'
import { NoteItem } from './NoteItem'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'

export interface NotesListProps {
    notes: Note[]
    onNotePress?: (note: Note) => void
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

export const NotesList = React.forwardRef<
    React.ElementRef<typeof View>,
    NotesListProps
>(({ notes, onNotePress, isGridView = false, className, emptyState, ...props }, ref) => {
    if (notes.length === 0) {
        return (
            <View ref={ref} className={cn('flex-1', className)} {...props}>
                {emptyState || <DefaultEmptyState />}
            </View>
        )
    }

    const gridColumns = 3;

    if (isGridView) {
        return (
            <View ref={ref} className={cn('gap-2', className)} {...props}>
                {Array.from({ length: Math.ceil(notes.length / gridColumns) }, (_, rowIndex) => {
                    const startIndex = rowIndex * gridColumns
                    const endIndex = startIndex + gridColumns
                    const rowNotes = notes.slice(startIndex, endIndex)
                    const isLastRow = rowIndex === Math.ceil(notes.length / gridColumns) - 1
                    const remainingItems = notes.length % gridColumns

                    return (
                        <View key={rowIndex} className="flex-row gap-2">
                            {rowNotes.map((note) => (
                                <NoteItem
                                    className='bg-background border-primary/20'
                                    key={note.id}
                                    note={note}
                                    gridColumns={gridColumns}
                                    variant="grid"
                                    onPress={onNotePress}
                                />
                            ))}
                            {/* Add empty views to fill remaining space in incomplete rows */}
                            {isLastRow && remainingItems > 0 && remainingItems < gridColumns && (
                                Array.from({ length: gridColumns - remainingItems }, (_, index) => (
                                    <View key={`empty-${index}`} className="flex-1" />
                                ))
                            )}
                        </View>
                    )
                })}
            </View>
        )
    }

    return (
        <View ref={ref} className={cn(className)} {...props}>
            {notes.map((note) => (
                <NoteItem
                    className='bg-background border-primary/20'
                    key={note.id}
                    note={note}
                    variant="list"
                    onPress={onNotePress}
                />
            ))}
        </View>
    )
})

NotesList.displayName = 'NotesList'
