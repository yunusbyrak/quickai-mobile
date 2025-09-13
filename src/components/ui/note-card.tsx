import React from 'react';
import { View, Pressable, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './text';
import { useTheme } from '@/context/ThemeContext';
import { HapticButton } from './haptic-button';

export type NoteCardType = 'transcription' | 'summary' | 'youtube' | 'audio';

export interface NoteCardProps {
    type: NoteCardType;
    title?: string;
    subtitle?: string;
    content: string;
    timestamp?: string;
    onPress?: () => void;
    onCopy?: () => void;
    thumbnail?: string;
    className?: string;
    numberOfLines?: number;
}

const getTypeConfig = (type: NoteCardType, isDark: boolean) => {
    switch (type) {
        case 'youtube':
            return {
                colors: isDark ? ['#f87171', '#ef4444', '#dc2626'] : ['#fff', '#fff', '#fff'],
                icon: 'logo-youtube' as const,
                iconColor: isDark ? '#f87171' : '#dc2626',
            };
        case 'summary':
            return {
                colors: isDark ? ['#059669', '#10b981', '#34d399'] : ['#d1fae5', '#a7f3d0', '#6ee7b7'],
                icon: 'document-text-outline' as const,
                iconColor: isDark ? '#34d399' : '#059669',
            };
        case 'audio':
            return {
                colors: isDark ? ['#7c3aed', '#8b5cf6', '#a78bfa'] : ['#ede9fe', '#ddd6fe', '#c4b5fd'],
                icon: 'musical-notes-outline' as const,
                iconColor: isDark ? '#a78bfa' : '#7c3aed',
            };
        case 'transcription':
        default:
            return {
                colors: isDark ? ['#1d4ed8', '#1e40af', '#1e3a8a'] : ['#93c5fd', '#bfdbfe', '#dbeafe'],
                icon: 'mic-outline' as const,
                iconColor: isDark ? '#60a5fa' : '#2563eb',
            };
    }
};

export function NoteCard({
    type,
    title,
    subtitle,
    content,
    timestamp,
    onPress,
    onCopy,
    className = '',
    numberOfLines = 5,
    thumbnail,
}: NoteCardProps) {
    const { isDark } = useTheme();
    const config = getTypeConfig(type, isDark);

    const CardContent = () => (
        <LinearGradient
            colors={config.colors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
            }}
        >
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                    <Ionicons
                        name={config.icon}
                        size={16}
                        color={config.iconColor}
                        style={{ marginRight: 8 }}
                    />
                    <View className="flex-1">
                        {title && (
                            <Text className="text-xs font-medium" numberOfLines={1}>
                                {title}
                            </Text>
                        )}
                        {subtitle && (
                            <Text className="text-xs opacity-70" numberOfLines={1}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center">
                    {timestamp && (
                        <Text className="text-xs mr-2">
                            {timestamp}
                        </Text>
                    )}
                    {onCopy && (
                        <Pressable
                            className="p-1"
                            onPress={(e) => {
                                e.stopPropagation();
                                onCopy();
                            }}
                        >
                            <Ionicons name="copy-outline" size={16} color={config.iconColor} />
                        </Pressable>
                    )}
                </View>
            </View>

            <View className="flex-row items-center">
                {thumbnail && <View className="mr-2 relative">
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-20 h-20 rounded-lg"
                    />
                    <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 rounded-lg" />
                </View>}

                <Text
                    className="text-black font-sans-serif text-xs font-light flex-1"
                    numberOfLines={numberOfLines}
                    style={{ lineHeight: 16 }}
                >
                    {content}
                </Text>
            </View>

            <HapticButton className="items-center mt-2 bg-muted-foreground/10 rounded-lg p-2">
                <Text className="text-black font-sans-serif text-xs font-light">View more</Text>
            </HapticButton>
        </LinearGradient>
    );

    if (onPress) {
        return (
            <Pressable onPress={onPress} className={className}>
                <CardContent />
            </Pressable>
        );
    }

    return (
        <View className={className}>
            <CardContent />
        </View>
    );
}
