import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';


export default function VideoScreen({ videoId }: { videoId: string }) {

    const [elapsed, setElapsed] = useState('00:00:000');
    const playerRef = useRef<YoutubeIframeRef>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            const elapsed_sec = await playerRef.current?.getCurrentTime();
            const elapsed_ms = Math.floor(elapsed_sec ?? 0 * 1000);
            const ms = elapsed_ms % 1000;
            const min = Math.floor(elapsed_ms / 60000);
            const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);

            setElapsed(
                parseInt(min.toString().padStart(2, '0')) +
                ':' +
                seconds.toString().padStart(2, '0') +
                ':' +
                ms.toString().padStart(3, '0'),
            );
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <View className="flex-1">
            <YoutubePlayer
                height={250}
                ref={playerRef}
                videoId={videoId}
            />
        </View>
    )
}
