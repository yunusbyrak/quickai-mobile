import {
  TranscribeImageRequest,
  TranscribePdfRequest,
  TranscribeTextRequest,
  TranscribeUploadAudioRequest,
  TranscribeYoutubeRequest,
} from '@/types/transcribe';
import { sessionController } from './session-controller';
import { supabase } from '@/lib/supabase';
import { TranscribeAudioRequest } from '@/types/note';

const youtubeTranscribe = async (videos: TranscribeYoutubeRequest) => {
  try {
    const { session } = await sessionController();

    await supabase.functions.invoke('transcribe-youtube', {
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

const textTranscribe = async (text: TranscribeTextRequest) => {
  try {
    const { session } = await sessionController();

    await supabase.functions.invoke('transcribe-text', {
      body: text,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch (error) {
    console.error('Error transcribing text:', error);
    throw error instanceof Error ? error : new Error('Failed to transcribe text');
  }
};

const pdfTranscribe = async (pdf: TranscribePdfRequest) => {
  try {
    const { session } = await sessionController();

    const formData = new FormData();

    if (pdf.pdfFile) {
      formData.append('pdfFile', pdf.pdfFile);
      console.log('pdfFile', pdf.pdfFile);
    } else if (pdf.pdfUrl) {
      formData.append('pdfUrl', pdf.pdfUrl);
    } else {
      throw new Error('Either pdfFile or pdfUrl must be provided');
    }

    console.log('formData', formData);

    const response = await supabase.functions.invoke('transcribe-pdf', {
      body: formData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    console.log('response', response);
  } catch (error) {
    console.error('Error transcribing pdf:', error);
    throw error instanceof Error ? error : new Error('Failed to transcribe pdf');
  }
};

export const imageTranscribe = async (image: TranscribeImageRequest) => {
  try {
    const { session } = await sessionController();

    const formData = new FormData();

    if (image?.imageFiles) {
      image.imageFiles.forEach((file) => {
        formData.append('imageFiles', file);
      });
    }

    await supabase.functions.invoke('transcribe-image', {
      body: formData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch (error) {
    console.error('Error transcribing image:', error);
    throw error instanceof Error ? error : new Error('Failed to transcribe image');
  }
};

const uploadAudioTranscribe = async (audio: TranscribeUploadAudioRequest) => {
  try {
    const { session } = await sessionController();

    const formData = new FormData();

    if (audio.audioFile) {
      formData.append('audioFile', audio.audioFile);
    } else if (audio.audioUrl) {
      formData.append('audioUrl', audio.audioUrl);
    } else {
      throw new Error('Either audioFile or audioUrl must be provided');
    }

    await supabase.functions.invoke('transcribe-audio', {
      body: formData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error instanceof Error ? error : new Error('Failed to upload audio');
  }
};

export { youtubeTranscribe, textTranscribe, pdfTranscribe, uploadAudioTranscribe };
