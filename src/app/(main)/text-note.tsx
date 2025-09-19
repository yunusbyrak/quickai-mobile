import { useEffect, useRef, useState, useCallback } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, TextInput, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { HapticButton } from "@/components";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/ThemeContext";
import * as Clipboard from 'expo-clipboard';


// Constants
const MAX_CHARACTERS = 100000;
const FOCUS_DELAY = 100;

// Types
interface TextNoteState {
    text: string;
    isLoading: boolean;
    error: string | null;
}

export default function TextNote() {
    const router = useRouter();
    const { isDark } = useTheme();
    const textareaRef = useRef<TextInput>(null);
    const [state, setState] = useState<TextNoteState>({
        text: "",
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        // Focus the textarea when component mounts and show keyboard
        const timer = setTimeout(() => {
            textareaRef.current?.focus();
        }, FOCUS_DELAY);

        return () => clearTimeout(timer);
    }, []);

    const handleTextChange = useCallback((newText: string) => {
        setState(prev => ({
            ...prev,
            text: newText,
            error: null,
        }));
    }, []);

    const handlePaste = useCallback(async () => {
        try {
            const clipboardContent = await Clipboard.getStringAsync();
            if (clipboardContent) {
                setState(prev => ({
                    ...prev,
                    text: prev.text + clipboardContent,
                    error: null,
                }));
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: "Failed to paste content",
            }));
        }
    }, []);

    const handleSave = useCallback(async () => {
        if (!state.text.trim()) {
            setState(prev => ({
                ...prev,
                error: "Please enter some text before saving",
            }));
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // TODO: Implement actual save functionality with notes service
            console.log("Saving text:", state.text);

            // Simulate save delay
            await new Promise(resolve => setTimeout(resolve, 500));

            router.back();
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: "Failed to save note. Please try again.",
            }));
        }
    }, [state.text, router]);

    const handleClear = useCallback(() => {
        setState(prev => ({
            ...prev,
            text: "",
            error: null,
        }));
    }, []);

    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal',
                    title: 'Text Note',
                    headerTransparent: true,
                    headerShown: true,
                    headerTintColor: isDark ? 'white' : 'black',
                    headerLeft: () => (
                        <HapticButton
                            onPress={() => router.back()}
                            className="items-center justify-center -ml-2"
                            hapticType="light"
                            accessibilityLabel="Go back"
                            accessibilityHint="Return to previous screen"
                        >
                            <Ionicons name="chevron-back-outline" size={24} color={isDark ? 'white' : 'black'} />
                        </HapticButton>
                    )
                }}
            />
            <SafeAreaView className="flex-1 bg-background">
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 50}
                >
                    <View className="flex-1 px-4">
                        {/* Main content area with textarea */}
                        <View className="flex-1 mb-4">
                            <Textarea
                                ref={textareaRef}
                                value={state.text}
                                onChangeText={handleTextChange}
                                placeholder="Start typing your note..."
                                className="flex-1 text-base border-0 bg-transparent px-0 py-0 text-foreground"
                                placeholderClassName="text-muted-foreground"
                                multiline
                                textAlignVertical="top"
                                maxLength={MAX_CHARACTERS}
                                autoFocus
                                autoCorrect={false}
                                spellCheck={false}
                                accessibilityLabel="Text input for note"
                                accessibilityHint="Enter your note text here"
                            />
                        </View>

                        {/* Error message */}
                        {state.error && (
                            <View className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <Text className="text-destructive text-sm">{state.error}</Text>
                            </View>
                        )}

                        {/* Bottom section with character count and action buttons */}
                        <View className="pb-10">
                            {/* Action buttons and character count row */}
                            <View className="flex-row items-center justify-between mb-4">
                                <HapticButton
                                    onPress={handlePaste}
                                    className="flex-row items-center px-3 py-2 bg-muted rounded-lg"
                                    hapticType="light"
                                    accessibilityLabel="Paste from clipboard"
                                    accessibilityHint="Paste text from your clipboard"
                                >
                                    <Ionicons
                                        name="document-outline"
                                        size={20}
                                        color={isDark ? '#9CA3AF' : '#6B7280'}
                                    />
                                    <Text className="text-muted-foreground ml-2 text-sm font-medium">Paste</Text>
                                </HapticButton>

                                <View className="flex-row items-center">
                                    <Text className="text-muted-foreground text-sm">
                                        {state.text.length} / {MAX_CHARACTERS}
                                    </Text>
                                    {state.text.length > 0 && (
                                        <HapticButton
                                            onPress={handleClear}
                                            className="ml-2 w-6 h-6 rounded-full border border-muted-foreground/30 items-center justify-center"
                                            hapticType="light"
                                            accessibilityLabel="Clear text"
                                            accessibilityHint="Clear all text from the input"
                                        >
                                            <Ionicons
                                                name="close"
                                                size={16}
                                                color={isDark ? '#9CA3AF' : '#6B7280'}
                                            />
                                        </HapticButton>
                                    )}
                                </View>
                            </View>

                            {/* Save button */}
                            <Button
                                onPress={handleSave}
                                disabled={state.isLoading || !state.text.trim()}
                                className="w-full h-12 bg-foreground hover:bg-foreground/80 active:bg-foreground/80"
                            >
                                <Text className="text-primary-foreground font-medium text-base">
                                    {state.isLoading ? "Saving..." : "Save"}
                                </Text>
                            </Button>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}
