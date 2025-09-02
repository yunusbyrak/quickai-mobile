import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { prefs } from '@/lib/storage';
import { languages } from '@/constants/language';

import en from '~/locales/en.json';
import tr from '~/locales/tr.json';
import pt from '~/locales/pt.json';
import es from '~/locales/es.json';

const resources = {
    en: {
        translation: en,
    },
    tr: {
        translation: tr,
    },
    pt: {
        translation: pt,
    },
    es: {
        translation: es,
    },
};

// Get language: saved preference > phone language > default to English
export const getInitialLanguage = () => {
    // First, check if user has a saved language preference
    const savedLanguage = prefs.getString('user_language');
    if (savedLanguage) {
        console.log('🔄 Restored saved language:', savedLanguage);
        return savedLanguage;
    }

    // Otherwise, use phone language
    const phoneLanguage = getLocales()[0]?.languageCode || 'en';
    const supportedLanguages = languages;
    const supportedLanguage = supportedLanguages.includes(phoneLanguage) ? phoneLanguage : 'en';
    console.log('📱 Phone language detected for i18n:', supportedLanguage);
    return supportedLanguage;
};

// Legacy function for backward compatibility
export const getPhoneLanguage = () => {
    const phoneLanguage = getLocales()[0]?.languageCode || 'en';
    const supportedLanguages = languages;
    return supportedLanguages.includes(phoneLanguage) ? phoneLanguage : 'en';
};

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v4',
        resources,
        lng: getInitialLanguage(), // Use saved language or phone language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
