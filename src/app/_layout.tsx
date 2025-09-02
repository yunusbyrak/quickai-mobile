import '../../global.css';

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import SplashScreen from '@/screens/splash-screen';

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
        }
    }, [fontsLoaded, fontsError]);

    if (!appReady || !splashAnimationFinished) {
        return <SplashScreen onAnimationFinish={() => setSplashAnimationFinished(true)} />;
    }

    return <>
        <Stack />
    </>;
}
