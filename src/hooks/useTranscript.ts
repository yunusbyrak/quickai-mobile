import { useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export interface UseTranscriptOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}


export const useTranscript = (options: UseTranscriptOptions) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const printTranscript = async (title?: string, html?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Use provided HTML or generate default HTML
            const htmlContent = html;

            const { uri } = await Print.printToFileAsync({ html: htmlContent });

            // Check if file exists and is accessible
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('Generated PDF file does not exist');
            }

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: title || 'Share Transcript',
                    UTI: 'com.adobe.pdf'
                });
            } else {
                throw new Error('Sharing is not available on this device');
            }

            options?.onSuccess?.();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to print transcript');
            setError(error);
            options?.onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    const shareTranscript = async (content: string, title?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Create a temporary text file for sharing
            const fileName = `${title || 'Transcript'}.txt`;
            const fileUri = FileSystem.documentDirectory + fileName;

            // Write content to file
            await FileSystem.writeAsStringAsync(fileUri, content, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            // Check if file was created successfully
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
                throw new Error('Failed to create text file for sharing');
            }

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/plain',
                    dialogTitle: title || 'Share Transcript',
                    UTI: 'public.text'
                });
            } else {
                throw new Error('Sharing is not available on this device');
            }

            options?.onSuccess?.();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to share transcript');
            setError(error);
            options?.onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        isLoading,
        error,
        printTranscript,
        shareTranscript,
        clearError,
    };
};
