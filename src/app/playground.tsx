import { Stack } from 'expo-router';

import Language from '@/components/playground/language';
import ThemeSelector from '@/components/playground/theme-selector';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { HapticButton } from '@/components/ui/haptic-button';

export default function Playground() {

    return (
        <>
            <View className='gap-4 bg-background p-6 h-full'>
                <Language />
                <ThemeSelector />
                <Button>
                    <Text>Button</Text>
                </Button>

                {/* HapticButton as a wrapper - no styling, just haptic feedback */}
                <HapticButton hapticType="medium" onPress={() => console.log('Haptic wrapper pressed!')}>
                    <Button>
                        <Text>Button with Haptic</Text>
                    </Button>
                </HapticButton>

                <HapticButton hapticType="heavy" onPress={() => console.log('Heavy haptic wrapper!')}>
                    <View className="bg-primary p-4 rounded-md">
                        <Text className="text-white text-center">Custom Styled with Haptic</Text>
                    </View>
                </HapticButton>
            </View>
        </>
    );
}
