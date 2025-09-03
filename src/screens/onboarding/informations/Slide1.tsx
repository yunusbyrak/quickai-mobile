import { View, Pressable, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const features = [
    {
        id: 1,
        icon: 'description',
        title: 'Add your content',
        description: 'Upload PDFs or documents with ease.',
        bgColor: 'bg-orange-500/10',
        iconColor: '#FF6700'
    },
    {
        id: 2,
        icon: 'play-circle',
        title: 'Connect videos',
        description: 'Share YouTube links to extract key insights instantly.',
        bgColor: 'bg-red-500/10',
        iconColor: '#EF4444'
    },
    {
        id: 3,
        icon: 'mic',
        title: 'Record audio',
        description: 'Capture voice notes or lectures and turn them into summaries.',
        bgColor: 'bg-orange-500/10',
        iconColor: '#FF6700'
    }
];

export default function Slide1() {
    return (
        <View className="flex-1 justify-center" style={{ width: SCREEN_WIDTH, paddingHorizontal: 16 }}>
            <View className="mb-8">
                <Text className="text-foreground text-2xl font-poppins-bold text-center mb-12">
                    Upload, Link, or Record
                </Text>

                <View className="space-y-6">
                    {features.map((feature) => (
                        <View key={feature.id} className="border border-dashed border-primary/30 rounded-2xl p-6 bg-card/50">
                            <View className="flex-row items-center gap-4">
                                <View className={cn("w-12 h-12 rounded-xl items-center justify-center", feature.bgColor)}>
                                    <MaterialIcons
                                        name={feature.icon as any}
                                        size={24}
                                        color={feature.iconColor}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-foreground text-lg font-poppins-semibold mb-1">
                                        {feature.title}
                                    </Text>
                                    <Text className="text-muted-foreground text-sm font-poppins">
                                        {feature.description}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Floating Action Buttons */}
            <View className="absolute bottom-32 right-6 items-end space-y-4">
                <Pressable className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center">
                    <MaterialIcons name="mic" size={24} color="#FF6700" />
                </Pressable>
                <Pressable className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                    <MaterialIcons name="add" size={32} color="white" />
                </Pressable>
            </View>
        </View>
    );
}
