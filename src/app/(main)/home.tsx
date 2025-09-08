import { View, Image, TouchableOpacity, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui/text'
import { HapticButton, AnimatedTabs, type TabItem } from '@/components'
import { useRouter } from 'expo-router'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import NotesView from '@/screens/home/notes-view'
import FoldersView from '@/screens/home/folders-view'


export default function Home() {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const { isDark } = useTheme()

    const [activeTab, setActiveTab] = useState('all')

    const tabs: TabItem[] = [
        {
            id: 'all',
            label: 'All',
            content: <NotesView />
        },
        {
            id: 'folders',
            label: 'Folders',
            content: <FoldersView />
        },
        {
            id: 'favorites',
            label: 'Favorites',
            content: (
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-muted-foreground text-center">
                        Favorites content coming soon...
                    </Text>
                </View>
            )
        }
    ]

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
    }

    return (
        <View
            className='flex-1 bg-muted'
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
                <HapticButton
                    hapticType="medium"
                    onPress={() => router.push('/settings')}
                    className="w-10 h-10 rounded-full items-center justify-center"
                    accessibilityRole="button"
                    accessibilityLabel="Settings"
                >
                    <Ionicons name="settings-outline" size={22} color={isDark ? 'white' : 'black'} />
                </HapticButton>
            </View>

            {/* Tab Navigation */}
            <View className="px-4 pb-2">
                <View className="flex-row">
                    {tabs.map((tab) => (
                        <Pressable
                            key={tab.id}
                            onPress={() => handleTabChange(tab.id)}
                            className={cn(
                                "px-4 py-2 rounded-full border mr-1",
                                activeTab === tab.id
                                    ? "bg-foreground border-foreground"
                                    : "bg-background border-border"
                            )}
                        >
                            <Text className={cn(
                                "text-sm font-medium",
                                activeTab === tab.id
                                    ? "text-background"
                                    : "text-muted-foreground"
                            )}>
                                {tab.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Tab Content */}
            <View className="flex-1">
                <AnimatedTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    enableSwipe={true}
                    swipeThreshold={50}
                    swipeChangeThreshold={0.6}
                    contentOnly={true}
                    className="flex-1"
                    contentClassName="rounded-lg"
                    animationConfig={{
                        duration: 250,
                        damping: 25,
                        stiffness: 300,
                    }}
                />
            </View>

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
