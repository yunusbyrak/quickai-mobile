export interface YoutubeUrls {
  url: string;
  title: string;
}

export interface TranscribeYoutubeRequest {
  urls: YoutubeUrls[];
}

export interface TranscribeTextRequest {
  text: string;
}

export interface TranscribePdfRequest {
  pdfFile: File;
  pdfUrl?: string;
}
