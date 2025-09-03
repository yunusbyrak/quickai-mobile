import { View, ScrollView, Pressable, TextInput, Image, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useTheme } from '@/context/ThemeContext'

export default function Home() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { isDark } = useTheme()

    const [activeTab, setActiveTab] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [isGridView, setIsGridView] = useState(false)

    const tabs = ['All', 'Folders', 'Favorites']

    const mockWaves = [
        {
            id: '1',
            title: 'AI Transcribe App Introduction',
            description: 'AI Transcribe is your ultimate AI-powered note-...',
            date: 'Sep 1',
            time: '07:42 PM',
            tag: 'Getting Started'
        },
        {
            id: '2',
            title: 'Meeting Notes',
            description: 'Important discussion about project timeline...',
            date: 'Sep 2',
            time: '10:30 AM',
            tag: 'Work'
        },
        {
            id: '3',
            title: 'Lecture Recording',
            description: 'Machine Learning fundamentals explained...',
            date: 'Sep 3',
            time: '02:15 PM',
            tag: 'Education'
        },
        {
            id: '4',
            title: 'Voice Memo',
            description: 'Quick thoughts about the new app features...',
            date: 'Sep 4',
            time: '08:22 AM',
            tag: 'Ideas'
        }
    ]

    return (
        <View
            className='flex-1 bg-background'
            style={{
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 16),
            }}
        >

            {/* Header Gradient Image */}
            <View className="absolute top-0 left-0 right-0 items-center">
                <Image
                    source={require('~/assets/images/header-gradient.png')}
                    className="w-full"
                    resizeMode="cover"
                />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pb-4">
                <View className="flex-row items-center gap-2">
                    <Image source={require('~/assets/images/logo-3d.png')} className="w-10 h-10" />
                    <Text variant="h3" className="font-bold text-foreground font-poppins-bold">
                        Quick
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/settings')}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    accessibilityRole="button"
                    accessibilityLabel="Settings"
                >
                    <Ionicons name="settings-outline" size={22} color={isDark ? 'white' : 'black'} />
                </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View className="px-4 pb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                >
                    {tabs.map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 rounded-full border mr-1",
                                activeTab === tab
                                    ? "bg-foreground border-foreground"
                                    : "bg-background border-border"
                            )}
                        >
                            <Text className={cn(
                                "text-sm font-medium",
                                activeTab === tab
                                    ? "text-background"
                                    : "text-muted-foreground"
                            )}>
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Search Bar */}
            <View className="px-4 pb-4">
                <View className="flex-row items-center gap-3">
                    <View className="flex-1 flex-row items-center bg-muted rounded-lg px-3 py-3 gap-3">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 text-foreground"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <Pressable
                        onPress={() => setIsGridView(!isGridView)}
                        className="w-10 h-10 bg-muted rounded-lg items-center justify-center"
                    >
                        <MaterialIcons
                            name={isGridView ? "view-list" : "grid-view"}
                            size={20}
                            color="#9CA3AF"
                        />
                    </Pressable>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-4">
                {isGridView ? (
                    <View className="gap-3">
                        {Array.from({ length: Math.ceil(mockWaves.length / 2) }, (_, rowIndex) => (
                            <View key={rowIndex} className="flex-row gap-3">
                                {mockWaves.slice(rowIndex * 2, rowIndex * 2 + 2).map((wave) => (
                                    <Pressable
                                        key={wave.id}
                                        className="bg-card rounded-lg p-3 border border-border flex-1"
                                    >
                                        <View className="gap-2">
                                            <View className="gap-2">
                                                <View className="h-8 justify-center">
                                                    <Text variant="small" className="font-semibold text-foreground text-start" numberOfLines={2}>
                                                        {wave.title}
                                                    </Text>
                                                </View>
                                                <View className="h-px bg-border" />
                                            </View>
                                            <Text className="text-muted-foreground text-xs text-start" numberOfLines={2}>
                                                {wave.description}
                                            </Text>
                                            <View className="gap-1">
                                                <Text className="text-muted-foreground text-xs">
                                                    {wave.date} · {wave.time}
                                                </Text>
                                                <View className="bg-muted px-2 py-1 rounded self-start">
                                                    <Text className="text-muted-foreground text-xs">
                                                        {wave.tag}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </Pressable>
                                ))}
                                {/* Add empty view if odd number of items in last row */}
                                {rowIndex === Math.ceil(mockWaves.length / 2) - 1 && mockWaves.length % 2 === 1 && (
                                    <View className="flex-1" />
                                )}
                            </View>
                        ))}
                    </View>
                ) : (
                    <View>
                        {mockWaves.map((wave) => (
                            <Pressable
                                key={wave.id}
                                className="bg-card rounded-lg p-2 px-3 mb-3 border border-border"
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 bg-muted rounded-lg items-center justify-center">
                                        <MaterialIcons name="graphic-eq" size={20} color="#FF6B35" />
                                    </View>
                                    <View className="flex-1">
                                        <Text variant="large" className="font-semibold text-foreground">
                                            {wave.title}
                                        </Text>
                                        <Text className="text-foreground text-sm">
                                            {wave.description}
                                        </Text>
                                        <View className="flex-row items-center gap-2">
                                            <Text className="text-muted-foreground text-xs">
                                                {wave.date} · {wave.time}
                                            </Text>
                                            <View className="bg-muted px-2 py-1 rounded">
                                                <Text className="text-muted-foreground text-xs">
                                                    {wave.tag}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <View className="flex-row items-center justify-center px-4 pt-4">
                <View className="flex-row bg-card rounded-full p-2 gap-4 border border-border">
                    <Pressable className="flex-row items-center gap-2 bg-muted px-4 py-2 rounded-full">
                        <MaterialIcons name="graphic-eq" size={16} color="#9CA3AF" />
                        <Text className="text-muted-foreground text-sm font-medium">Waves</Text>
                    </Pressable>
                    <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                        <MaterialIcons name="add" size={24} color="white" />
                    </View>
                    <Pressable className="flex-row items-center gap-2 px-4 py-2 rounded-full">
                        <Ionicons name="chatbubble-ellipses" size={16} color="#9CA3AF" />
                        <Text className="text-muted-foreground text-sm font-medium">AI Chat</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}
