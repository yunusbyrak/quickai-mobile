import React, { useState, useEffect, useRef } from 'react';
import { Text } from '@/components/ui/text';

interface RecordingTimerProps {
    isRecording: boolean;
    isPaused: boolean;
    onTimeUpdate?: (time: number) => void;
}

export const RecordingTimer = React.memo(({ isRecording, isPaused, onTimeUpdate }: RecordingTimerProps) => {
    const [displayTime, setDisplayTime] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const pausedTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number | null>(null);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Use requestAnimationFrame for smooth updates
    const updateTimer = () => {
        if (startTimeRef.current && isRecording && !isPaused) {
            const now = Date.now();
            const elapsed = Math.floor((now - startTimeRef.current + pausedTimeRef.current) / 1000);
            setDisplayTime(elapsed);
            onTimeUpdate?.(elapsed);

            animationFrameRef.current = requestAnimationFrame(updateTimer);
        }
    };

    useEffect(() => {
        if (isRecording && !isPaused) {
            // Start or resume recording
            if (!startTimeRef.current) {
                // First time start
                startTimeRef.current = Date.now();
                pausedTimeRef.current = 0;
                setDisplayTime(0);
                console.log('🕐 Timer started');
            } else {
                // Resume from pause
                startTimeRef.current = Date.now();
                console.log('▶️ Timer resumed from:', pausedTimeRef.current / 1000, 'seconds');
            }

            animationFrameRef.current = requestAnimationFrame(updateTimer);
        } else if (isPaused) {
            // Pause - store accumulated time
            if (startTimeRef.current) {
                pausedTimeRef.current += Date.now() - startTimeRef.current;
                console.log('⏸️ Timer paused, total time:', pausedTimeRef.current / 1000, 'seconds');
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        } else {
            // Stop - reset everything
            startTimeRef.current = null;
            pausedTimeRef.current = 0;
            setDisplayTime(0);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            console.log('🛑 Timer stopped and reset');
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isRecording, isPaused]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <Text className="text-lg font-medium text-orange-500">
            {isRecording || isPaused ? `${isPaused ? 'Paused' : 'Rec'} ${formatTime(displayTime)}` : ''}
        </Text>
    );
});
