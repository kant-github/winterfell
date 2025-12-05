import { Template } from '@/src/types/prisma-types';
import { create } from 'zustand';

interface TemplateStoreData {
    templates: Template[] | [];
    activeTemplate: Template | null;
    setActiveTemplate: (template: Template) => void;
    resetTemplate: () => void;
    setTemplates: (templates: Template[]) => void;
}

export const useTemplateStore = create<TemplateStoreData>((set) => ({
    templates: [],
    activeTemplate: null,
    setActiveTemplate: (activeTemplate) => set({ activeTemplate }),
    resetTemplate: () => set({ activeTemplate: null }),
    setTemplates: (templates) => set({ templates }),
}));
