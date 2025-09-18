import { Stack } from "expo-router";
import { Image, View } from "react-native";

export default function Layout() {
    return (
        <View className="flex-1 bg-background">
            <Stack
                screenOptions={{
                    headerBackButtonDisplayMode: 'minimal',
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="home"
                />
                <Stack.Screen name="audio-recording" />
                <Stack.Screen name="image-scan" />

                {/* Notes */}
                <Stack.Screen name="notes/detail" options={{ headerShown: true }} />
                <Stack.Screen name="notes/summary" options={{ headerShown: true }} />
                <Stack.Screen
                    name="notes/note-add-folder"
                    options={{
                        presentation: 'modal',
                    }}
                />

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
