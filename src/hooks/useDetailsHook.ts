import { useQuery } from '@tanstack/react-query';
import { getYoutubeDetail, getAudioDetail, getImageDetail, getPdfDetail, getTextDetail } from '@/services/detail.service';

export const useYoutubeDetail = (noteId: string) => {
    return useQuery({
        queryKey: ['youtube-detail', noteId],
        queryFn: () => getYoutubeDetail(noteId),
        enabled: !!noteId,
    });
};

export const useAudioDetail = (noteId: string) => {
    return useQuery({
        queryKey: ['audio-detail', noteId],
        queryFn: () => getAudioDetail(noteId),
        enabled: !!noteId,
    });
};

export const useImageDetail = (noteId: string) => {
    return useQuery({
        queryKey: ['image-detail', noteId],
        queryFn: () => getImageDetail(noteId),
        enabled: !!noteId,
    });
};

export const usePdfDetail = (noteId: string) => {
    return useQuery({
        queryKey: ['pdf-detail', noteId],
        queryFn: () => getPdfDetail(noteId),
        enabled: !!noteId,
    });
};

export const useTextDetail = (noteId: string) => {
    return useQuery({
        queryKey: ['text-detail', noteId],
        queryFn: () => getTextDetail(noteId),
        enabled: !!noteId,
    });
};
