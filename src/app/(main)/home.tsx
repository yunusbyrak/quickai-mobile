import { View, ScrollView, Pressable, TextInput, Image, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { NotesList } from '@/components'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useTheme } from '@/context/ThemeContext'
import type { Note } from '@/types/note'
import { useNotes } from '@/hooks/useNotes'
import { supabase } from '@/lib/supabase'

export default function Home() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { isDark } = useTheme()

    const [activeTab, setActiveTab] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [isGridView, setIsGridView] = useState(false)

    const tabs = ['All', 'Folders', 'Favorites']
    const { notes, loading, error, refresh } = useNotes({ folderId: null })


    return (
        <View
            className='flex-1 bg-muted'
            style={{
                paddingTop: Math.max(insets.top, 16),
                // paddingBottom: Math.max(insets.bottom, 16),
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
                <View className="flex-row items-center gap-1">
                    <View className="flex-1 flex-row items-center bg-background border border-border rounded-lg px-3 py-3 gap-3">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 text-foreground"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => setIsGridView(!isGridView)}
                        className="w-12 h-12 bg-background border border-border rounded-lg items-center justify-center"
                    >
                        <Ionicons
                            name={isGridView ? "menu-outline" : "grid-outline"}
                            size={20}

                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView className="flex-1 px-4">
                <NotesList
                    notes={notes}
                    isGridView={isGridView}
                    onNotePress={(note) => {
                        // TODO: Navigate to note detail
                        console.log('Note pressed:', note)
                    }}
                />
            </ScrollView>

            {/* Bottom Navigation */}
            <View className="flex-row items-center justify-center px-4 pt-4 bg-transparent absolute bottom-10 right-0 left-0">
                <View className="flex-row rounded-full p-1 gap-4 border border-border bg-background">
                    <TouchableOpacity
                        className="h-12 bg-orange-500 rounded-full items-center justify-center flex-row px-6 gap-2"
                        onPress={() => router.push('/(main)/audio-recording')}
                    >
                        <MaterialIcons name="add" size={24} color="white" />
                        <Text className="font-medium text-background">New Note</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
