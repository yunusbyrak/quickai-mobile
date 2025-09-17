import { Text } from "@/components/ui/text";
import { useTheme } from "@/context/ThemeContext";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Summary() {
    const { slug, noteId } = useLocalSearchParams<{ slug: string, noteId: string }>();
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <>
            <Stack.Screen
                options={{
                    headerBackButtonDisplayMode: 'minimal',
                    title: slug,
                    headerTransparent: true,
                    headerShown: true,
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <View
                className="flex-1 bg-muted"
                style={{
                    paddingTop: Math.max(insets.top, 16),
                    paddingBottom: Math.max(insets.bottom, 16),
                }}
            >
                <View className="px-4 pt-10">
                    <Text>Summary</Text>
                    <Text>{slug}</Text>
                    <Text>{noteId}</Text>
                </View>
            </View>
        </>
    )
}
