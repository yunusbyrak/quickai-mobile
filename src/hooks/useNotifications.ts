import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert, Linking } from 'react-native';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import Constants from 'expo-constants';

// Global notification configuration
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationPermissionStatus {
    granted: boolean;
    canAskAgain: boolean;
    status: Notifications.PermissionStatus;
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
    let token = null;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Default Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: 'hsl(var(--primary))',
        });
    }

    const { status: existingStatus, canAskAgain } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        if (!canAskAgain) {
            throw new Error('Permissions blocked. Go to Settings > Notifications to enable them.');
        }

        const { status } = await Notifications.requestPermissionsAsync({
            ios: {
                allowAlert: true,
                allowBadge: true,
                allowSound: true,
                allowDisplayInCarPlay: true,
                allowCriticalAlerts: false,
                provideAppNotificationSettings: true,
                allowProvisional: false,
            },
        });
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        throw new Error(`Permissions denied. Status: ${finalStatus}`);
    }

    // Only generate push token on real devices
    if (Device.isDevice) {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('🔑 Token preview:', `${token.substring(0, 20)}...`);
    }

    return token;
}

export const useNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState<string>('');
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>({
        granted: false,
        canAskAgain: true,
        status: Notifications.PermissionStatus.UNDETERMINED,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [testLoading, setTestLoading] = useState<string | null>(null);
    const [notificationSettings, setNotificationSettings] = useState({
        pushEnabled: false,
    });

    const previousPermissionRef = useRef<boolean | null>(null);
    const previousTokenRef = useRef<string | null>(null);
    const { session } = useAuth();
    const { t } = useTranslation();

    // Save token to Supabase - simplified version
    const saveTokenToSupabase = async (token: string) => {
        if (!session?.user?.id || !token) {
            console.log('❌ Cannot save token: missing session or token');
            return;
        }

        try {
            console.log('💾 Saving token to Supabase for user:', session.user.id);
            const { error } = await supabase
                .from('users')
                .update({ push_notification_token: token })
                .eq('id', session.user.id);

            if (error) {
                console.error('❌ Error saving token to Supabase:', error);
            } else {
                console.log('✅ Token successfully saved to Supabase');
            }
        } catch (error) {
            console.error('❌ Exception saving token to Supabase:', error);
        }
    };

    // Simple permission check
    const checkPermissions = async (): Promise<NotificationPermissionStatus> => {
        const { status, canAskAgain } = await Notifications.getPermissionsAsync();
        const result = {
            granted: status === 'granted',
            canAskAgain: canAskAgain ?? true,
            status,
        };
        setPermissionStatus(result);
        return result;
    };

    // Request permissions
    const requestPermissions = async (): Promise<NotificationPermissionStatus> => {
        setIsLoading(true);
        try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                setExpoPushToken(token);
                await saveTokenToSupabase(token);
            }
            return await checkPermissions();
        } catch (error) {
            console.error('Error requesting permissions:', error);
            return await checkPermissions();
        } finally {
            setIsLoading(false);
        }
    };


    // Settings object for compatibility with settings page
    const settings = {
        pushEnabled: notificationSettings.pushEnabled,
    };

    // Load settings from Supabase
    const loadSettingsFromSupabase = async () => {
        if (!session?.user?.id) return;

        try {
            const { data, error } = await supabase
                .from('users')
                .select('push_notifications_enabled, push_notification_token')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error loading notification settings:', error);
                return;
            }

            setNotificationSettings({
                pushEnabled: data?.push_notifications_enabled || false
            });

            // Load existing push token if it exists
            if (data?.push_notification_token) {
                console.log('✅ Existing push token loaded from Supabase:', `${data.push_notification_token.substring(0, 20)}...`);
                setExpoPushToken(data.push_notification_token);
            }

            console.log('✅ Notification settings loaded from Supabase');
        } catch (error) {
            console.error('Exception loading notification settings:', error);
        }
    };

    // Update settings function with push notification registration
    const updateSettings = async (newSettings: Partial<typeof settings>) => {
        try {
            setIsLoading(true);

            // Special handling for push notifications activation
            if (newSettings.pushEnabled === true && !notificationSettings.pushEnabled) {
                console.log('🔔 User is enabling push notifications - registering...');

                try {
                    // Register for push notifications and get token
                    const token = await registerForPushNotificationsAsync();
                    if (token) {
                        console.log('✅ Push token generated:', `${token.substring(0, 20)}...`);
                        setExpoPushToken(token);
                        await saveTokenToSupabase(token);
                    }
                } catch (error) {
                    console.error('❌ Failed to register for push notifications:', error);
                    Alert.alert(
                        'Error',
                        'Failed to enable push notifications. Please check your settings and try again.'
                    );
                    setIsLoading(false);
                    return;
                }
            }

            // Update settings locally
            const updatedSettings = { ...notificationSettings, ...newSettings };
            setNotificationSettings(updatedSettings);

            // Save to database
            if (session?.user?.id) {
                const updateData: any = {};

                if (newSettings.pushEnabled !== undefined) {
                    updateData.push_notifications_enabled = newSettings.pushEnabled;
                    // Also save the token if enabling push notifications
                    if (newSettings.pushEnabled && expoPushToken) {
                        updateData.push_notification_token = expoPushToken;
                    }
                }
                const { error } = await supabase
                    .from('users')
                    .update(updateData)
                    .eq('id', session.user.id);

                if (error) {
                    console.error('❌ Error saving notification settings:', error);
                    // Revert to previous settings on error
                    setNotificationSettings(notificationSettings);
                    throw error;
                }

                console.log('✅ Notification settings saved to Supabase');
            }
        } catch (error) {
            console.error('❌ Error updating notification settings:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Check if permissions are blocked
    const arePermissionsBlocked = async (): Promise<boolean> => {
        const { status, canAskAgain } = await Notifications.getPermissionsAsync();
        return status !== 'granted' && !canAskAgain;
    };

    // Open system settings
    const openSettings = async () => {
        try {
            if (Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
            } else {
                await Linking.openSettings();
            }
        } catch (error) {
            console.log('Unable to open settings automatically:', error);
            Alert.alert('Error', 'Unable to open settings automatically');
        }
    };

    // Enhanced check permissions with system verification
    const checkSystemPermissions = async (): Promise<NotificationPermissionStatus> => {
        console.log('🔍 Checking system notification permissions...');
        const result = await checkPermissions();

        // If permissions are blocked, show alert with settings option
        if (!result.granted && !result.canAskAgain) {
            Alert.alert(
                'Notifications Blocked',
                'Please enable notifications in your device settings to continue.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Open Settings',
                        onPress: openSettings
                    }
                ]
            );
        }

        return result;
    };

    // Test token from Supabase
    const testTokenFromSupabase = async () => {
        if (!session?.user?.id) {
            console.log('❌ No user session for token test');
            return;
        }

        try {
            console.log('🔍 Testing token retrieval from Supabase...');
            const { data, error } = await supabase
                .from('users')
                .select('push_notification_token')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('❌ Error retrieving token from Supabase:', error);
            } else {
                console.log('✅ Token from Supabase:', {
                    hasToken: !!data?.push_notification_token,
                    tokenPreview: data?.push_notification_token ? `${data.push_notification_token.substring(0, 20)}...` : 'null',
                    matches: data?.push_notification_token === expoPushToken
                });
            }
        } catch (error) {
            console.error('❌ Exception testing token from Supabase:', error);
        }
    };

    // Aliases for compatibility
    const pushToken = expoPushToken;
    const hasPermission = permissionStatus.granted;

    // Monitor notification status changes
    useLayoutEffect(() => {
        if (previousPermissionRef.current !== null && previousPermissionRef.current !== hasPermission) {
            console.log('🔔 Notification permission status changed:', {
                from: previousPermissionRef.current,
                to: hasPermission,
                permissionStatus: permissionStatus.status
            });
        }

        if (previousTokenRef.current !== null && previousTokenRef.current !== expoPushToken) {
            console.log('🎯 Push token changed:', {
                hadToken: !!previousTokenRef.current,
                hasToken: !!expoPushToken,
                tokenPreview: expoPushToken ? `${expoPushToken.substring(0, 20)}...` : null
            });
        }

        previousPermissionRef.current = hasPermission;
        previousTokenRef.current = expoPushToken;
    }, [hasPermission, permissionStatus.status, expoPushToken]);

    // Initialize basic settings without automatic push registration
    useEffect(() => {
        if (!session?.user?.id) return;

        console.log('🚀 Initializing notifications for user:', session.user.id);

        // Check permissions first
        checkPermissions();

        // Load notification settings from Supabase
        loadSettingsFromSupabase();

        // DON'T register for push notifications automatically - wait for user to enable in settings
        console.log('⏳ Waiting for user to enable push notifications in settings...');
    }, [session?.user?.id]);

    return {
        expoPushToken,
        permissionStatus,
        isLoading,
        testLoading,
        checkPermissions,
        checkSystemPermissions,
        requestPermissions,
        testTokenFromSupabase,
        settings,
        updateSettings,
        pushToken,
        hasPermission,
        arePermissionsBlocked,
        openSettings,
    };
};
