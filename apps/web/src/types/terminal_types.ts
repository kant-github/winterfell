import { TerminalSocketData } from '@repo/types';

export interface Line {
    type: 'command' | TerminalSocketData;
    text: string;
}

export interface TerminalTab {
    id: string;
    name: string;
    logs: Line[];
    input: string;
}
