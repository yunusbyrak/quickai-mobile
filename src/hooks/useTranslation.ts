import { useTranslation as useI18n } from 'react-i18next';
import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { prefs } from '@/lib/storage';

export const useTranslation = () => {
    const { t, i18n } = useI18n();
    const { profile, updateLanguage } = useProfile();

    // Synchronize language with profile on load
    useEffect(() => {
        if (profile?.lang && profile.lang !== i18n.language) {
            console.log('🔄 Syncing language from profile:', profile.lang);
            i18n.changeLanguage(profile.lang);
            // Save to local preferences to persist across sessions
            prefs.set('user_language', profile.lang);
        }
    }, [profile?.lang, i18n]);

    const changeLanguage = async (language: string) => {
        try {
            // Change language in i18n
            await i18n.changeLanguage(language);

            // Save language preference locally (persists across sessions)
            prefs.set('user_language', language);
            console.log('💾 Language saved to preferences:', language);

            // Update language in database if user is logged in
            if (profile) {
                await updateLanguage(language);
            }
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    const currentLanguage = i18n.language;

    return {
        t,
        changeLanguage,
        currentLanguage,
    };
};
