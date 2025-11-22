export enum NODE {
    FILE = 'FILE',
    FOLDER = 'FOLDER',
}

export interface FileNode {
    name: string;
    type: NODE;
    path: string;
    content?: string;
    language?: string;
    children?: FileNode[];
}

export interface FileContent {
    path: string;
    content: string;
}