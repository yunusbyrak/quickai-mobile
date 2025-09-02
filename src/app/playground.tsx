import { Stack, useLocalSearchParams } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';

export default function Playground() {
  const { name } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: 'Playground' }} />
      <Container>
        <ScreenContent path="screens/playground.tsx" title={`Showing Playground for user ${name}`} />
      </Container>
    </>
  );
}
