import { Stack, useLocalSearchParams } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';
import Language from '@/components/playground/language';

export default function Playground() {
    const { name } = useLocalSearchParams();

    return (
        <>
            <Stack.Screen options={{ title: 'Playground' }} />
            <Container>
                <Language />
            </Container>
        </>
    );
}
