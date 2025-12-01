import { ContractTemplateData } from '@winterfell/types';
import { create } from 'zustand';

interface TemplateStoreData {
    templates: ContractTemplateData[] | [];
    setTemplates: (templates: ContractTemplateData[]) => void;
}

export const useTemplateStore = create<TemplateStoreData>((set) => ({
    templates: [],
    setTemplates: (templates) => set({ templates }),
}));
