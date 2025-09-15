import { Text } from "@/components/ui/text";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Summary() {

    const { slug } = useLocalSearchParams<{ slug: string }>();

    return (
        <>
            <Stack.Screen options={{ headerTitle: 'Summary' }} />
            <View>
                <Text>Summary</Text>
                <Text>{slug}</Text>
            </View>
        </>
    )
}
