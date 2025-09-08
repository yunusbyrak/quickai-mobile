import React from 'react';
import { View, Pressable, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
    return (
        <View className={cn("mb-6", className)}>
            <Text className="text-foreground text-lg font-poppins-semibold mb-3 px-4">
                {title}
            </Text>
            <View className="bg-card rounded-2xl mx-4 overflow-hidden">
                {children}
            </View>
        </View>
    );
}

interface SettingsItemProps {
    icon?: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap;
    iconLibrary?: 'MaterialIcons' | 'Ionicons';
    title: string;
    subtitle?: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export function SettingsItem({
    icon,
    iconLibrary = 'MaterialIcons',
    title,
    subtitle,
    value,
    onPress,
    showChevron = true,
    isFirst = false,
    isLast = false,
    leftElement,
    rightElement,
}: SettingsItemProps) {
    const IconComponent = iconLibrary === 'MaterialIcons' ? MaterialIcons : Ionicons;

    return (
        <TouchableOpacity
            onPress={onPress}
            className={cn(
                "px-4 py-4 flex-row items-center gap-3 bg-card",
                !isLast && "border-b border-border/90",
                onPress && "active:bg-muted/30"
            )}
            disabled={!onPress}
        >
            {/* Left Icon or Element */}
            {leftElement || (icon && (
                <View className="w-8 h-8 items-center justify-center">
                    <IconComponent
                        name={icon as any}
                        size={20}
                        color="#666"
                    />
                </View>
            ))}

            {/* Content */}
            <View className="flex-1">
                <Text className="text-foreground text-base font-poppins-medium">
                    {title}
                </Text>
                {subtitle && (
                    <Text className="text-muted-foreground text-sm font-poppins">
                        {subtitle}
                    </Text>
                )}
            </View>

            {/* Right Content */}
            {rightElement || (
                <View className="flex-row items-center gap-2">
                    {value && (
                        <Text className="text-muted-foreground text-sm font-poppins">
                            {value}
                        </Text>
                    )}
                    {showChevron && onPress && (
                        <MaterialIcons
                            name="chevron-right"
                            size={20}
                            color="#666"
                        />
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}
