import { View, Pressable, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Slide3() {
    return (
        <View className="flex-1 justify-center" style={{ width: SCREEN_WIDTH, paddingHorizontal: 16 }}>
            <View className="mb-8">
                {/* Header */}
                <View className="bg-card/50 rounded-2xl p-4 mb-6">
                    <View className="flex-row items-center gap-3">
                        <View className="w-8 h-8 bg-orange-500/10 rounded items-center justify-center">
                            <MaterialIcons name="description" size={16} color="#FF6700" />
                        </View>
                        <Text className="text-foreground font-poppins-medium">
                            Your PDF, Condensed
                        </Text>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row bg-card/30 rounded-2xl p-1 mb-6">
                    <Pressable className="flex-1 py-3 rounded-xl items-center">
                        <Text className="text-muted-foreground font-poppins-medium">Summary</Text>
                    </Pressable>
                    <Pressable className="flex-1 py-3 rounded-xl items-center bg-primary">
                        <Text className="text-white font-poppins-medium">Chat</Text>
                    </Pressable>
                    <Pressable className="flex-1 py-3 rounded-xl items-center">
                        <Text className="text-muted-foreground font-poppins-medium">Flashcards</Text>
                    </Pressable>
                </View>

                {/* Chat Interface */}
                <View className="gap-4 mb-8">
                    {/* User Question */}
                    <View className="bg-primary rounded-2xl rounded-br-md p-4 self-end max-w-[80%]">
                        <Text className="text-white font-poppins">
                            Why do we get "brain freeze" when eating something cold too quickly?
                        </Text>
                    </View>

                    {/* AI Response */}
                    <View className="bg-card/50 rounded-2xl rounded-bl-md p-4 self-start max-w-[90%]">
                        <Text className="text-foreground font-poppins leading-5">
                            Brain freeze, or "ice cream headache," happens when something cold touches the roof of your mouth (the palate). The sudden drop in temperature causes blood vessels in the area to constrict and then rapidly dilate, which triggers pain signals to your brain...
                        </Text>
                    </View>
                </View>

                <Text className="text-foreground text-2xl font-poppins-bold mb-4">
                    Instant Answers
                </Text>
                <Text className="text-muted-foreground font-poppins">
                    Got questions about your content? Use our smart chat to dive deeper into the details of your uploaded materials. Just ask, and receive tailored insights right away!
                </Text>
            </View>
        </View>
    );
}
