import { ColorSchemeName } from 'react-native';

// Theme context type
export interface ThemeContextType {
    isDark: boolean;
    themeMode: 'light' | 'dark' | 'system';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    systemTheme: ColorSchemeName;
    themeVars: any; // Style object to apply theme
}

// Theme configuration type
export interface ThemeConfig {
    light: any;
    dark: any;
}

// Theme variables type
export interface ThemeVars {
    [key: string]: string;
}
