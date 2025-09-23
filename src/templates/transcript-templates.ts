/**
 * HTML Templates for Transcript Sharing
 *
 * This file contains pre-defined HTML templates for different types of transcripts.
 * Each template is designed to provide a professional, well-formatted output.
 */

export interface TranscriptTemplateData {
    title: string;
    date: string;
    content: string;
    segments?: Array<{
        start: number;
        text: string;
    }>;
}

/**
 * Audio Transcript Template
 * Professional template with timestamp formatting and clean typography
 */
export const audioTranscriptTemplate = (data: TranscriptTemplateData): string => {
    const { title, date, content, segments } = data;

    // Format segments with timestamps if available
    const formattedContent = segments
        ? segments.map(segment => {
            const minutes = Math.floor(segment.start / 60);
            const seconds = Math.floor(segment.start % 60);
            const timestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            return `<p style="padding-top: 14pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">${timestamp}: ${segment.text.trim()}</p>`;
        }).join('')
        : `<p style="padding-top: 14pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">${content}</p>`;

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>${title}</title>
    <style type="text/css">
        body {padding: 30px;}
        * {margin:0; padding:0; text-indent:0; }
        h1 { color: black; font-family:Tahoma, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 19pt; }
        .s1 { color: #666; font-family:Tahoma, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 10pt; }
        h2 { color: #EBA906; font-family:Tahoma, sans-serif; font-style: normal; font-weight: bold; text-decoration: none; font-size: 18pt; }
        p { color: black; font-family:Tahoma, sans-serif; font-style: normal; font-weight: normal; text-decoration: none; font-size: 13pt; margin:0pt; }
    </style>
</head>
<body>
    <h1 style="padding-top: 3pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}, ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</h1>
    <p class="s1" style="padding-top: 4pt;padding-left: 5pt;text-indent: 0pt;text-align: left;">${date}</p>
    <p style="padding-top: 11pt;text-indent: 0pt;text-align: left;"><br/></p>
    <h2 style="padding-left: 5pt;text-indent: 0pt;text-align: left;">${title}</h2>
    ${formattedContent}
</body>
</html>`;
};

/**
 * Simple Transcript Template
 * Clean, minimal template for basic transcript sharing
 */
export const simpleTranscriptTemplate = (data: TranscriptTemplateData): string => {
    const { title, content } = data;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .content {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="content">${content}</div>
</body>
</html>`;
};

/**
 * Meeting Notes Template
 * Professional template for meeting transcripts with structured formatting
 */
export const meetingNotesTemplate = (data: TranscriptTemplateData): string => {
    const { title, date, content } = data;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 20px;
            color: #333;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .date {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .content {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <div class="date">${date}</div>
        <div class="content">${content}</div>
    </div>
</body>
</html>`;
};

/**
 * Academic Paper Template
 * Formal template for academic or research transcripts
 */
export const academicTemplate = (data: TranscriptTemplateData): string => {
    const { title, date, content } = data;

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.8;
            margin: 2.5cm;
            color: #000;
        }
        h1 {
            text-align: center;
            font-size: 18pt;
            margin-bottom: 20pt;
            font-weight: bold;
        }
        .date {
            text-align: center;
            font-style: italic;
            margin-bottom: 30pt;
        }
        .content {
            text-align: justify;
            text-indent: 1.25cm;
        }
        p {
            margin-bottom: 12pt;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="date">${date}</div>
    <div class="content">${content}</div>
</body>
</html>`;
};

/**
 * Template registry for easy access
 */
export const transcriptTemplates = {
    audio: audioTranscriptTemplate,
    simple: simpleTranscriptTemplate,
    meeting: meetingNotesTemplate,
    academic: academicTemplate,
} as const;

export type TemplateType = keyof typeof transcriptTemplates;

/**
 * Get a template by type
 */
export const getTranscriptTemplate = (type: TemplateType) => {
    return transcriptTemplates[type];
};

/**
 * Generate HTML using a specific template
 */
export const generateTranscriptHTML = (
    type: TemplateType,
    data: TranscriptTemplateData
): string => {
    const template = getTranscriptTemplate(type);
    return template(data);
};
