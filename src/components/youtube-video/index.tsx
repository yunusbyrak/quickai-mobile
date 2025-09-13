import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef, YoutubeMeta, getYoutubeMeta } from 'react-native-youtube-iframe';
import Modal from '../ui/modal';
import { HapticButton } from '../ui/haptic-button';
import VideoScreen from './video-screen';
import { cn } from '@/lib/utils';
import TranscriptScreen from '@/screens/note-detail/transcript';

interface YoutubeVideoProps {
    videoId: string;
}

export default function YoutubeVideo({
    videoId,
}: YoutubeVideoProps) {
    const [isReady, setIsReady] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [meta, setMeta] = useState<YoutubeMeta | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        getYoutubeMeta(videoId).then(setMeta);
    }, []);

    return (
        <>
            <View className="rounded-2xl overflow-hidden relative">

                <View className='flex-row items-center justify-between gap-1'>
                    <LinearGradient
                        colors={['#f87171', '#ef4444', '#dc2626']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            flex: 1,
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            borderBottomLeftRadius: isCollapsed ? 16 : 0,
                            borderBottomRightRadius: isCollapsed ? 16 : 0,
                        }}
                    >
                        <HapticButton
                            onPress={() => {
                                if (isCollapsed) {
                                    setIsReady(false);
                                }
                                setIsCollapsed(!isCollapsed)
                            }}
                            className='flex-row rounded-2xl p-2 items-center justify-between gap-2'
                        >
                            <View className='w-8 h-8'>
                                <Image className='w-full h-full rounded-xl' source={{ uri: meta?.thumbnail_url }} />
                            </View>
                            <View className='flex-1'>
                                <Text className='text-white' numberOfLines={1}>{meta?.title}</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <View
                                    className="w-8 h-8 items-center justify-center rounded-full"
                                    accessibilityRole="button"
                                    accessibilityLabel="Play video"
                                    hitSlop={8}
                                >
                                    <Ionicons name={!isCollapsed ? "chevron-up" : "chevron-down"} size={22} color="#fff" />
                                </View>
                            </View>
                        </HapticButton>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#374151', '#1f2937', '#111827']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            borderBottomLeftRadius: isCollapsed ? 16 : 0,
                            borderBottomRightRadius: isCollapsed ? 16 : 0,
                        }}
                    >
                        <HapticButton
                            onPress={() => setIsModalVisible(true)}
                            className='w-12 h-12 items-center justify-center'
                        >
                            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
                        </HapticButton>
                    </LinearGradient>
                </View>

                <View className="relative">
                    {!isReady && (
                        <View className={cn('absolute top-0 left-0 right-0 bottom-0 bg-black/90 items-center justify-center', {
                            'hidden': isCollapsed
                        })}>
                            {/* <Image source={{uri: meta?.thumbnail_url}} className="w-full h-full" /> */}
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}
                    {!isCollapsed && <YoutubePlayer
                        contentScale={0.7}
                        initialPlayerParams={{
                            controls: false,
                            preventFullScreen: true,
                        }}
                        onReady={() => {
                            setIsReady(true);
                        }}
                        height={200}
                        ref={null}
                        videoId={videoId}
                    />}
                </View>
            </View >
            <Modal
                transparent={false}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TranscriptScreen
                    onClose={() => setIsModalVisible(false)}
                />
            </Modal>
        </>
    );
}

