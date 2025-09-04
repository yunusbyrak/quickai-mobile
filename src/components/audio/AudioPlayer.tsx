import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import { Text } from '@/components/ui/text';

interface AudioPlayerProps {
  audioUri?: string;
  onPositionUpdate?: (position: number) => void;
  onDurationUpdate?: (duration: number) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export const AudioPlayer = React.memo(({
  audioUri,
  onPositionUpdate,
  onDurationUpdate,
  onPlaybackStateChange,
}: AudioPlayerProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingPlayback, setIsLoadingPlayback] = useState(false);
  const positionUpdateRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Load audio when component mounts or audioUri changes
  useEffect(() => {
    const loadAudio = async () => {
      if (!audioUri) return;

      try {
        // Configure audio mode for optimal playback
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          {
            shouldPlay: false,
            isLooping: false,
            volume: 1.0,
            rate: 1.0,
            shouldCorrectPitch: true,
            progressUpdateIntervalMillis: 100,
          },
          (status) => {
            // Status update callback for better loading feedback
            if (status.isLoaded) {
              console.log('🎵 Audio status update:', status.positionMillis, '/', status.durationMillis);
            }
          }
        );

        setSound(newSound);

        // Get duration and prepare for quick playback
        const status = await newSound.getStatusAsync();
        if (status.isLoaded) {
          const durationMs = status.durationMillis || 0;
          setDuration(durationMs);
          onDurationUpdate?.(durationMs);

          // Pre-buffer audio by loading it fully into memory
          // This significantly reduces play delay
          try {
            await newSound.playAsync();
            await newSound.pauseAsync();
            await newSound.setPositionAsync(0);
            console.log('🚀 Audio pre-buffered for instant playback');
          } catch (bufferError) {
            console.log('Pre-buffer failed, but audio is still playable:', bufferError);
          }

          setIsLoaded(true);
          console.log('🎵 Audio loaded and pre-buffered, duration:', durationMs + 'ms');
        }
      } catch (error) {
        console.error('Failed to load audio:', error);
      }
    };

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionUpdateRef.current) {
        clearInterval(positionUpdateRef.current);
      }
    };
  }, [audioUri]);

  // Position tracking with optimized frequency
  useEffect(() => {
    if (isPlaying && sound) {
      positionUpdateRef.current = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.positionMillis !== undefined) {
          setPosition(status.positionMillis);
          onPositionUpdate?.(status.positionMillis);

          // Stop if reached end
          if (status.didJustFinish) {
            setIsPlaying(false);
            onPlaybackStateChange?.(false);
          }
        }
      }, 50); // More frequent updates for smoother progress bar
    } else {
      if (positionUpdateRef.current) {
        clearInterval(positionUpdateRef.current);
        positionUpdateRef.current = null;
      }
    }

    return () => {
      if (positionUpdateRef.current) {
        clearInterval(positionUpdateRef.current);
      }
    };
  }, [isPlaying, sound]);

  const handlePlayPause = async () => {
    if (!sound || !isLoaded) return;

    setIsLoadingPlayback(true);

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        onPlaybackStateChange?.(false);
      } else {
        // Instant play since audio is pre-buffered
        await sound.playAsync();
        setIsPlaying(true);
        onPlaybackStateChange?.(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    } finally {
      // Reduce loading feedback time for better UX
      setTimeout(() => {
        setIsLoadingPlayback(false);
      }, 100);
    }
  };

  const handleSkipForward = async () => {
    if (!sound || !isLoaded) return;

    const newPosition = Math.min(position + 10000, duration);
    try {
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
      onPositionUpdate?.(newPosition);
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  };

  const handleSkipBackward = async () => {
    if (!sound || !isLoaded) return;

    const newPosition = Math.max(position - 10000, 0);
    try {
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
      onPositionUpdate?.(newPosition);
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  };

  if (!audioUri) {
    return (
      <View className="bg-white rounded-2xl p-4 border border-gray-200">
        <Text className="text-center text-gray-500">No audio available</Text>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View className="bg-white rounded-2xl p-4 border border-gray-200">
        <Text className="text-center text-gray-500">Loading audio...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-200">
      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-600">
            {formatTime(position)}
          </Text>
          <Text className="text-sm text-gray-600">
            {formatTime(duration)}
          </Text>
        </View>
        <View className="h-1 bg-gray-200 rounded-full">
          <View
            className="h-1 bg-orange-500 rounded-full"
            style={{ width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }}
          />
        </View>
      </View>

      {/* Playback Controls */}
      <View className="flex-row items-center justify-center gap-8">
        <TouchableOpacity
          onPress={handleSkipBackward}
          className="w-12 h-12 items-center justify-center"
          disabled={!isLoaded}
        >
          <MaterialIcons name="replay-10" size={28} color={isLoaded ? "#666" : "#ccc"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center"
          disabled={!isLoaded || isLoadingPlayback}
          style={{ opacity: isLoaded && !isLoadingPlayback ? 1 : 0.5 }}
        >
          {isLoadingPlayback ? (
            <MaterialIcons name="refresh" size={24} color="white" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="white"
              style={{ marginLeft: isPlaying ? 0 : 2 }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkipForward}
          className="w-12 h-12 items-center justify-center"
          disabled={!isLoaded}
        >
          <MaterialIcons name="forward-10" size={28} color={isLoaded ? "#666" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

AudioPlayer.displayName = 'AudioPlayer';
