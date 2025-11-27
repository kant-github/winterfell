import { Line } from '@/src/types/terminal_types';
import { create } from 'zustand';

interface TerminalLogStore {
    logs: Line[];
    isCommandRunning: boolean;
    setIsCommandRunning: (value: boolean) => void
    addLog: (log: Line) => void;
    setLogs: (logs: Line[]) => void;
    clearLogs: () => void;
}

export const useTerminalLogStore = create<TerminalLogStore>((set, get) => ({
    logs: [],
    isCommandRunning: false,
    setIsCommandRunning: (value: boolean) => set({ isCommandRunning: value }),
    addLog: (log: Line) => set({ logs: [...get().logs, log] }),

    setLogs: (logs: Line[]) => set({ logs }),

    clearLogs: () => set({ logs: [] }),
}));
