import { View, Pressable, Dimensions } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Slide2() {
    const [activeTab, setActiveTab] = useState('Summary');
    const tabs = ['Summary', 'Chat', 'Flashcards'];

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
                    {tabs.map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 py-3 rounded-xl items-center",
                                activeTab === tab ? "bg-primary" : ""
                            )}
                        >
                            <Text className={cn(
                                "font-poppins-medium",
                                activeTab === tab ? "text-white" : "text-muted-foreground"
                            )}>
                                {tab}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Content */}
                <View className="bg-card/30 rounded-2xl p-6">
                    <Text className="text-foreground font-poppins leading-6">
                        Imagine diving into a 200-page document and emerging with all the essential insights in just a few minutes. We've distilled the heart of your material into a concise, clear summary—capturing key points, intriguing insights, and the ideas that truly matter. It's like having an experienced guide navigate the maze of information, so you can get straight to what matters most.
                    </Text>
                </View>

                <Text className="text-foreground text-2xl font-poppins-bold mt-8 mb-4">
                    Save Time
                </Text>
                <Text className="text-muted-foreground font-poppins">
                    Extract key insights from texts, videos, and audio in seconds. Less noise — more results.
                </Text>
            </View>
        </View>
    );
}
