import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { SubscriptionWidget } from '@/components/SubscriptionWidget';
import { SettingsSection, SettingsItem } from '@/components/SettingsSection';
import { LanguageSelector } from '@/components/LanguageSelector';

import { useAppPreferences } from '@/hooks/useAppPreferences';
import { useRouter } from 'expo-router';
import { debug } from '@/lib/storage';
import { languages } from '@/constants/language';
import { useProfile } from '@/hooks/useProfile';

export default function Settings() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { profile, isPremiumUser } = useProfile();
    const { preferences, updateLanguage, updateTheme, shareApp } = useAppPreferences();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const handleUpgrade = () => {
        Alert.alert(
            'Upgrade to Premium',
            'Premium features will be available soon!',
            [{ text: 'OK' }]
        );
    };

    const handleLanguageChange = () => {
        setShowLanguageSelector(true);
    };

    const handleLanguageSelect = (languageCode: string) => {
        updateLanguage(languageCode);
    };

    const handleThemeChange = () => {
        const themeOptions = [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
        ];

        Alert.alert(
            'Select Theme',
            'Choose your preferred theme',
            themeOptions.map(theme => ({
                text: theme.label,
                onPress: () => updateTheme(theme.value as any),
            }))
        );
    };

    const getLanguageLabel = (code: string) => {
        const language = languages.find(lang => lang.code === code);
        return language?.language || code;
    };

    const getThemeLabel = (theme: string) => {
        const labels: Record<string, string> = {
            light: 'Light',
            dark: 'Dark',
            system: 'System',
        };
        return labels[theme] || theme;
    };

    return (
        <View
            className="flex-1 bg-background"
        >

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 pb-6 pt-6">
                    <Text variant="h3" className="text-center font-poppins-bold">
                        Settings
                    </Text>
                </View>

                {/* Premium Upgrade Widget - Only show if not subscribed */}
                {!isPremiumUser && <SubscriptionWidget onUpgrade={handleUpgrade} />}

                {/* Subscription Section */}
                <SettingsSection title="Subscription">
                    <SettingsItem
                        icon="star"
                        iconLibrary="MaterialIcons"
                        title={isPremiumUser ? 'Premium' : 'Free'}
                        subtitle={isPremiumUser ? 'All features unlocked' : 'Limited features'}
                        showChevron={false}
                        isFirst
                        isLast
                    />
                </SettingsSection>

                {/* Personal Information Section */}
                <SettingsSection title="Personal Information">
                    <SettingsItem
                        leftElement={
                            <View className="w-10 h-10 rounded-full bg-orange-500 items-center justify-center">
                                <Text className="text-white font-poppins-bold text-lg">
                                    {profile?.first_name?.charAt(0) || profile?.last_name?.charAt(0)?.toUpperCase() || 'E'}
                                </Text>
                            </View>
                        }
                        title={profile?.first_name || 'User'}
                        subtitle={profile?.email || profile?.id}
                        showChevron={false}
                        isFirst
                    />
                    {__DEV__ && (
                        <SettingsItem
                            icon="delete"
                            iconLibrary="MaterialIcons"
                            title="Clear Cache"
                            onPress={() => {
                                Alert.alert(
                                    'Clear Cache',
                                    'Are you sure you want to clear the cache?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Clear',
                                            onPress: () => {
                                                debug.clearAll();
                                            },
                                        },
                                    ]
                                );
                            }}
                        />
                    )}
                    <SettingsItem
                        icon="info"
                        iconLibrary="MaterialIcons"
                        title="Version"
                        value={preferences.version}
                        showChevron={false}
                    />
                    <SettingsItem
                        icon="share"
                        iconLibrary="MaterialIcons"
                        title="Share AI Transcribe"
                        onPress={shareApp}
                        isLast
                    />
                </SettingsSection>

                {/* Preferences Section */}
                <SettingsSection title="Preferences">
                    <SettingsItem
                        icon="language"
                        iconLibrary="MaterialIcons"
                        title="Language"
                        value={getLanguageLabel(preferences.language)}
                        onPress={handleLanguageChange}
                        isFirst
                    />
                    <SettingsItem
                        icon="palette"
                        iconLibrary="MaterialIcons"
                        title="Theme"
                        value={getThemeLabel(preferences.theme)}
                        onPress={handleThemeChange}
                    />
                    <SettingsItem
                        icon="notifications"
                        iconLibrary="MaterialIcons"
                        title="Notifications"
                        value={preferences.notifications ? 'On' : 'Off'}
                        onPress={() => Alert.alert('Notifications', 'Notification settings coming soon!')}
                    />
                    <SettingsItem
                        icon="help"
                        iconLibrary="MaterialIcons"
                        title="Help & Support"
                        onPress={() => Alert.alert('Help', 'Support coming soon!')}
                    />
                    <SettingsItem
                        icon="privacy-tip"
                        iconLibrary="MaterialIcons"
                        title="Privacy Policy"
                        onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon!')}
                    />
                    <SettingsItem
                        icon="description"
                        iconLibrary="MaterialIcons"
                        title="Terms of Service"
                        onPress={() => Alert.alert('Terms', 'Terms of service coming soon!')}
                        isLast
                    />
                </SettingsSection>

                {/* Bottom Spacing */}
                <View className="h-8" />
            </ScrollView>

            {/* Language Selector Modal */}
            <LanguageSelector
                languages={languages}
                selectedLanguage={preferences.language}
                onLanguageSelect={handleLanguageSelect}
                showAutoOption={false}
                isVisible={showLanguageSelector}
                onClose={() => setShowLanguageSelector(false)}
                title="Language"
                searchPlaceholder="Search language"
            />
        </View>
    );
}
