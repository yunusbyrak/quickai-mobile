import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus, AudioPlayer } from 'expo-audio';

export interface AudioPlayerState {
    isPlaying: boolean;
    isBuffering: boolean;
    durationMillis: number;
    positionMillis: number;
    sliderValue: number;
    isSeeking: boolean;
    playbackObject: AudioPlayer | null;
}

export interface AudioPlayerActions {
    loadAudio: (uri: string) => Promise<void>;
    play: () => Promise<void>;
    pause: () => Promise<void>;
    togglePlayPause: () => Promise<void>;
    seekTo: (positionMillis: number) => Promise<void>;
    setSliderValue: (value: number) => void;
    setIsSeeking: (isSeeking: boolean) => void;
    cleanup: () => Promise<void>;
}

export const useAudioPlayer = (): AudioPlayerState & AudioPlayerActions => {
    const [audioSource, setAudioSource] = useState<string | null>(null);
    const [isSeeking, setIsSeeking] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);

    const audioPlayer = useExpoAudioPlayer(audioSource);
    const status = useAudioPlayerStatus(audioPlayer);

    // Update state based on audio player status
    useEffect(() => {
        if (status.isLoaded && !isSeeking) {
            // Convert seconds to milliseconds for consistency
            const currentTimeMs = status.currentTime * 1000;
            const durationMs = status.duration * 1000;
            setSliderValue(currentTimeMs / durationMs || 0);
        }
    }, [status.currentTime, status.duration, status.isLoaded, status.playing, status.isBuffering, isSeeking]);

    const loadAudio = useCallback(async (uri: string) => {
        try {
            setAudioSource(uri);
        } catch (error) {
            console.error('Failed to load audio:', error);
        }
    }, []);

    const play = useCallback(async () => {
        try {
            await audioPlayer.play();
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    }, [audioPlayer]);

    const pause = useCallback(async () => {
        try {
            await audioPlayer.pause();
        } catch (error) {
            console.error('Failed to pause audio:', error);
        }
    }, [audioPlayer]);

    const togglePlayPause = useCallback(async () => {
        if (status.playing) {
            await pause();
        } else {
            await play();
        }
    }, [status.playing, play, pause]);

    const seekTo = useCallback(async (positionMillis: number) => {
        try {
            // Convert milliseconds to seconds for expo-audio
            const positionSeconds = positionMillis / 1000;
            await audioPlayer.seekTo(positionSeconds);
        } catch (error) {
            console.error('Failed to seek audio:', error);
        }
    }, [audioPlayer]);

    const handleSeek = useCallback((value: number) => {
        // Clamp value between 0 and 1
        const clampedValue = Math.max(0, Math.min(1, value));
        setSliderValue(clampedValue);
    }, []);

    const handleSeekStart = useCallback(() => {
        setIsSeeking(true);
    }, []);

    const handleSeekComplete = useCallback(async () => {
        if (status.duration > 0) {
            // Convert seconds to milliseconds for seekTo
            const positionMillis = sliderValue * (status.duration * 1000);
            await seekTo(positionMillis);
        }
        setIsSeeking(false);
    }, [status.duration, sliderValue, seekTo]);

    const cleanup = useCallback(async () => {
        try {
            setAudioSource(null);
            setIsSeeking(false);
            setSliderValue(0);
        } catch (error) {
            console.error('Failed to cleanup audio:', error);
        }
    }, []);

    // Memoize slider value calculation to prevent unnecessary re-renders
    const calculatedSliderValue = useMemo(() => {
        if (isSeeking) {
            return sliderValue;
        }
        if (status.duration > 0) {
            return status.currentTime / status.duration;
        }
        return 0;
    }, [isSeeking, sliderValue, status.currentTime, status.duration]);

    return {
        // State
        isPlaying: status.playing || false,
        isBuffering: status.isBuffering || false,
        durationMillis: (status.duration || 0) * 1000, // Convert seconds to milliseconds
        positionMillis: (status.currentTime || 0) * 1000, // Convert seconds to milliseconds
        sliderValue: calculatedSliderValue,
        isSeeking,
        playbackObject: audioPlayer,

        // Actions
        loadAudio,
        play,
        pause,
        togglePlayPause,
        seekTo,
        setSliderValue: handleSeek,
        setIsSeeking: handleSeekStart,
        cleanup,
    };
};
