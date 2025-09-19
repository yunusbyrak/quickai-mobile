import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import {
  Button,
  Pressable,
  Text,
  View,
  Modal,
  ScrollView,
  Alert,
  Image as RNImage,
} from 'react-native';
import { Image } from 'expo-image';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { imageTranscribe } from '@/services/transcribe.service';
import LoaderModal from '@/components/LoaderModal';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [showPhotoList, setShowPhotoList] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-center">We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (isCapturing) return; // Prevent multiple captures

    try {
      if (!ref.current) {
        return;
      }

      setIsCapturing(true);

      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Flash effect
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);

      const photo = await ref.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        setPhotos((prev) => [...prev, photo.uri]);

        // Success haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsCapturing(false);
    }
  };

  const deletePhoto = (index: number) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setPhotos((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const getLastPhoto = () => {
    return photos.length > 0 ? photos[photos.length - 1] : null;
  };

  const onDone = async () => {
    try {
      setLoading(true);
      await imageTranscribe({
        imageFiles: photos.map(
          (photo) =>
            ({
              uri: photo,
              type: 'image/jpeg',
              name: photo,
            }) as any
        ),
      });
      router.back();
    } catch (error) {
      console.error('Error transcribing images:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCamera = () => {
    const lastPhoto = getLastPhoto();

    return (
      <View className="absolute inset-0">
        <LoaderModal isVisible={loading} title="Transcribing images..." />
        <CameraView
          style={{ flex: 1 }}
          ref={ref}
          mode="picture"
          facing="back"
          mute={false}
          responsiveOrientationWhenOrientationLocked
        />

        {/* Flash effect */}
        {showFlash && <View className="absolute inset-0 bg-white opacity-80" />}

        {/* Close button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute left-4 top-12 h-10 w-10 items-center justify-center rounded-full bg-black/50">
          <FontAwesome6 name="xmark" size={20} color="white" />
        </Pressable>

        {/* Done button */}
        <Pressable
          onPress={onDone}
          className="absolute right-4 top-12 rounded-full bg-green-500 px-4 py-2">
          <Text className="text-lg font-semibold text-white">Done</Text>
        </Pressable>

        <View className="absolute bottom-11 left-0 w-full flex-row items-center justify-center px-8">
          {/* Photo gallery - positioned absolutely to the left */}
          <Pressable
            onPress={() => setShowPhotoList(true)}
            className="absolute left-8 h-16 w-16 rounded-lg border-2 border-white">
            {lastPhoto ? (
              <View className="h-full w-full overflow-hidden rounded-lg">
                <RNImage
                  source={{ uri: lastPhoto }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View className="h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gray-300">
                <FontAwesome6 name="image" size={20} color="white" />
              </View>
            )}

            {/* Count badge */}
            {photos.length > 0 && (
              <View className="absolute -right-1 -top-1 z-10 h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1">
                <Text className="text-xs font-bold text-white">
                  {photos.length > 99 ? '99+' : photos.length}
                </Text>
              </View>
            )}
          </Pressable>

          {/* Capture button - centered */}
          <Pressable onPress={takePicture} disabled={isCapturing}>
            {({ pressed }) => (
              <View
                className={cn(
                  'h-[85px] w-[85px] items-center justify-center rounded-[45px] border-4 border-white bg-transparent',
                  pressed ? 'opacity-50' : 'opacity-100',
                  isCapturing ? 'opacity-70' : 'opacity-100'
                )}>
                <View
                  className={cn(
                    'h-[70px] w-[70px] rounded-[50px] bg-white',
                    isCapturing
                      ? 'h-[60px] w-[60px] rounded-[30px]'
                      : 'h-[70px] w-[70px] rounded-[50px]'
                  )}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  const renderPhotoListModal = () => {
    return (
      <Modal
        visible={showPhotoList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPhotoList(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <Text className="text-lg font-semibold">Photos ({photos.length})</Text>
            <Pressable onPress={() => setShowPhotoList(false)}>
              <FontAwesome6 name="xmark" size={24} color="black" />
            </Pressable>
          </View>

          {photos.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <FontAwesome6 name="image" size={64} color="gray" />
              <Text className="mt-4 text-lg text-gray-500">No photos taken yet</Text>
            </View>
          ) : (
            <ScrollView className="flex-1 p-4">
              <View className="flex-row flex-wrap justify-start gap-3">
                {photos.map((photo, index) => (
                  <View key={index} className="mb-2 w-[31%]">
                    <Image
                      source={{ uri: photo }}
                      style={{ width: '100%', aspectRatio: 1, borderRadius: 10 }}
                      contentFit="cover"
                    />
                    <Pressable
                      onPress={() => deletePhoto(index)}
                      className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-red-500">
                      <FontAwesome6 name="trash" size={16} color="white" />
                    </Pressable>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {renderCamera()}
      {renderPhotoListModal()}
    </View>
  );
}
