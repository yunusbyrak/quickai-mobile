import { View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { FlashList } from '@shopify/flash-list'
import { FolderItem } from './FolderItem'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import type { Folder } from '@/types/folder'

export interface FolderListProps {
    folders: Folder[]
    onFolderPress?: (folder: Folder) => void
    onFolderDelete?: (folderId: string) => void
    onFolderEdit?: (folderId: string) => void
    isGridView?: boolean
    className?: string
    emptyState?: React.ReactNode
}

const DefaultEmptyState = () => (
    <View className="flex-1 items-center justify-center py-8">
        <Text className="text-muted-foreground text-center text-lg">
            No folders found
        </Text>
        <Text className="text-muted-foreground text-center text-sm mt-1">
            Create your first folder to organize your notes
        </Text>
    </View>
)

// Grid row data type for FlashList
interface GridRowData {
    type: 'row'
    folders: Folder[]
    rowIndex: number
    isLastRow: boolean
    remainingItems: number
}

// Helper function to create grid data
const createGridData = (folders: Folder[], gridColumns: number): GridRowData[] => {
    const rows: GridRowData[] = []
    const totalRows = Math.ceil(folders.length / gridColumns)

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
        const startIndex = rowIndex * gridColumns
        const endIndex = startIndex + gridColumns
        const rowFolders = folders.slice(startIndex, endIndex)
        const isLastRow = rowIndex === totalRows - 1
        const remainingItems = folders.length % gridColumns

        rows.push({
            type: 'row',
            folders: rowFolders,
            rowIndex,
            isLastRow,
            remainingItems
        })
    }

    return rows
}

export const FolderList = React.forwardRef<
    React.ElementRef<typeof View>,
    FolderListProps
>(({ folders, onFolderPress, onFolderDelete, onFolderEdit, isGridView = false, className, emptyState, ...props }, ref) => {
    if (folders.length === 0) {
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
        return isGridView ? createGridData(folders, gridColumns) : []
    }, [folders, isGridView, gridColumns])

    // Memoized render function for grid rows
    const renderGridRow = useCallback(({ item }: { item: GridRowData }) => {
        return (
            <View className="flex-row mb-2">
                {item.folders.map((folder, index) => (
                    <FolderItem
                        onDelete={onFolderDelete}
                        onEdit={onFolderEdit}
                        className={cn(
                            'bg-background border-primary/20',
                            index < item.folders.length - 1 ? 'mr-2' : '', // Add margin right except for last item
                            item.folders.length < gridColumns ? 'mr-2' : '' // Add margin right for incomplete rows
                        )}
                        key={folder.id}
                        folder={folder}
                        gridColumns={gridColumns}
                        variant="grid"
                        onPress={onFolderPress}
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
    }, [onFolderPress, gridColumns, onFolderDelete, onFolderEdit])

    // Memoized render function for list items
    const renderListItem = useCallback(({ item }: { item: Folder }) => {
        return (
            <View className="mb-2">
                <FolderItem
                    className='bg-background border-primary/20'
                    key={item.id}
                    folder={item}
                    variant="list"
                    onPress={onFolderPress}
                    onDelete={onFolderDelete}
                    onEdit={onFolderEdit}
                />
            </View>
        )
    }, [onFolderPress, onFolderDelete, onFolderEdit])

    // Memoized key extractors
    const gridKeyExtractor = useCallback((item: GridRowData) => `row-${item.rowIndex}`, [])
    const listKeyExtractor = useCallback((item: Folder) => item.id, [])

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
                data={folders}
                renderItem={renderListItem}
                keyExtractor={listKeyExtractor}
                estimatedItemSize={90} // Estimated height for list items with spacing
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
            />
        </View>
    )
})

FolderList.displayName = 'FolderList'
