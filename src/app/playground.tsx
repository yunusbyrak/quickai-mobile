import { Stack } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';
import Language from '@/components/playground/language';
import ThemeSelector from '@/components/playground/theme-selector';
import { View } from 'react-native';

export default function Playground() {

    return (
        <>
            <Stack.Screen options={{ title: 'Playground' }} />
            <Container>
                <View className='gap-4'>
                    <Language />
                    <ThemeSelector />
                </View>
            </Container>
        </>
    );
}
