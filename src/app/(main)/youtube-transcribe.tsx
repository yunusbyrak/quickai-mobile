import { HapticButton } from "@/components";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/context/ThemeContext";
import { getYouTubeVideoId } from "@/utils/functions";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { router, Stack } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TextInput, View, Image } from "react-native";
import { getYoutubeMeta, YoutubeMeta } from "react-native-youtube-iframe";

interface YoutubeUrlInput {
    id: string;
    url: string;
    meta: YoutubeMeta | null;
    isLoading: boolean;
    error: string | null;
}

export default function YoutubeTranscribe() {
    const { isDark } = useTheme();
    const [urlInputs, setUrlInputs] = useState<YoutubeUrlInput[]>([
        { id: '1', url: '', meta: null, isLoading: false, error: null }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const firstInputRef = useRef<TextInput>(null);

    // Auto-focus first input when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            firstInputRef.current?.focus();
        }, 500); // Small delay to ensure component is fully mounted

        return () => clearTimeout(timer);
    }, []);

    // Keyboard event listeners
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardWillShowListener?.remove();
            keyboardWillHideListener?.remove();
        };
    }, []);

    const fetchVideoMeta = useCallback(async (url: string, inputId: string) => {
        const videoId = getYouTubeVideoId(url);
        if (!videoId) {
            setUrlInputs(prev => prev.map(input =>
                input.id === inputId
                    ? { ...input, error: 'Invalid YouTube URL', isLoading: false }
                    : input
            ));
            return;
        }

        setUrlInputs(prev => prev.map(input =>
            input.id === inputId
                ? { ...input, isLoading: true, error: null }
                : input
        ));

        try {
            const meta = await getYoutubeMeta(videoId);
            setUrlInputs(prev => prev.map(input =>
                input.id === inputId
                    ? { ...input, meta, isLoading: false, error: null }
                    : input
            ));
        } catch (error) {
            setUrlInputs(prev => prev.map(input =>
                input.id === inputId
                    ? { ...input, error: 'Failed to fetch video info', isLoading: false }
                    : input
            ));
        }
    }, []);

    const handleUrlChange = useCallback((text: string, inputId: string) => {
        setUrlInputs(prev => prev.map(input =>
            input.id === inputId
                ? { ...input, url: text, meta: null, error: null }
                : input
        ));

        // Auto-fetch meta when URL looks complete
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
            const videoId = getYouTubeVideoId(text);
            if (videoId) {
                fetchVideoMeta(text, inputId);
            }
        }
    }, [fetchVideoMeta]);

    const addUrlInput = useCallback(() => {
        const newId = (urlInputs.length + 1).toString();
        setUrlInputs(prev => [...prev, {
            id: newId,
            url: '',
            meta: null,
            isLoading: false,
            error: null
        }]);
    }, [urlInputs.length]);

    const removeUrlInput = useCallback((inputId: string) => {
        if (urlInputs.length > 1) {
            setUrlInputs(prev => prev.filter(input => input.id !== inputId));
        }
    }, [urlInputs.length]);

    const handleSubmit = useCallback(async () => {
        const validUrls = urlInputs.filter(input => input.url.trim() && input.meta);

        if (validUrls.length === 0) {
            Alert.alert('Error', 'Please add at least one valid YouTube URL');
            return;
        }

        setIsProcessing(true);

        try {
            // Here you would implement the transcription logic
            // For now, just simulate processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Success',
                `Processing ${validUrls.length} video${validUrls.length > 1 ? 's' : ''} for transcription`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to process videos');
        } finally {
            setIsProcessing(false);
        }
    }, [urlInputs, router]);

    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal',
                    title: 'YouTube Link',
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
            <SafeAreaView className="flex-1 bg-muted">
                <View className="flex-1">
                    <ScrollView
                        className="flex-1 px-4"
                        contentContainerStyle={{
                            paddingTop: 20,
                            paddingBottom: keyboardHeight > 0 ? 100 : 20
                        }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="gap-6">

                            <View className="gap-4">
                                {urlInputs.map((input, index) => (
                                    <View key={input.id} className="gap-3">
                                        <View className="flex-row gap-2 items-start">
                                            <View className="flex-1">
                                                <View className="flex-row items-center gap-2">
                                                    <View className="flex-1">
                                                        <TextInput
                                                            ref={input.id === '1' ? firstInputRef : null}
                                                            placeholder="https://www.youtube.com/watch..."
                                                            value={input.url}
                                                            onChangeText={(text) => handleUrlChange(text, input.id)}
                                                            style={{
                                                                backgroundColor: 'white',
                                                                borderRadius: 12,
                                                                paddingHorizontal: 12,
                                                                paddingVertical: 12,
                                                                fontSize: 16,
                                                                height: 48,
                                                                color: isDark ? '#000' : '#000'
                                                            }}
                                                            placeholderTextColor={isDark ? '#666' : '#999'}
                                                            autoCapitalize="none"
                                                            autoCorrect={false}
                                                            keyboardType="url"
                                                        />
                                                    </View>
                                                    <HapticButton
                                                        onPress={async () => {
                                                            try {
                                                                const clipboardContent = await Clipboard.getStringAsync();
                                                                if (clipboardContent) {
                                                                    handleUrlChange(clipboardContent, input.id);
                                                                }
                                                            } catch (error) {
                                                                console.error('Failed to paste from clipboard:', error);
                                                            }
                                                        }}
                                                        className="w-12 h-12 items-center justify-center rounded-md bg-muted-foreground/10"
                                                        hapticType="light"
                                                    >
                                                        <Ionicons name="clipboard-outline" size={20} color={isDark ? '#ffffff80' : '#00000080'} />
                                                    </HapticButton>
                                                </View>
                                                <Text className="text-muted-foreground text-sm mt-2">
                                                    We'll generate a transcript and notes for you
                                                </Text>
                                            </View>
                                            {urlInputs.length > 1 && (
                                                <HapticButton
                                                    onPress={() => removeUrlInput(input.id)}
                                                    className="w-12 h-12 items-center justify-center rounded-md bg-destructive/10 mt-0"
                                                    hapticType="light"
                                                >
                                                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                                </HapticButton>
                                            )}
                                        </View>

                                        {input.isLoading && (
                                            <View className="flex-row items-center gap-2 px-2">
                                                <View className="w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
                                                <Text className="text-sm text-muted-foreground">
                                                    Fetching video info...
                                                </Text>
                                            </View>
                                        )}

                                        {input.error && (
                                            <View className="px-2">
                                                <Text className="text-sm text-destructive">
                                                    {input.error}
                                                </Text>
                                            </View>
                                        )}

                                        {input.meta && (
                                            <View className="bg-background rounded-lg p-3 flex-row gap-3 shadow-sm shadow-black/5">
                                                <View className="w-16 h-12 rounded-md overflow-hidden bg-muted/50">
                                                    {input.meta.thumbnail_url && (
                                                        <View className="w-full h-full bg-muted/50 items-center justify-center">
                                                            <Image
                                                                source={{ uri: input.meta.thumbnail_url }}
                                                                className="w-full h-full"
                                                                resizeMode="cover"
                                                            />
                                                        </View>
                                                    )}
                                                </View>
                                                <View className="flex-1 gap-1">
                                                    <Text className="text-sm font-medium text-foreground" numberOfLines={2}>
                                                        {input.meta.title}
                                                    </Text>
                                                    <Text className="text-xs text-muted-foreground">
                                                        {input.meta.author_name}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                ))}

                                <HapticButton
                                    onPress={addUrlInput}
                                    className="flex-row items-center justify-center gap-2 p-3 border border-dashed border-muted-foreground/30 rounded-lg bg-background"
                                    hapticType="light"
                                >
                                    <Ionicons name="add" size={20} color={isDark ? '#ffffff80' : '#00000080'} />
                                    <Text className="text-muted-foreground">Add another URL</Text>
                                </HapticButton>
                            </View>
                        </View>
                    </ScrollView>

                    <View
                        className="p-4 bg-muted border-t border-border/50"
                        style={{
                            position: 'absolute',
                            bottom: keyboardHeight > 0 ? keyboardHeight - 30 : 0,
                            left: 0,
                            right: 0
                        }}
                    >
                        <Button
                            onPress={handleSubmit}
                            disabled={isProcessing || !urlInputs.some(input => input.url.trim() && input.meta)}
                            className="w-full h-12 bg-foreground active:bg-foreground/80"
                        >
                            <Text className="text-background font-medium">
                                {isProcessing ? 'Processing...' : 'Done'}
                            </Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
