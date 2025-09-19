import { TranscribeYoutubeRequest } from '@/types/transcribe';
import { sessionController } from './session-controller';
import { supabase } from '@/lib/supabase';

const youtubeTranscribe = async (videos: TranscribeYoutubeRequest) => {
  try {
    const { session } = await sessionController();

    const { data, error } = await supabase.functions.invoke('transcribe-youtube', {
      body: videos,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch (error) {
    console.error('Error transcribing youtube:', error);
    throw error instanceof Error ? error : new Error('Failed to transcribe youtube');
  }
};

export { youtubeTranscribe };
