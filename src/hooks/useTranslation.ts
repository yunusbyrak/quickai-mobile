import { useTranslation as useI18n } from 'react-i18next';
import { useEffect } from 'react';
import { prefs } from '@/lib/storage';

export const useTranslation = () => {
    const { t, i18n } = useI18n();

    const changeLanguage = async (language: string) => {
        try {
            // Change language in i18n
            await i18n.changeLanguage(language);

            // Save language preference locally (persists across sessions)
            prefs.set('user_language', language);
            console.log('💾 Language saved to preferences:', language);

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
