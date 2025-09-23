import { SvgIcon } from "@/components";
import { Text } from "@/components/ui/text";
import Modal from "@/components/ui/modal";
import { useImageDetail } from "@/hooks/useDetailsHook";
import { Note } from "@/types/note";
import { View, Image, Pressable, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface ImageDetailProps {
    note: Note;
}

export default function ImageDetail({ note }: ImageDetailProps) {
    const { data: imageDetail, isLoading, error } = useImageDetail(note.id);
    const screenHeight = Dimensions.get('window').height;
    const [isModalVisible, setIsModalVisible] = useState(false);

    if (isLoading) {
        return (
            <View className="flex-1 mb-2">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 mb-2">
                <Text>Error loading images: {error.message}</Text>
            </View>
        );
    }

    if (!imageDetail?.imageUrls || imageDetail.imageUrls.length === 0) {
        return (
            <View className="flex-1 mb-2">
                <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4">
                    <Text>No images available</Text>
                </View>
            </View>
        );
    }

    const images = imageDetail.imageUrls;
    const displayImages = images.slice(0, 3);
    const remainingCount = images.length - 3;

    const renderImageGrid = () => {
        if (images.length === 1) {
            return (
                <View className="w-full">
                    <Pressable className="w-full">
                        <Image
                            source={{ uri: images[0] }}
                            className="w-full h-32 rounded-lg"
                            resizeMode="cover"
                        />
                    </Pressable>
                </View>
            );
        }

        if (images.length === 2) {
            return (
                <View className="flex-row gap-2">
                    {displayImages.map((imageUrl, index) => (
                        <Pressable key={index} className="flex-1">
                            <Image
                                source={{ uri: imageUrl }}
                                className="w-full h-24 rounded-lg"
                                resizeMode="cover"
                            />
                        </Pressable>
                    ))}
                </View>
            );
        }

        // 3 or more images
        return (
            <View className="gap-2">
                {/* First row - single large image */}
                <Pressable>
                    <Image
                        source={{ uri: images[0] }}
                        className="w-full h-32 rounded-lg"
                        resizeMode="cover"
                    />
                </Pressable>

                {/* Second row - two smaller images */}
                <View className="flex-row gap-2">
                    <Pressable className="flex-1">
                        <Image
                            source={{ uri: images[1] }}
                            className="w-full h-24 rounded-lg"
                            resizeMode="cover"
                        />
                    </Pressable>

                    <Pressable className="flex-1 relative">
                        <Image
                            source={{ uri: images[2] }}
                            className="w-full h-24 rounded-lg"
                            resizeMode="cover"
                        />
                        {remainingCount > 0 && (
                            <View className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                <Text className="text-white text-base font-semibold">
                                    +{remainingCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>
        );
    };

    // TODO implement additional images
    return (
        <>
            <View className="flex-1 mb-2">
                <View className="w-full bg-background rounded-lg shadow-sm shadow-black/5 p-4">
                    {renderImageGrid()}

                    <View className="flex-row justify-between items-center mt-3">
                        <Pressable
                            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full"
                            onPress={() => setIsModalVisible(true)}
                        >
                            <Text className="text-foreground text-sm font-medium">View All</Text>
                        </Pressable>

                        <Pressable className="bg-gray-200 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center">

                            <Ionicons name="add-outline" size={24} color="black" />
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* Modal for viewing all images */}
            <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide">
                <SafeAreaView className="flex-1 bg-background">
                    <View className="flex-1">
                        {/* Header */}
                        <View className="flex-row justify-between items-center p-4 border-b border-border">
                            <Text className="text-xl font-semibold text-foreground">
                                All Images ({images.length})
                            </Text>
                            <Pressable
                                onPress={() => setIsModalVisible(false)}
                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                            >
                                <Ionicons name="close-outline" size={24} color="black" />
                            </Pressable>
                        </View>

                        {/* Images Grid */}
                        <ScrollView className="flex-1 p-4">
                            <View className="flex-row flex-wrap gap-4">
                                {images.map((imageUrl, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: imageUrl }}
                                        resizeMode="contain"
                                        style={{
                                            height: screenHeight / 1.7,
                                            width: "100%",
                                        }}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
}
