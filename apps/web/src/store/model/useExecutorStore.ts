import { EXECUTOR } from '@winterfell/types';
import { create } from 'zustand';

interface ModelState {
    executor: EXECUTOR;
    setExecutor: (executor: EXECUTOR) => void;
}

export const useModelStore = create<ModelState>((set) => ({
    executor: EXECUTOR.AGENTIC,
    setExecutor: (executor: EXECUTOR) => set({ executor: executor }),
}));
