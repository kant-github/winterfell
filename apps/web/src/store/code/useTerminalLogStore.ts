import { Line } from '@/src/types/terminal_types';
import { create } from 'zustand';

interface TerminalLogStore {
    logs: Line[];
    addLog: (log: Line) => void;
    setLogs: (logs: Line[]) => void;
    clearLogs: () => void;
}

export const useTerminalLogStore = create<TerminalLogStore>((set, get) => ({
    logs: [],
    
    addLog: (log: Line) => 
        set({ logs: [...get().logs, log] }),
    
    setLogs: (logs: Line[]) => 
        set({ logs }),
    
    clearLogs: () => 
        set({ logs: [] }),
}));