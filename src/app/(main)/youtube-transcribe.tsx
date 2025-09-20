import { HapticButton } from '@/components';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/context/ThemeContext';
import { getYouTubeVideoId } from '@/utils/functions';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    Platform,
    SafeAreaView,
    ScrollView,
    TextInput,
    View,
    Image,
    ActivityIndicator,
} from 'react-native';
import { getYoutubeMeta, YoutubeMeta } from 'react-native-youtube-iframe';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { TranscribeYoutubeRequest } from '@/types/transcribe';
import { youtubeTranscribe } from '@/services/transcribe.service';
import { toast } from 'sonner-native';


interface YoutubeUrlInput {
    id: string;
    url: string;
    meta: YoutubeMeta | null;
    isLoading: boolean;
    error: string | null;
}

export default function YoutubeTranscribe() {
    const { isDark } = useTheme();
    const router = useRouter()
    const [urlInputs, setUrlInputs] = useState<YoutubeUrlInput[]>([
        { id: '1', url: '', meta: null, isLoading: false, error: null },
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const firstInputRef = useRef<TextInput>(null);

    const keyboard = useAnimatedKeyboard();

    const flatListAnimatedStyles = useAnimatedStyle(() => ({
        height: `100%`,
        marginBottom: keyboard.height.value,
    }));

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
            setUrlInputs((prev) =>
                prev.map((input) =>
                    input.id === inputId
                        ? { ...input, error: 'Invalid YouTube URL', isLoading: false }
                        : input
                )
            );
            return;
        }

        setUrlInputs((prev) =>
            prev.map((input) =>
                input.id === inputId ? { ...input, isLoading: true, error: null } : input
            )
        );

        try {
            const meta = await getYoutubeMeta(videoId);
            setUrlInputs((prev) =>
                prev.map((input) =>
                    input.id === inputId ? { ...input, meta, isLoading: false, error: null } : input
                )
            );
        } catch (error) {
            setUrlInputs((prev) =>
                prev.map((input) =>
                    input.id === inputId
                        ? { ...input, error: 'Failed to fetch video info', isLoading: false }
                        : input
                )
            );
        }
    }, []);

    const handleUrlChange = useCallback(
        (text: string, inputId: string) => {
            setUrlInputs((prev) =>
                prev.map((input) =>
                    input.id === inputId ? { ...input, url: text, meta: null, error: null } : input
                )
            );

            // Auto-fetch meta when URL looks complete
            if (text.includes('youtube.com') || text.includes('youtu.be')) {
                const videoId = getYouTubeVideoId(text);
                if (videoId) {
                    fetchVideoMeta(text, inputId);
                }
            }
        },
        [fetchVideoMeta]
    );

    const addUrlInput = useCallback(() => {
        const newId = (urlInputs.length + 1).toString();
        setUrlInputs((prev) => [
            ...prev,
            {
                id: newId,
                url: '',
                meta: null,
                isLoading: false,
                error: null,
            },
        ]);
    }, [urlInputs.length]);

    const removeUrlInput = useCallback(
        (inputId: string) => {
            if (urlInputs.length > 1) {
                setUrlInputs((prev) => prev.filter((input) => input.id !== inputId));
            }
        },
        [urlInputs.length]
    );

    const handleSubmit = useCallback(async () => {
        const validUrls = urlInputs.filter((input) => input.url.trim() && input.meta);

        if (validUrls.length === 0) {
            toast.error('Please add at least one valid YouTube URL');
            return;
        }

        const requestBody: TranscribeYoutubeRequest = {
            urls: validUrls.map((input) => ({
                url: input.url,
                title: input.meta?.title || '',
            })),
        };

        setIsProcessing(true);

        try {
            // TODO: forward to the note detail screen
            const response = await youtubeTranscribe(requestBody);
            console.log('response', response);
            toast.success(`Processing ${validUrls.length} video${validUrls.length > 1 ? 's' : ''} for transcription`,);
            router.replace(`/(main)/notes/detail?noteId=${response.data.id}`);
        } catch (error) {
            toast.error('Failed to process videos');
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
                            className="-ml-2 items-center justify-center"
                            hapticType="light"
                            accessibilityLabel="Go back"
                            accessibilityHint="Return to previous screen">
                            <Ionicons name="chevron-back-outline" size={24} color={isDark ? 'white' : 'black'} />
                        </HapticButton>
                    ),
                }}
            />

            <SafeAreaView className="flex-1 bg-muted">
                <View className="flex-1">
                    <Animated.View style={[flatListAnimatedStyles, { flex: 1 }]}>
                        <ScrollView
                            className="flex-1 px-4"
                            contentContainerStyle={{
                                paddingTop: 20,
                                paddingBottom: keyboardHeight > 0 ? 100 : 20,
                            }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled">
                            <View className="gap-6">
                                <View className="gap-4">
                                    {urlInputs.map((input, index) => (
                                        <View key={input.id} className="gap-3">
                                            <View className="flex-row items-start gap-2">
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
                                                                    color: isDark ? '#000' : '#000',
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
                                                            className="h-12 w-12 items-center justify-center rounded-md bg-muted-foreground/10"
                                                            hapticType="light">
                                                            <Ionicons
                                                                name="clipboard-outline"
                                                                size={20}
                                                                color={isDark ? '#ffffff80' : '#00000080'}
                                                            />
                                                        </HapticButton>
                                                    </View>
                                                </View>
                                                {urlInputs.length > 1 && (
                                                    <HapticButton
                                                        onPress={() => removeUrlInput(input.id)}
                                                        className="mt-0 h-12 w-12 items-center justify-center rounded-md bg-destructive/10"
                                                        hapticType="light">
                                                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                                    </HapticButton>
                                                )}
                                            </View>

                                            {input.isLoading && (
                                                <View className="flex-row items-center gap-2 px-2">
                                                    <View className="h-4 w-4 animate-pulse rounded-full bg-primary/20" />
                                                    <Text className="text-sm text-muted-foreground">
                                                        Fetching video info...
                                                    </Text>
                                                </View>
                                            )}

                                            {input.error && (
                                                <View className="px-2">
                                                    <Text className="text-sm text-destructive">{input.error}</Text>
                                                </View>
                                            )}

                                            {input.meta && (
                                                <View className="flex-row gap-3 rounded-lg bg-background p-3 shadow-sm shadow-black/5">
                                                    <View className="h-12 w-16 overflow-hidden rounded-md bg-muted/50">
                                                        {input.meta.thumbnail_url && (
                                                            <View className="h-full w-full items-center justify-center bg-muted/50">
                                                                <Image
                                                                    source={{ uri: input.meta.thumbnail_url }}
                                                                    className="h-full w-full"
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
                                        className="flex-row items-center justify-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 bg-background p-3"
                                        hapticType="light">
                                        <Ionicons name="add" size={20} color={isDark ? '#ffffff80' : '#00000080'} />
                                        <Text className="text-muted-foreground">Add another URL</Text>
                                    </HapticButton>
                                </View>
                            </View>
                        </ScrollView>
                    </Animated.View>
                    <View
                        className="border-t border-border/50 bg-muted p-4"
                        style={{
                            position: 'absolute',
                            bottom: keyboardHeight > 0 ? keyboardHeight - 30 : 0,
                            left: 0,
                            right: 0,
                        }}>
                        <Button
                            onPress={handleSubmit}
                            disabled={isProcessing || !urlInputs.some((input) => input.url.trim() && input.meta)}
                            className="h-12 w-full bg-foreground active:bg-foreground/80">
                            <Text className="font-medium text-background">
                                {isProcessing && <ActivityIndicator size="small" color="white" />}
                                {!isProcessing && 'Done'}
                            </Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}
