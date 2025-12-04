import { ContractTemplateData } from '@winterfell/types';
import { create } from 'zustand';

interface TemplateStoreData {
    templates: ContractTemplateData[] | [];
    activeTemplate: ContractTemplateData | null;
    setActiveTemplate: (template: ContractTemplateData) => void;
    resetTemplate: () => void;
    setTemplates: (templates: ContractTemplateData[]) => void;
}

export const useTemplateStore = create<TemplateStoreData>((set) => ({
    templates: [],
    activeTemplate: null,
    setActiveTemplate: (activeTemplate) => set({ activeTemplate }),
    resetTemplate: () => set({ activeTemplate: null }),
    setTemplates: (templates) => set({ templates }),
}));
