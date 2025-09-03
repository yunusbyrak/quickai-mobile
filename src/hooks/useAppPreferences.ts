import { useState, useEffect } from 'react';
import { prefs } from '@/lib/storage';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import { languages } from '@/constants/language';

interface AppPreferences {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    autoSave: boolean;
    version: string;
}

export const useAppPreferences = () => {
    const { themeMode, setTheme } = useTheme();
    const { changeLanguage, currentLanguage } = useTranslation();

    const [preferences, setPreferences] = useState<AppPreferences>({
        language: currentLanguage,
        theme: 'system',
        notifications: true,
        autoSave: true,
        version: '1.0.0',
    });

    useEffect(() => {
        const loadPreferences = () => {
            const savedNotifications = prefs.getBoolean('notifications', true);
            const savedAutoSave = prefs.getBoolean('auto_save', true);

            setPreferences({
                language: currentLanguage,
                theme: themeMode,
                notifications: savedNotifications,
                autoSave: savedAutoSave,
                version: '1.3.4',
            });
        };

        loadPreferences();
    }, [themeMode]);

    const updateLanguage = async (language: string) => {
        if (languages.includes(language)) {
            prefs.set('language', language);
            await changeLanguage(language);
            setPreferences(prev => ({ ...prev, language }));
        }
    };

    const updateTheme = (theme: 'light' | 'dark' | 'system') => {
        setTheme(theme);
        setPreferences(prev => ({ ...prev, theme }));
    };

    const updateNotifications = (enabled: boolean) => {
        prefs.set('notifications', enabled);
        setPreferences(prev => ({ ...prev, notifications: enabled }));
    };

    const updateAutoSave = (enabled: boolean) => {
        prefs.set('auto_save', enabled);
        setPreferences(prev => ({ ...prev, autoSave: enabled }));
    };

    const shareApp = () => {
        // TODO: Implement share functionality
        console.log('Share app functionality');
    };

    return {
        preferences,
        updateLanguage,
        updateTheme,
        updateNotifications,
        updateAutoSave,
        shareApp,
    };
};
