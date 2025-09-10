import { Text } from "@/components/ui/text";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoteDetail() {
    const insets = useSafeAreaInsets()
    return (
        <View
            className='flex-1 bg-muted'
            style={{
                paddingTop: Math.max(insets.top, 16),
                paddingBottom: Math.max(insets.bottom, 16),
            }}
        >
            {/* Header Gradient Image */}
            <View className="absolute top-0 left-0 right-0 items-center">
                <Image
                    source={require('~/assets/images/header-gradient.png')}
                    className="w-full"
                    resizeMode="cover"
                />
            </View>
        </View>
    )
}
