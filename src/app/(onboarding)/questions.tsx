import { View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';


export default function Questions() {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1 bg-background px-4"
            style={{
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 16),
            }}
        >


            {/* Fixed CTA Button */}
            <View className="pb-4">
                <Button
                    className="w-full h-14 rounded-2xl"
                >
                    <Text className="text-white text-lg font-poppins-semibold">
                        Get Started
                    </Text>
                </Button>
            </View>
        </View>
    );
}
