import { ContractTemplateData } from '@winterfell/types';
import { create } from 'zustand';

interface ContractTemplateStore {
    template: ContractTemplateData | null;
    setTemplate: (template: ContractTemplateData) => void;
    resetTemplate: () => void;
}

export const useContractTemplateStore = create<ContractTemplateStore>((set) => ({
    template: null,
    setTemplate: (template) => set({ template }),
    resetTemplate: () => set({ template: null }),
}));
