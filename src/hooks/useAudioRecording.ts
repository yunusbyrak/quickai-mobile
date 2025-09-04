import { useState, useRef, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';

type RecordingState = 'idle' | 'recording' | 'paused';

export const useAudioRecording = () => {
    const router = useRouter();
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);

    const stopRecording = useCallback(async (): Promise<string | null> => {
        if (recording) {
            try {
                const status = await recording.getStatusAsync();
                if (status.canRecord || status.isRecording) {
                    await recording.stopAndUnloadAsync();
                }
                const uri = recording.getURI();
                console.log('🛑 Recording stopped, URI:', uri);
                setRecordingUri(uri);
                setRecording(null);
                setRecordingState('idle');
                return uri;
            } catch (error) {
                console.log('Recording already unloaded or error stopping:', error);
                setRecording(null);
                setRecordingState('idle');
                return null;
            }
        }
        return null;
    }, [recording]);

    const startRecording = useCallback(async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access microphone was denied');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync({
                ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
                isMeteringEnabled: true, // Enable audio level metering
            });
            setRecording(recording);
            setRecordingState('recording');
            console.log('🎤 Recording started');

        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }, []);

    const pauseRecording = useCallback(async () => {
        if (recording && recordingState === 'recording') {
            await recording.pauseAsync();
            setRecordingState('paused');
            console.log('⏸️ Recording paused');
        } else if (recording && recordingState === 'paused') {
            await recording.startAsync();
            setRecordingState('recording');
            console.log('▶️ Recording resumed');
        }
    }, [recording, recordingState]);

    const handleCancel = useCallback(async () => {
        await stopRecording();
        router.back();
    }, [stopRecording, router]);

    const handleDone = useCallback(async () => {
        const uri = await stopRecording();
        // Navigate to preview page with audio URI
        router.push({
            pathname: '/(main)/audio-preview',
            params: { audioUri: uri || '' }
        });
    }, [stopRecording, router]);

    const handleRecordPress = useCallback(() => {
        console.log('🎤 Record button pressed, state:', recordingState);
        if (recordingState === 'idle') {
            console.log('🚀 Starting recording...');
            startRecording();
        }
    }, [recordingState, startRecording]);

    const handlePausePress = useCallback(async () => {
        if (recordingState === 'recording') {
            await pauseRecording();
        } else if (recordingState === 'paused') {
            // Resume recording
            await pauseRecording(); // This will resume since it's paused
        }
    }, [recordingState, pauseRecording]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Stop and cleanup recording safely
            if (recording) {
                recording.getStatusAsync().then(status => {
                    if (status.canRecord || status.isRecording) {
                        recording.stopAndUnloadAsync().catch(console.error);
                    }
                }).catch(console.error);
            }
        };
    }, [recording]);

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                // Pause recording when app goes to background
                if (recordingState === 'recording') {
                    pauseRecording();
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [recordingState]);

    return {
        recordingState,
        recording,
        recordingUri,
        handleCancel,
        handleDone,
        handleRecordPress,
        handlePausePress,
    };
};
