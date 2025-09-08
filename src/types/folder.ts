export interface Folder {
    id: string;
    userid: string;
    title: string;
    description: string | null;
    count: number;
    created_at: string;
    updated_at: string;
    // Additional display properties
    displayDate?: string;
    displayTime?: string;
}

export type CreateFolderInput = {
    title: string;
    description?: string;
};

export type UpdateFolderInput = {
    title?: string;
    description?: string;
};
