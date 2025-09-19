import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Text } from './ui/text';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { HapticButton } from './ui/haptic-button';
import { THEME } from '@/lib/theme';
import { SvgIcon } from './ui/svg-icon';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import LoaderModal from './LoaderModal';
import { pdfTranscribe, uploadAudioTranscribe } from '@/services/youtube.service';
import { transcribeAudio } from '@/services/audio.service';

const getIconForNoteType = (type: string | null) => {
  switch (type) {
    case 'audio':
      return 'graphic-eq';
    case 'pdf':
      return 'picture-as-pdf';
    case 'youtube':
      return 'play-circle-outline';
    case 'image':
      return 'image';
    case 'website':
      return 'language';
    case 'meet':
    case 'zoom':
    case 'teams':
      return 'videocam';
    default:
      return 'graphic-eq';
  }
};

const getColorForNoteType = (type: string | null) => {
  switch (type) {
    case 'audio':
      return '#FF6B35';
    case 'pdf':
      return '#E53E3E';
    case 'youtube':
      return '#FF0000';
    case 'image':
      return '#805AD5';
    case 'website':
      return '#38A169';
    case 'meet':
    case 'zoom':
    case 'teams':
      return '#3182CE';
    default:
      return '#FF6B35';
  }
};

const renderNoteIcon = (
  type: string | null,
  size: number,
  color: string,
  status: string | null
) => {
  if (status === 'running') {
    return <ActivityIndicator size="small" color={color} />;
  }

  if (status === 'failed') {
    return <MaterialIcons name="error" size={size} color={'red'} />;
  }

  // Use SVG icons for specific types
  if (type === 'youtube' || type === 'image' || type === 'pdf') {
    return <SvgIcon name={type as 'youtube' | 'image' | 'pdf'} size={size} color={color} />;
  }

  // Use MaterialIcons for other types
  const iconName = getIconForNoteType(type) as any;
  return <MaterialIcons name={iconName} size={size} color={color} />;
};

interface NoteOption {
  id: string;
  title: string;
  description: string;
  type: string;
  iconType: 'svg' | 'material' | 'ionic';
  iconName?: string;
  onPress: () => void;
}

