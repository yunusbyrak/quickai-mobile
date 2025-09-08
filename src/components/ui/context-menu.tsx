/**
 * ContextMenu Component
 *
 * A reusable context menu component built on top of react-native-context-menu-view.
 * Provides a better API with proper TypeScript support and action-based event handling.
 *
 * @example
 * ```tsx
 * const actions: ContextMenuAction[] = [
 *   {
 *     id: 'edit',
 *     title: 'Edit',
 *     systemIcon: 'pencil',
 *   },
 *   {
 *     id: 'share',
 *     title: 'Share',
 *     systemIcon: 'square.and.arrow.up',
 *   },
 *   {
 *     id: 'color-options',
 *     title: 'Change Color',
 *     systemIcon: 'paintbrush',
 *     inlineChildren: true,
 *     actions: [
 *       { id: 'color-blue', title: 'Blue', systemIcon: 'paintbrush' },
 *       { id: 'color-red', title: 'Red', systemIcon: 'paintbrush' },
 *     ],
 *   },
 *   {
 *     id: 'delete',
 *     title: 'Delete',
 *     systemIcon: 'trash',
 *     destructive: true,
 *   },
 * ];
 *
 * <ContextMenu
 *   title="Options"
 *   actions={actions}
 *   onActionPress={(actionId, action) => {
 *     switch (actionId) {
 *       case 'edit':
 *         // Handle edit
 *         break;
 *       case 'delete':
 *         // Handle delete
 *         break;
 *       // Handle other actions...
 *     }
 *   }}
 * >
 *   <View className="bg-blue-500 p-4 rounded">
 *     <Text className="text-white">Long press me</Text>
 *   </View>
 * </ContextMenu>
 * ```
 */

import React from 'react';
import { Platform, processColor, StyleProp, ViewStyle } from 'react-native';
import ContextMenu from 'react-native-context-menu-view';

/**
 * Represents a single action in the context menu
 */
export interface ContextMenuAction {
    /** Unique identifier for the action */
    id: string;
    /** Display title of the action */
    title: string;
    /** System icon name (iOS/Android) */
    systemIcon?: string;
    /** Custom icon name */
    customIcon?: string;
    /** Custom icon color */
    customIconColor?: string | number;
    /** Icon name for Android */
    icon?: string;
    /** Icon color for Android */
    iconColor?: string;
    /** Whether the action is destructive (red color) */
    destructive?: boolean;
    /** Whether the action is disabled */
    disabled?: boolean;
    /** Whether to show nested actions inline */
    inlineChildren?: boolean;
    /** Nested actions for submenu */
    actions?: ContextMenuAction[];
}

/**
 * Props for the ContextMenu component
 */
export interface ContextMenuProps {
    /** Child components to wrap with context menu */
    children: React.ReactNode;
    /** Array of actions to display in the context menu */
    actions: ContextMenuAction[];
    /** Styles for the context menu */
    style?: StyleProp<ViewStyle>;
    /** Title of the context menu */
    title?: string;
    /** Whether to show as dropdown menu */
    dropdownMenuMode?: boolean;
    /** Background color for preview */
    previewBackgroundColor?: string;
    /** Custom preview component */
    preview?: React.ReactNode;
    /** Callback when an action is pressed */
    onActionPress?: (actionId: string, action: ContextMenuAction) => void;
    /** Callback when preview is pressed */
    onPreviewPress?: () => void;
    /** Callback when context menu is cancelled */
    onCancel?: () => void;
}

// TODO Add haptics to the context menu when it's opened
function ContextMenuComponent({
    children,
    actions,
    style,
    title,
    dropdownMenuMode = false,
    previewBackgroundColor = 'transparent',
    preview,
    onActionPress,
    onPreviewPress,
    onCancel,
}: ContextMenuProps) {
    // Transform actions to the format expected by react-native-context-menu-view
    const transformedActions = actions.map((action) => {
        const transformedAction: any = {
            title: action.title,
        };

        // Handle system icons
        if (action.systemIcon) {
            transformedAction.systemIcon = action.systemIcon;
        }

        // Handle custom icons with platform-specific properties
        if (action.customIcon) {
            if (Platform.OS === 'ios') {
                transformedAction.customIcon = action.customIcon;
                if (action.customIconColor) {
                    transformedAction.customIconColor = processColor(action.customIconColor);
                }
            } else {
                transformedAction.icon = action.customIcon;
                if (action.customIconColor) {
                    transformedAction.iconColor = action.customIconColor;
                }
            }
        }

        // Handle other properties
        if (action.destructive) {
            transformedAction.destructive = action.destructive;
        }

        if (action.disabled) {
            transformedAction.disabled = action.disabled;
        }

        if (action.inlineChildren) {
            transformedAction.inlineChildren = action.inlineChildren;
        }

        // Handle nested actions
        if (action.actions && action.actions.length > 0) {
            transformedAction.actions = action.actions.map((nestedAction) => ({
                title: nestedAction.title,
                systemIcon: nestedAction.systemIcon,
                customIcon: nestedAction.customIcon,
                customIconColor: nestedAction.customIconColor
                    ? processColor(nestedAction.customIconColor)
                    : undefined,
                icon: nestedAction.icon,
                iconColor: nestedAction.iconColor,
                destructive: nestedAction.destructive,
                disabled: nestedAction.disabled,
            }));
        }

        return transformedAction;
    });

    const handlePress = (event: any) => {
        const { index, indexPath, name } = event.nativeEvent;

        // Find the action that was pressed
        let targetAction: ContextMenuAction | null = null;

        if (indexPath && indexPath.length > 1) {
            // Handle nested actions
            const parentIndex = indexPath[0];
            const childIndex = indexPath[1];
            const parentAction = actions[parentIndex];

            if (parentAction?.actions && parentAction.actions[childIndex]) {
                targetAction = parentAction.actions[childIndex];
            }
        } else {
            // Handle top-level actions
            targetAction = actions[index];
        }

        if (targetAction && onActionPress) {
            onActionPress(targetAction.id, targetAction);
        }
    };

    return (
        <ContextMenu
            title={title}
            actions={transformedActions}
            style={style}
            dropdownMenuMode={dropdownMenuMode}
            previewBackgroundColor={previewBackgroundColor}
            preview={preview}
            onPress={handlePress}
            onPreviewPress={onPreviewPress}
            onCancel={onCancel}
        >
            {children}
        </ContextMenu>
    );
}

export { ContextMenuComponent as ContextMenu };
