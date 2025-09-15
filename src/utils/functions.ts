export const getCountryFlag = (language: string) => {
    if(language === 'en') {
        return 'us';
    }
    return language;
}

export const dateFormat = (date: string, format: 'short' | 'medium' | 'long' | 'full' | 'time' = 'medium') => {
    const dateObj = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use user's local timezone
    };

    switch (format) {
        case 'short':
            return dateObj.toLocaleDateString(undefined, {
                ...options,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        case 'medium':
            return dateObj.toLocaleDateString(undefined, {
                ...options,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        case 'long':
            return dateObj.toLocaleDateString(undefined, {
                ...options,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
            });
        case 'full':
            return dateObj.toLocaleDateString(undefined, {
                ...options,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        case 'time':
            return dateObj.toLocaleTimeString(undefined, {
                ...options,
                hour: '2-digit',
                minute: '2-digit',
            });
        default:
            return dateObj.toLocaleDateString(undefined, {
                ...options,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
    }
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url - YouTube URL string
 * @returns Video ID string or null if not found
 *
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/embed/VIDEO_ID
 */
export const getYouTubeVideoId = (url: string): string | null => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    // Remove any whitespace
    const cleanUrl = url.trim();

    // Regular expressions for different YouTube URL formats
    const patterns = [
        // Standard YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID
        /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        // Shortened URLs: https://youtu.be/VIDEO_ID
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        // Mobile URLs: https://m.youtube.com/watch?v=VIDEO_ID
        /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    ];

    // Try each pattern
    for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

