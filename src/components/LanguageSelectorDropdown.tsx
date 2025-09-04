import React, { useState, useCallback, useMemo } from 'react';
import { View, Pressable, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Language } from './LanguageSelector';

export interface LanguageSelectorDropdownProps {
    languages: Language[];
    selectedLanguage?: string;
    onLanguageSelect: (languageCode: string) => void;
    onAutoSelect?: () => void;
    showAutoOption?: boolean;
    placeholder?: string;
    className?: string;
    maxHeight?: number;
}

export const LanguageSelectorDropdown = React.memo<LanguageSelectorDropdownProps>(({
    languages,
    selectedLanguage,
    onLanguageSelect,
    onAutoSelect,
    showAutoOption = true,
    placeholder = "Select language",
    className,
    maxHeight = 200
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLanguages = useMemo(() => {
        if (!searchQuery.trim()) return languages;

        return languages.filter(language =>
            language.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
            language.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [languages, searchQuery]);

    const handleLanguageSelect = useCallback((languageCode: string) => {
        onLanguageSelect(languageCode);
        setIsOpen(false);
        setSearchQuery('');
    }, [onLanguageSelect]);

    const handleAutoSelect = useCallback(() => {
        if (onAutoSelect) {
            onAutoSelect();
        }
        setIsOpen(false);
        setSearchQuery('');
    }, [onAutoSelect]);

    const getSelectedLanguageName = () => {
        if (selectedLanguage === 'auto') return 'Auto';
        const language = languages.find(lang => lang.code === selectedLanguage);
        return language?.language || placeholder;
    };

    const getSelectedLanguageFlag = () => {
        if (selectedLanguage === 'auto') return '🌐';
        const language = languages.find(lang => lang.code === selectedLanguage);
        return language?.flag || '🌐';
    };

    return (
        <View className={cn("relative", className)}>
            {/* Trigger Button */}
            <Pressable
                onPress={() => setIsOpen(!isOpen)}
                className="flex-row items-center gap-2 bg-card px-3 py-2 rounded-full border border-border"
            >
                <Text className="text-lg">{getSelectedLanguageFlag()}</Text>
                <Text className="text-sm font-medium text-foreground flex-1">
                    {getSelectedLanguageName()}
                </Text>
                <MaterialIcons
                    name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={16}
                    color="#9CA3AF"
                />
            </Pressable>

            {/* Dropdown */}
            {isOpen && (
                <View className="absolute top-12 right-0 bg-card border border-border rounded-lg shadow-lg min-w-48 z-50">
                    {/* Search Bar */}
                    <View className="p-2 border-b border-border">
                        <View className="flex-row items-center bg-muted rounded-md px-2 py-2">
                            <MaterialIcons name="search" size={16} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-2 text-foreground text-sm"
                                placeholder="Search..."
                                placeholderTextColor="#9CA3AF"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* Language List */}
                    <ScrollView
                        style={{ maxHeight }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Auto Option */}
                        {showAutoOption && (
                            <Pressable
                                onPress={handleAutoSelect}
                                className={cn(
                                    "flex-row items-center gap-2 px-3 py-2",
                                    selectedLanguage === 'auto' && "bg-accent"
                                )}
                            >
                                <View className="w-6 h-6 rounded-full bg-muted items-center justify-center">
                                    <MaterialIcons name="auto-fix-high" size={12} color="#9CA3AF" />
                                </View>
                                <Text className="text-sm text-foreground">Auto</Text>
                                {selectedLanguage === 'auto' && (
                                    <MaterialIcons name="check" size={16} color="#22C55E" />
                                )}
                            </Pressable>
                        )}

                        {/* Language Options */}
                        {filteredLanguages.map((language) => (
                            <Pressable
                                key={language.code}
                                onPress={() => handleLanguageSelect(language.code)}
                                className={cn(
                                    "flex-row items-center gap-2 px-3 py-2",
                                    selectedLanguage === language.code && "bg-accent"
                                )}
                            >
                                <Text className="text-lg">{language.flag}</Text>
                                <Text className="text-sm text-foreground flex-1">
                                    {language.language}
                                </Text>
                                {selectedLanguage === language.code && (
                                    <MaterialIcons name="check" size={16} color="#22C55E" />
                                )}
                            </Pressable>
                        ))}

                        {filteredLanguages.length === 0 && searchQuery && (
                            <View className="py-4 items-center">
                                <Text className="text-muted-foreground text-sm">
                                    No languages found
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
});
