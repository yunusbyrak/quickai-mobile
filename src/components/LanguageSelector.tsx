import React, { useState, useCallback, useMemo } from 'react';
import { View, Pressable, TextInput, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/**
 * Language interface for the language selector components
 */
export interface Language {
    code: string;
    name: string;
    language: string;
    flag: string;
}

/**
 * Props for the LanguageSelector component
 */
export interface LanguageSelectorProps {
    /** Array of language objects to display */
    languages: Language[];
    /** Currently selected language code */
    selectedLanguage?: string;
    /** Callback when a language is selected */
    onLanguageSelect: (languageCode: string) => void;
    /** Callback when auto language detection is selected */
    onAutoSelect?: () => void;
    /** Whether to show the auto language detection option */
    showAutoOption?: boolean;
    /** Whether the modal is visible */
    isVisible: boolean;
    /** Callback to close the modal */
    onClose: () => void;
    /** Title to display at the top of the modal */
    title?: string;
    /** Placeholder text for the search input */
    searchPlaceholder?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * A reusable language selector component that displays as a modal
 * with search functionality and auto language detection option.
 *
 * @example
 * ```tsx
 * const [isVisible, setIsVisible] = useState(false);
 * const [selectedLanguage, setSelectedLanguage] = useState('en');
 *
 * <LanguageSelector
 *   languages={languages}
 *   selectedLanguage={selectedLanguage}
 *   onLanguageSelect={(code) => setSelectedLanguage(code)}
 *   isVisible={isVisible}
 *   onClose={() => setIsVisible(false)}
 * />
 * ```
 */
export const LanguageSelector = React.memo<LanguageSelectorProps>(({
    languages,
    selectedLanguage,
    onLanguageSelect,
    onAutoSelect,
    showAutoOption = true,
    isVisible,
    onClose,
    title = "Language",
    searchPlaceholder = "Search language",
    className
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLanguages = useMemo(() => {
        if (!searchQuery.trim()) return languages;

        return languages.filter(language =>
            language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            language.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [languages, searchQuery]);

    const handleLanguageSelect = useCallback((languageCode: string) => {
        onLanguageSelect(languageCode);
        onClose();
    }, [onLanguageSelect, onClose]);

    const handleAutoSelect = useCallback(() => {
        if (onAutoSelect) {
            onAutoSelect();
        }
        onClose();
    }, [onAutoSelect, onClose]);

    const handleSearchChange = useCallback((text: string) => {
        setSearchQuery(text);
    }, []);

    const handleClose = useCallback(() => {
        setSearchQuery('');
        onClose();
    }, [onClose]);

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-background">
                {/* Handle */}
                <View className="items-center pt-2 pb-1">
                    <View className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                </View>

                {/* Header */}
                <View className="px-6 pb-4">
                    <Text className="text-2xl font-bold text-foreground text-center">
                        {title}
                    </Text>
                </View>

                {/* Search Bar */}
                <View className="px-6 pb-4">
                    <View className="flex-row items-center bg-muted rounded-lg px-3 py-3">
                        <MaterialIcons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-3 text-foreground text-base"
                            placeholder={searchPlaceholder}
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                        />
                    </View>
                </View>

                {/* Language List */}
                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Auto Option */}
                    {showAutoOption && (
                        <Pressable
                            onPress={handleAutoSelect}
                            className="flex-row items-center justify-between py-4 px-2"
                        >
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-3">
                                    <MaterialIcons name="auto-fix-high" size={16} color="#9CA3AF" />
                                </View>
                                <Text className="text-base text-foreground font-medium">
                                    Auto
                                </Text>
                            </View>
                            {selectedLanguage === 'auto' && (
                                <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
                                    <MaterialIcons name="check" size={16} color="white" />
                                </View>
                            )}
                        </Pressable>
                    )}

                    <View className='bg-card rounded-lg'>
                        {/* Language Options */}
                        {filteredLanguages.map((language) => (
                            <Pressable
                                key={language.code}
                                onPress={() => handleLanguageSelect(language.code)}
                                className="flex-row items-center justify-between py-4 px-4 border-b border-border/90"
                            >
                                <View className="flex-row items-center">
                                    <Text className="text-2xl mr-3">
                                        {language.flag}
                                    </Text>
                                    <Text className="text-base text-foreground font-medium">
                                        {language.language}
                                    </Text>
                                </View>
                                {selectedLanguage === language.code && (
                                    <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
                                        <MaterialIcons name="check" size={16} color="white" />
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>

                    {filteredLanguages.length === 0 && searchQuery && (
                        <View className="py-8 items-center">
                            <Text className="text-muted-foreground text-base">
                                No languages found
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
});
