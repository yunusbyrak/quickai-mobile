import React, { useState, useEffect, useRef } from 'react';
import {
  AudioContext,
  AnalyserNode,
  AudioBuffer,
  AudioBufferSourceNode,
} from 'react-native-audio-api';
import { ActivityIndicator, View } from 'react-native';

import FreqTimeChart from './FreqTimeChart';
import { Button } from '@/components/ui/button';
import { Text } from '../ui/text';


const FFT_SIZE = 512;

const URL =
  'https://software-mansion.github.io/react-native-audio-api/audio/music/example-music-02.mp3';

const AudioVisualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const [times, setTimes] = useState<Uint8Array>(
    new Uint8Array(FFT_SIZE).fill(127)
  );
  const [freqs, setFreqs] = useState<Uint8Array>(
    new Uint8Array(FFT_SIZE / 2).fill(0)
  );

  const [startTime, setStartTime] = useState(0);
  const [offset, setOffset] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      const stopTime = audioContextRef.current!.currentTime;
      bufferSourceRef.current?.stop(stopTime);
      setOffset((prev) => prev + stopTime - startTime);
    } else {
      if (!audioContextRef.current || !analyserRef.current) {
        return;
      }

      if (!audioBuffer) {
        fetchAudioBuffer();
      }

      bufferSourceRef.current = audioContextRef.current.createBufferSource();
      bufferSourceRef.current.buffer = audioBuffer;
      bufferSourceRef.current.connect(analyserRef.current);

      setStartTime(audioContextRef.current.currentTime);
      bufferSourceRef.current.start(startTime, offset);

      requestAnimationFrame(draw);
    }

    setIsPlaying((prev) => !prev);
  };

  const draw = () => {
    if (!analyserRef.current) {
      return;
    }

    const timesArrayLength = analyserRef.current.fftSize;
    const frequencyArrayLength = analyserRef.current.frequencyBinCount;

    const timesArray = new Uint8Array(timesArrayLength);
    analyserRef.current.getByteTimeDomainData(timesArray);
    setTimes(timesArray);

    const freqsArray = new Uint8Array(frequencyArrayLength);
    analyserRef.current.getByteFrequencyData(freqsArray);
    setFreqs(freqsArray);

    requestAnimationFrame(draw);
  };

  const fetchAudioBuffer = async () => {
    setIsLoading(true);

    const buffer = await fetch(URL)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        audioContextRef.current!.decodeAudioData(arrayBuffer)
      )
      .catch((error) => {
        console.error('Error decoding audio data source:', error);
        return null;
      });

    setAudioBuffer(buffer);

    setIsLoading(false);
  };

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = FFT_SIZE;
      analyserRef.current.smoothingTimeConstant = 0.2;

      analyserRef.current.connect(audioContextRef.current.destination);
    }

    fetchAudioBuffer();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <View >
      <View style={{ flex: 0.2 }} />
      <FreqTimeChart
        timeData={times}
        frequencyData={freqs}
        fftSize={analyserRef.current?.fftSize || FFT_SIZE}
        frequencyBinCount={
          analyserRef.current?.frequencyBinCount || FFT_SIZE / 2
        }
      />
      <View
        style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}
      >
        {isLoading && <ActivityIndicator color="#FFFFFF" />}
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Button
            onPress={handlePlayPause}
            disabled={!audioBuffer}
          >
            <Text className="text-white text-lg font-medium">
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AudioVisualizer;
