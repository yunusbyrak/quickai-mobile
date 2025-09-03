import { Stack } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';
import Language from '@/components/playground/language';
import ThemeSelector from '@/components/playground/theme-selector';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function Playground() {

    return (
        <>
            <View className='gap-4 bg-background p-6 h-full'>
                <Language />
                <ThemeSelector />
                <Button>
                    <Text>Button</Text>
                </Button>
            </View>

        </>
    );
}
