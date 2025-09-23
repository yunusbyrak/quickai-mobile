import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/database";

export const getYoutubeDetail = async (noteId: string): Promise<Tables<'youtube_summary'>> => {
    const { data, error } = await supabase
        .from('youtube_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();

    if (error) {
        throw error;
    }
    return data;
};

export const getAudioDetail = async (noteId: string): Promise<Tables<'audio_summary'> & { audioUrl?: string }> => {
    const { data, error } = await supabase
        .from('audio_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();

    if (error) {
        throw error;
    }

    // Get signed URL from Supabase storage for private audio files
    let audioUrl: string | undefined;
    if (data.link) {
        try {
            const { data: urlData, error: urlError } = await supabase.storage
                .from('audio')
                .createSignedUrl(data.link, 3600); // 1 hour expiry

            if (urlError) {
                console.error('Error creating signed URL:', urlError);
                // Fallback to public URL if signed URL fails
                const { data: publicUrlData } = supabase.storage
                    .from('audio')
                    .getPublicUrl(data.link);
                audioUrl = publicUrlData.publicUrl;
            } else {
                audioUrl = urlData.signedUrl;
            }
        } catch (err) {
            console.error('Error getting audio URL:', err);
            // Fallback to public URL
            const { data: publicUrlData } = supabase.storage
                .from('audio')
                .getPublicUrl(data.link);
            audioUrl = publicUrlData.publicUrl;
        }
    }

    return {
        ...data,
        audioUrl
    };
};

export const getImageDetail = async (noteId: string): Promise<Tables<'image_summary'> & { imageUrls?: string[] }> => {
    const { data, error } = await supabase
        .from('image_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();

    if (error) {
        throw error;
    }

    // Get signed URLs for images
    let imageUrls: string[] = [];
    if (data.url) {
        try {
            // Split comma-separated URLs
            const imagePaths = data.url.split(',').map((path: string) => path.trim());

            for (const imagePath of imagePaths) {
                try {
                    const { data: urlData, error: urlError } = await supabase.storage
                        .from('image')
                        .createSignedUrl(imagePath, 3600); // 1 hour expiry

                    if (urlError) {
                        console.error('Error creating signed URL for image:', imagePath, urlError);
                        // Fallback to public URL if signed URL fails
                        const { data: publicUrlData } = supabase.storage
                            .from('image')
                            .getPublicUrl(imagePath);
                        imageUrls.push(publicUrlData.publicUrl);
                    } else {
                        imageUrls.push(urlData.signedUrl);
                    }
                } catch (err) {
                    console.error('Error getting image URL for:', imagePath, err);
                    // Fallback to public URL
                    const { data: publicUrlData } = supabase.storage
                        .from('image')
                        .getPublicUrl(imagePath);
                    imageUrls.push(publicUrlData.publicUrl);
                }
            }
        } catch (err) {
            console.error('Error processing image URLs:', err);
        }
    }

    return {
        ...data,
        imageUrls
    };
};

export const getPdfDetail = async (noteId: string): Promise<Tables<'pdf_summary'>> => {
    const { data, error } = await supabase
        .from('pdf_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getTextDetail = async (noteId: string): Promise<Tables<'text_summary'>> => {
    const { data, error } = await supabase
        .from('text_summary')
        .select('*')
        .eq('note_id', noteId)
        .single();
    if (error) {
        throw error;
    }
    return data;
};
