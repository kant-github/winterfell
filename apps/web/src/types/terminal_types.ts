import { TerminalSocketData } from '@winterfell/types';

export interface Line {
    type: 'command' | TerminalSocketData | 'client' | 'error' | 'unknown';
    text: string;
}

export interface TerminalTab {
    id: string;
    name: string;
    logs: Line[];
    input: string;
}
