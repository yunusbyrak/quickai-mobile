import { View, Image, TouchableOpacity, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { HapticButton, AnimatedTabs, type TabItem } from '@/components';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import NotesView from '@/screens/home/notes-view';
import FoldersView from '@/screens/home/folders-view';
import NoteAddModal from '@/components/NoteAddModal';
import { useAppPreferences, useTemplates } from '@/hooks';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const { loadTemplates, loadTemplateGroups } = useTemplates();
  const { preferences } = useAppPreferences();

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchTemplates = async () => {
      await loadTemplates(preferences.language);
      await loadTemplateGroups(preferences.language);
    };
    fetchTemplates();
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'all',
      label: 'All',
      content: <NotesView />,
    },
    {
      id: 'folders',
      label: 'Folders',
      content: <FoldersView />,
    },
    {
      id: 'favorites',
      label: 'Favorites',
      content: <NotesView favorite={true} />,
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <View
      className="flex-1 bg-muted"
      style={{
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: Math.max(insets.bottom, 16),
      }}>
      {/* Header Gradient Image */}
      <View className="absolute left-0 right-0 top-0 items-center">
        <Image
          source={require('~/assets/images/header-gradient.png')}
          className="w-full"
          resizeMode="cover"
        />
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-4">
        <View className="flex-row items-center gap-2">
          <Image source={require('~/assets/images/logo-3d.png')} className="h-10 w-10" />
          <Text variant="h3" className="font-poppins-bold font-bold text-foreground">
            Quick AI
          </Text>
        </View>
        <HapticButton
          hapticType="medium"
          onPress={() => router.push('/settings')}
          className="h-10 w-10 items-center justify-center rounded-full"
          accessibilityRole="button"
          accessibilityLabel="Settings">
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
                'mr-1 rounded-full border px-4 py-2',
                activeTab === tab.id
                  ? 'border-foreground bg-foreground'
                  : 'border-border bg-background'
              )}>
              <Text
                className={cn(
                  'text-sm font-medium',
                  activeTab === tab.id ? 'text-background' : 'text-muted-foreground'
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
      <NoteAddModal />
    </View>
  );
}
