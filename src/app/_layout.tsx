import '../../global.css';
import '@/i18n';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import SplashScreen from '@/screens/splash-screen';
import Animated, { FadeIn } from 'react-native-reanimated';
import { StatusBar, View } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { RevenueCatProvider } from '@/context/RevenuCatContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { Toaster } from 'sonner-native';


export default function Layout() {

    const [fontsLoaded, fontsError] = useFonts({
        'Poppins-Regular': require('~/assets/fonts/Poppins/Poppins-Regular.ttf'),
        'Poppins-Medium': require('~/assets/fonts/Poppins/Poppins-Medium.ttf'),
        'Poppins-Bold': require('~/assets/fonts/Poppins/Poppins-Bold.ttf'),
        'Poppins-Light': require('~/assets/fonts/Poppins/Poppins-Light.ttf'),
        'Poppins-SemiBold': require('~/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
        'Poppins-Thin': require('~/assets/fonts/Poppins/Poppins-Thin.ttf'),
        'Stolzl-Regular': require('~/assets/fonts/Stolzl/stolzl_regular.otf'),
        'Stolzl-Medium': require('~/assets/fonts/Stolzl/stolzl_medium.otf'),
        'Stolzl-Bold': require('~/assets/fonts/Stolzl/stolzl_bold.otf'),
        'Stolzl-Light': require('~/assets/fonts/Stolzl/stolzl_light.otf'),
        'Stolzl-Book': require('~/assets/fonts/Stolzl/stolzl_book.otf'),
        'Stolzl-Thin': require('~/assets/fonts/Stolzl/stolzl_thin.otf'),
    });

    const [appReady, setAppReady] = useState(false);
    const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

    useEffect(() => {
        if (fontsLoaded && !fontsError) {
            setAppReady(true);
            console.log(`App is ready`);
        }
    }, [fontsLoaded, fontsError]);

    if (!appReady || !splashAnimationFinished) {
        return <SplashScreen onAnimationFinish={() => setSplashAnimationFinished(true)} />;
    }

    return <>
        <RevenueCatProvider>
            <ThemeProvider>
                <ThemedLayout>
                    <BottomSheetModalProvider>
                        <AuthProvider>
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                }}
                            />
                        </AuthProvider>
                    </BottomSheetModalProvider>
                    <PortalHost />
                </ThemedLayout>
            </ThemeProvider>
        </RevenueCatProvider>
    </>;
}

function ThemedLayout({ children }: { children: React.ReactNode }) {
    const { isDark, themeVars, themeMode } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={[{ flex: 1 }, themeVars]}>
                <StatusBar
                    barStyle={isDark ? 'light-content' : 'dark-content'}
                    backgroundColor={isDark ? '#0F0F0F' : '#FFFFFF'}
                    translucent={false}
                />
                <Animated.View entering={FadeIn} className={'flex-1'}>
                    {children}
                </Animated.View>
                <Toaster position='bottom-center' />
            </View>
        </GestureHandlerRootView>
    );
}


