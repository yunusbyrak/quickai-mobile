import { useQuery } from '@tanstack/react-query';
import { getYoutubeDetail } from '@/services/detail.service';

export const useYoutubeDetail = (noteId: string) => {
  return useQuery({
    queryKey: ['youtube-detail', noteId],
    queryFn: () => getYoutubeDetail(noteId),
    enabled: !!noteId,
  });
};