export default function NoteAddModal() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const snapPoints = useMemo(() => ['65%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  // Menu action handlers
  const handleRecordAudio = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    console.log('Record Audio pressed');
    router.push('/audio-recording');
    // router.push('/audio-test');
  }, []);

  const handleTakePicture = useCallback(() => {
    console.log('Take Picture pressed');
    bottomSheetModalRef.current?.dismiss();
    router.push('/image-scan');
  }, []);

  const handleUploadPDF = useCallback(async () => {
    try {
      bottomSheetModalRef.current?.dismiss();
      setIsLoading(true);
      setLoadingTitle('Uploading PDF...');

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        console.log('Selected PDF:', {
          name: file.name,
          size: file.size,
          uri: file.uri,
          mimeType: file.mimeType,
        });
        await pdfTranscribe({
          pdfFile: {
            uri: file.uri,
            type: file.mimeType || 'application/pdf',
            name: file.name,
          } as any,
        });
      }
    } catch (error) {
      console.error('Error picking PDF:', error);
      Alert.alert('Error', 'Failed to pick PDF document');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEnterText = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    router.push('/text-note');
  }, []);

  const handleYouTubeVideo = useCallback(() => {
    console.log('YouTube Video pressed');
    bottomSheetModalRef.current?.dismiss();
    router.push('/youtube-transcribe');
  }, []);

  const handleUploadImage = useCallback(async () => {
    try {
      bottomSheetModalRef.current?.dismiss();

      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const images = result.assets;
        console.log(
          'Selected Images:',
          images.map((image) => ({
            uri: image.uri,
            width: image.width,
            height: image.height,
            fileSize: image.fileSize,
            type: image.type,
          }))
        );

        // TODO: Process the images here
        // You can add your image processing logic here
        Alert.alert('Images Selected', `Selected ${images.length} image(s)`);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  }, []);

  const handleUploadAudio = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        bottomSheetModalRef.current?.dismiss();

        await uploadAudioTranscribe({
          audioFile: {
            uri: file.uri,
            type: file.mimeType || 'audio/*',
            name: file.name,
          } as any,
        });
      }
    } catch (error) {
      console.error('Error picking audio:', error);
      Alert.alert('Error', 'Failed to pick audio from device');
    }
  }, []);

  const handleUploadViaURL = useCallback(() => {
    console.log('Upload via URL pressed');
    bottomSheetModalRef.current?.dismiss();
  }, []);

  // Note options array
  const noteOptions: NoteOption[] = [
    {
      id: 'record-audio',
      title: 'Record Audio',
      description: 'Start recording your voice',
      type: 'audio',
      iconType: 'svg',
      onPress: handleRecordAudio,
    },
    {
      id: 'take-picture',
      title: 'Take Picture',
      description: 'Capture a photo with camera',
      type: 'image',
      iconType: 'svg',
      onPress: handleTakePicture,
    },
    {
      id: 'upload-pdf',
      title: 'Upload PDF',
      description: 'Select a PDF document',
      type: 'pdf',
      iconType: 'svg',
      onPress: handleUploadPDF,
    },
    {
      id: 'enter-text',
      title: 'Enter Text',
      description: 'Type or paste your text',
      type: 'text',
      iconType: 'ionic',
      iconName: 'text-outline',
      onPress: handleEnterText,
    },
    {
      id: 'youtube-video',
      title: 'Use YouTube Video',
      description: 'Add a YouTube video URL',
      type: 'youtube',
      iconType: 'svg',
      onPress: handleYouTubeVideo,
    },
    {
      id: 'upload-image',
      title: 'Upload Image',
      description: 'Select from gallery',
      type: 'image',
      iconType: 'material',
      iconName: 'photo-library',
      onPress: handleUploadImage,
    },
    {
      id: 'upload-audio',
      title: 'Upload Audio',
      description: 'Select audio file from device',
      type: 'audio',
      iconType: 'material',
      iconName: 'audiotrack',
      onPress: handleUploadAudio,
    },
    // {
    //     id: 'upload-url',
    //     title: 'Upload via URL',
    //     description: 'Website, recording, PDF, image file',
    //     type: 'website',
    //     iconType: 'svg',
    //     onPress: handleUploadViaURL
    // }
  ];

  // Helper function to render icon based on type
  const renderOptionIcon = (option: NoteOption) => {
    // const color = getColorForNoteType(option.type);
    const color = '#333';

    if (option.iconType === 'svg') {
      return renderNoteIcon(option.type, 20, color, null);
    } else if (option.iconType === 'material' && option.iconName) {
      return <MaterialIcons name={option.iconName as any} size={20} color={color} />;
    } else if (option.iconType === 'ionic' && option.iconName) {
      return <Ionicons name={option.iconName as any} size={20} color={color} />;
    }

    return renderNoteIcon(option.type, 20, color, null);
  };

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  return (
    <>
      <LoaderModal size="medium" isVisible={isLoading} title={loadingTitle} />
      <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-center bg-transparent px-4 pt-4">
        <HapticButton
          onPress={handlePresentModalPress}
          className="h-12 flex-row items-center justify-center gap-2 rounded-full bg-foreground px-6">
          <MaterialIcons name="add" size={24} color="white" />
          <Text className="font-medium text-background">New Note</Text>
        </HapticButton>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: THEME.light.muted,
        }}>
        <BottomSheetView className="h-full gap-3 px-4 py-2">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold">New Notes</Text>
            <HapticButton
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-200"
              onPress={() => bottomSheetModalRef.current?.dismiss()}>
              <Ionicons name="close-outline" size={24} color={THEME.light.ring} />
            </HapticButton>
          </View>

          {/* Content */}
          <ScrollView className="h-full flex-1" showsVerticalScrollIndicator={false}>
            <View className="gap-2 pb-10">
              {noteOptions.map((option) => (
                <HapticButton
                  key={option.id}
                  className={cn(' rounded-lg bg-background p-3 shadow-sm shadow-black/5 ')}
                  onPress={option.onPress}>
                  <View className="flex-row items-center gap-3">
                    <View
                      className={cn('h-10 w-10 items-center justify-center rounded-lg bg-muted')}>
                      {renderOptionIcon(option)}
                    </View>
                    <View className="flex-1 flex-col gap-1">
                      <Text
                        variant="small"
                        className="text-start font-semibold text-foreground"
                        numberOfLines={1}>
                        {option.title}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xs text-muted-foreground">{option.description}</Text>
                      </View>
                    </View>
                  </View>
                </HapticButton>
              ))}
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
