import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AudioWave } from '@/components/audio/AudioWave';
import { LanguageSelector } from '@/components/LanguageSelector';
import { RecordingStatus } from '@/components/audio/RecordingStatus';
import { RecordingControls } from '@/components/audio/RecordingControls';
import { Text } from '@/components/ui/text';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { translationLanguages } from '@/constants/language';

export default function AudioRecording() {
    const insets = useSafeAreaInsets();
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('auto');

    const {
        recordingState,
        recording,
        handleCancel,
        handleDone,
        handleRecordPress,
        handlePausePress,
    } = useAudioRecording();

    const handleLanguageSelect = (languageCode: string) => {
        setSelectedLanguage(languageCode);
        console.log('Selected language:', languageCode);
    };

    const handleAutoSelect = () => {
        setSelectedLanguage('auto');
        console.log('Auto language detection selected');
    };

    const getSelectedLanguageName = () => {
        if (selectedLanguage === 'auto') return 'Auto';
        const language = translationLanguages.find(lang => lang.code === selectedLanguage);
        return language?.language || 'Auto';
    };

    const getSelectedLanguageFlag = () => {
        if (selectedLanguage === 'auto') return '🌐';
        const language = translationLanguages.find(lang => lang.code === selectedLanguage);
        return language?.flag || '🌐';
    };

    return (
        <View
            className="flex-1 bg-background"
            style={{ paddingTop: insets.top }}
        >
            {/* Recording Status and Date */}
            <RecordingStatus
                recordingState={recordingState}
            />

            {/* Language Selector Trigger */}
            <View className="absolute top-16 right-4">
                <Pressable
                    onPress={() => setShowLanguageSelector(true)}
                    className="flex-row items-center gap-2 bg-card px-3 py-2 rounded-full border border-border"
                >
                    <Text className="text-lg">{getSelectedLanguageFlag()}</Text>
                    <Text className="text-sm font-medium text-foreground">
                        {getSelectedLanguageName()}
                    </Text>
                    <MaterialIcons
                        name="keyboard-arrow-down"
                        size={16}
                        color="#9CA3AF"
                    />
                </Pressable>
            </View>

            {/* Language Selector Modal */}
            <LanguageSelector
                languages={translationLanguages}
                selectedLanguage={selectedLanguage}
                onLanguageSelect={handleLanguageSelect}
                onAutoSelect={handleAutoSelect}
                showAutoOption={true}
                isVisible={showLanguageSelector}
                onClose={() => setShowLanguageSelector(false)}
                title="Language"
                searchPlaceholder="Search language"
            />

            {/* Audio Wave Visualization */}
            <AudioWave
                isRecording={recordingState === 'recording'}
                isPaused={recordingState === 'paused'}
                recording={recording}
            />

            {/* Bottom Controls */}
            <RecordingControls
                recordingState={recordingState}
                recordingTime={0}
                onCancel={handleCancel}
                onDone={handleDone}
                onRecord={handleRecordPress}
                onPause={handlePausePress}
            />
        </View>
    );
}
