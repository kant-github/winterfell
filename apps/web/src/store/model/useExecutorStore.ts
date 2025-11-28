import { EXECUTOR } from '@winterfell/types';
import { create } from 'zustand';

interface ModelState {
    selectedModel: EXECUTOR;
    setSelectedModel: (executor: EXECUTOR) => void;
}

export const useModelStore = create<ModelState>((set) => ({
    selectedModel: EXECUTOR.AGENTIC,
    setSelectedModel: (executor: EXECUTOR) => set({ selectedModel: executor }),
}));
