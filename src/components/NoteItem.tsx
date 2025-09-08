import { ActivityIndicator, Alert, Pressable, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { cva, type VariantProps } from 'class-variance-authority'
import { Text } from '@/components/ui/text'
import { SvgIcon } from '@/components/ui/svg-icon'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import React from 'react'
import { Skeleton } from './ui/skeleton'
import { HapticButton } from './ui/haptic-button'
import { ContextMenu, type ContextMenuAction } from './ui/context-menu'

const noteItemVariants = cva('bg-card rounded-lg border border-border', {
    variants: {
        variant: {
            list: 'p-2 px-3',
            grid: 'p-3 flex-1'
        }
    },
    defaultVariants: {
        variant: 'list'
    }
})

const noteIconVariants = cva('rounded-lg items-center justify-center', {
    variants: {
        variant: {
            list: 'w-10 h-10',
            grid: 'w-8 h-8'
        }
    },
    defaultVariants: {
        variant: 'list'
    }
})

export interface NoteItemProps extends VariantProps<typeof noteItemVariants> {
    note: Note
    onPress?: (note: Note) => void
    onDelete?: (noteId: string) => void
    onFavorite?: (noteId: string, favorite: boolean) => void
    onShare?: (noteId: string) => void
    onAddToCategory?: (noteId: string) => void
    className?: string
    gridColumns?: number
}

const getIconForNoteType = (type: string | null) => {
    switch (type) {
        case 'audio':
            return 'graphic-eq'
        case 'pdf':
            return 'picture-as-pdf'
        case 'youtube':
            return 'play-circle-outline'
        case 'image':
            return 'image'
        case 'website':
            return 'language'
        case 'meet':
        case 'zoom':
        case 'teams':
            return 'videocam'
        default:
            return 'graphic-eq'
    }
}

const getColorForNoteType = (type: string | null) => {
    switch (type) {
        case 'audio':
            return '#FF6B35'
        case 'pdf':
            return '#E53E3E'
        case 'youtube':
            return '#FF0000'
        case 'image':
            return '#805AD5'
        case 'website':
            return '#38A169'
        case 'meet':
        case 'zoom':
        case 'teams':
            return '#3182CE'
        default:
            return '#FF6B35'
    }
}

const renderNoteIcon = (type: string | null, size: number, color: string, status: string | null) => {

    if (status === 'running') {
        return <ActivityIndicator size="small" color={color} />
    }

    if (status === 'failed') {
        return <MaterialIcons name="error" size={size} color={'red'} />
    }

    // Use SVG icons for specific types
    if (type === 'youtube' || type === 'image' || type === 'pdf') {
        return <SvgIcon name={type as 'youtube' | 'image' | 'pdf'} size={size} color={color} />
    }

    // Use MaterialIcons for other types
    const iconName = getIconForNoteType(type) as any
    return <MaterialIcons name={iconName} size={size} color={color} />
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

export const NoteItem = React.forwardRef<
    React.ElementRef<typeof TouchableOpacity>,
    NoteItemProps
>(({ note, onPress, variant, className, gridColumns, onDelete, onFavorite, onShare, onAddToCategory, ...props }, ref) => {
    const displayDate = note.displayDate || formatDate(note.created_at)
    const displayTime = note.displayTime || formatTime(note.created_at)
    const iconColor = getColorForNoteType(note.type)

    const actions: ContextMenuAction[] = [
        {
            id: note.favorite ? 'remove-from-favorites' : 'add-to-favorites',
            title: note.favorite ? 'Remove from Favorites' : 'Add to Favorites',
            systemIcon: note.favorite ? 'heart.fill' : 'heart',
        },
        {
            id: 'share',
            title: 'Share',
            systemIcon: 'square.and.arrow.up',
        },
        {
            id: 'add-to-category',
            title: 'Add to Category',
            systemIcon: 'folder',
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
            case 'add-to-favorites':
                onFavorite?.(note.id, true)
                break;
            case 'remove-from-favorites':
                onFavorite?.(note.id, false)
                break;
            case 'share':
                onShare?.(note.id)
                break;
            case 'add-to-category':
                onAddToCategory?.(note.id)
                break;
            case 'delete':
                Alert.alert(
                    'Delete Note',
                    'Are you sure you want to delete this note?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                                onDelete?.(note.id)
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
                    onPress={() => onPress?.(note)}
                    className={cn(noteItemVariants({ variant }), className)}
                    {...props}
                >
                    <View className="gap-2">
                        <View className={cn(noteIconVariants({ variant }), "bg-muted")}>
                            {renderNoteIcon(note.type, 20, iconColor, note.status)}
                        </View>
                        <View className="gap-2">
                            <View className="justify-center">
                                <Text
                                    variant="small"
                                    className="font-semibold text-xs text-foreground text-start"
                                    numberOfLines={2}
                                >
                                    {
                                        note.status === 'running' ? <View className='gap-1 flex-col w-full'>
                                            <Skeleton className="w-full h-3" />
                                            <Skeleton className="w-full h-3" />
                                        </View> : note.status === 'failed' ? <View className='gap-1 flex-col w-full'>
                                            <Text
                                                variant="small"
                                                className="font-semibold text-xs text-foreground text-start"
                                                numberOfLines={2}
                                            >Something went wrong</Text>
                                        </View> : (
                                            note.title || 'Untitled Note'
                                        )
                                    }
                                </Text>
                            </View>
                            <View className="h-px bg-border" />
                        </View>

                        <View className="gap-1">
                            <Text className="text-muted-foreground text-xs">
                                {displayDate} {displayTime}
                            </Text>
                            {(note.tag || note.folder_name) && (
                                <View className="bg-muted px-2 py-1 rounded self-start">
                                    <Text className="text-muted-foreground text-">
                                        {note.tag || note.folder_name || note.type}
                                    </Text>
                                </View>
                            )}
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
                onPress={() => onPress?.(note)}
                className={cn(noteItemVariants({ variant }), className)}
                {...props}
            >
                <View className="flex-row items-center gap-3">
                    <View className={cn(noteIconVariants({ variant }), "bg-muted")}>
                        {renderNoteIcon(note.type, 20, iconColor, note.status)}
                    </View>

                    <View className="flex-1 flex-col gap-1">
                        <Text variant="small" className="font-semibold  text-foreground text-start" numberOfLines={1}>
                            {
                                note.status === 'running' ? <View className='gap-1 flex-col w-full'>
                                    <Skeleton className="w-full h-3" />
                                </View> : note.status === 'failed' ? <View className='gap-1 flex-col w-full'>
                                    <Text
                                        variant="small"
                                        className="font-semibold text-foreground text-start"
                                        numberOfLines={1}
                                    >Something went wrong</Text>
                                </View> : (
                                    note.title || 'Untitled Note'
                                )
                            }
                        </Text>

                        <View className="flex-row items-center gap-2">
                            <Text className="text-muted-foreground text-xs">
                                {displayDate} {displayTime}
                            </Text>
                            {(note.tag || note.folder_name) && (
                                <View className="bg-muted px-2 py-1 rounded">
                                    <Text className="text-muted-foreground text-xs">
                                        {note.tag || note.folder_name || note.type}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </HapticButton>
        </ContextMenu>
    )
})

