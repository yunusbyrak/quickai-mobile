import { supabase } from '@/lib/supabase';
import { TranscribeAudioRequest, TranscribeAudioResponse, AudioSummary } from '@/types/note';
import { sessionController } from './session-controller';

/**
 * Transcribes audio using Supabase Edge Function
 * Supports both audio file upload and audio URL
 */
export const transcribeAudio = async (
  request: TranscribeAudioRequest
): Promise<TranscribeAudioResponse> => {
  try {
    const activeSession = await sessionController();
    const { session } = activeSession;

    // Prepare form data for the Edge Function
    const formData = new FormData();

    if (request.audioFile) {
      formData.append('audioFile', request.audioFile);
    } else if (request.audioUrl) {
      formData.append('audioUrl', request.audioUrl);
    } else {
      throw new Error('Either audioFile or audioUrl must be provided');
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: formData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw new Error(`Edge function error: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from transcription service');
    }

    return data as TranscribeAudioResponse;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error instanceof Error ? error : new Error('Failed to transcribe audio');
  }
};

/**
 * Gets the status of an audio transcription
 */
export const getAudioTranscriptionStatus = async (
  transcriptionId: string
): Promise<AudioSummary | null> => {
  try {
    const { data, error } = await supabase
      .from('audio_summary')
      .select('*')
      .eq('id', transcriptionId)
      .single();

    if (error) {
      console.error('Error fetching transcription status:', error);
      return null;
    }

    return data as AudioSummary;
  } catch (error) {
    console.error('Error getting transcription status:', error);
    return null;
  }
};

/**
 * Gets all audio transcriptions for a specific note
 */
export const getNoteAudioTranscriptions = async (noteId: string): Promise<AudioSummary[]> => {
  try {
    const { data, error } = await supabase
      .from('audio_summary')
      .select('*')
      .eq('note_id', noteId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching note transcriptions:', error);
      return [];
    }

    return data as AudioSummary[];
  } catch (error) {
    console.error('Error getting note transcriptions:', error);
    return [];
  }
};

/**
 * Deletes an audio transcription
 */
export const deleteAudioTranscription = async (transcriptionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('audio_summary').delete().eq('id', transcriptionId);

    if (error) {
      console.error('Error deleting transcription:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting transcription:', error);
    return false;
  }
};
