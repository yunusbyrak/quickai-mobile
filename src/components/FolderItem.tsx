import { Alert, TouchableOpacity, View, Image } from 'react-native'
import { cva, type VariantProps } from 'class-variance-authority'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import type { Folder } from '@/types/folder'
import React from 'react'
import { HapticButton } from './ui/haptic-button'
import { ContextMenu, type ContextMenuAction } from './ui/context-menu'

const folderItemVariants = cva('bg-card rounded-lg border border-border', {
    variants: {
        variant: {
            list: 'p-3',
            grid: 'p-4 flex-1'
        }
    },
    defaultVariants: {
        variant: 'list'
    }
})

const folderIconVariants = cva('rounded-lg items-center justify-center', {
    variants: {
        variant: {
            list: 'w-12 h-12',
            grid: 'w-16 h-16'
        }
    },
    defaultVariants: {
        variant: 'list'
    }
})

export interface FolderItemProps extends VariantProps<typeof folderItemVariants> {
    folder: Folder
    onPress?: (folder: Folder) => void
    onDelete?: (folderId: string) => void
    onEdit?: (folderId: string) => void
    className?: string
    gridColumns?: number
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
        return 'Today'
    } else if (days === 1) {
        return 'Yesterday'
    } else if (days < 7) {
        return `${days} days ago`
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }
}

const formatTime = (dateString: string | null): string => {
    if (!dateString) return ''

    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const FolderItem = React.forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    FolderItemProps
>(({ folder, onPress, variant, className, gridColumns, onDelete, onEdit, ...props }, ref) => {
    const displayDate = folder.displayDate || formatDate(folder.created_at)
    const displayTime = folder.displayTime || formatTime(folder.created_at)

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
                onEdit?.(folder.id)
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
                                onDelete?.(folder.id)
                            },
                        },
                    ],
                    { cancelable: true }
                );
                break;
        }
    }

    if (variant === 'grid') {
        return (
            <ContextMenu
                previewBackgroundColor='transparent'
                actions={actions}
                style={{ flex: 1 }}
                onActionPress={onContextMenuActionPress}
            >
                <HapticButton
                    hapticType="medium"
                    ref={ref}
                    onPress={() => onPress?.(folder)}
                    className={cn(folderItemVariants({ variant }), className)}
                    {...props}
                >
                    <View className="items-center gap-3">
                        <View className={cn(folderIconVariants({ variant }))}>
                            <Image
                                source={require('~/assets/images/folder.png')}
                                style={{ width: 78, height: 78 }}
                                resizeMode="contain"
                            />
                        </View>

                        <View className="items-center gap-1 w-full">
                            <Text
                                variant="small"
                                className="font-semibold text-sm text-foreground text-center"
                                numberOfLines={2}
                            >
                                {folder.title || 'Untitled Folder'}
                            </Text>
                            <Text className="text-muted-foreground text-xs text-center">
                                {folder.count} {folder.count === 1 ? 'item' : 'items'}
                            </Text>
                        </View>
                    </View>
                </HapticButton>
            </ContextMenu>
        )
    }

    return (
        <ContextMenu
            style={{ flex: 1 }}
            actions={actions}
            onActionPress={onContextMenuActionPress}
        >
            <HapticButton
                hapticType="medium"
                ref={ref}
                onPress={() => onPress?.(folder)}
                className={cn(folderItemVariants({ variant }), className)}
                {...props}
            >
                <View className="flex-row items-center gap-3">
                    <View className={cn(folderIconVariants({ variant }))}>
                        <Image
                            source={require('~/assets/images/folder.png')}
                            style={{ width: 56, height: 56 }}
                            resizeMode="contain"
                        />
                    </View>

                    <View className="flex-1 flex-col gap-1">
                        <Text variant="small" className="font-semibold text-foreground text-start" numberOfLines={1}>
                            {folder.title || 'Untitled Folder'}
                        </Text>

                        <Text className="text-muted-foreground text-xs">
                            {folder.count} {folder.count === 1 ? 'item' : 'items'}
                        </Text>
                    </View>
                </View>
            </HapticButton>
        </ContextMenu>
    )
})

FolderItem.displayName = 'FolderItem'
