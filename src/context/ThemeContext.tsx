import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { MMKV } from 'react-native-mmkv';
import { ThemeContextType } from '@/types/theme.d';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const storage = new MMKV();

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isInitialized, setIsInitialized] = useState(false);
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(colorScheme as 'light' | 'dark' | 'system' || 'system');
    const isDark = colorScheme === 'dark';

    const themeVars = {};

    // Initialize theme from MMKV
    useEffect(() => {
        const initializeTheme = () => {
            try {
                const savedThemeMode = storage.getString('theme_mode') as 'light' | 'dark' | 'system' || 'system';
                setThemeMode(savedThemeMode);
                if (savedThemeMode === 'system') {
                    setColorScheme('system');
                } else {
                    // Apply user-selected theme
                    setColorScheme(savedThemeMode);
                }
            } catch (error) {
                setColorScheme('system');
            } finally {
                setIsInitialized(true);
            }
        };

        initializeTheme();
    }, []);

    const setTheme = (theme: 'light' | 'dark' | 'system') => {
        try {
            setThemeMode(theme);
            storage.set('theme_mode', theme);

            if (theme === 'system') {
                setColorScheme('system');
            } else {
                setColorScheme(theme);
            }
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                themeMode,
                toggleTheme,
                setTheme,
                systemTheme: colorScheme, // Use NativeWind's detected scheme
                themeVars,
            }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
