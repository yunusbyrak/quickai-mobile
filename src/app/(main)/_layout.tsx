import { Stack } from "expo-router";
import { Image, View } from "react-native";

export default function Layout() {
    return (
        <View className="flex-1 bg-background">
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="home" />
                <Stack.Screen
                    name="settings"
                    options={{
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="folders/folder-create"
                    options={{
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="folders/folder-edit"
                    options={{
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </View>
    )
}
