import { ContractTemplateData } from '@winterfell/types';
import { create } from 'zustand';

interface ContractTemplateStore {
    activeTemplate: ContractTemplateData | null;
    setActiveTemplate: (template: ContractTemplateData) => void;
    resetTemplate: () => void;
}

export const useActiveTemplateStore = create<ContractTemplateStore>((set) => ({
    activeTemplate: null,
    setActiveTemplate: (activeTemplate) => set({ activeTemplate }),
    resetTemplate: () => set({ activeTemplate: null }),
}));
