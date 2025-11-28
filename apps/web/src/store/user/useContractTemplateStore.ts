import { ContractTemplate } from "@winterfell/types";
import { create } from "zustand";

interface ContractTemplateStore {
    template: ContractTemplate | null;
    setTemplate: (template: ContractTemplate) => void;
    resetTemplate: () => void;
}

export const useContractTemplateStore = create<ContractTemplateStore>((set) => ({
    template: null,
    setTemplate: (template: ContractTemplate) => set({ template: template }),
    resetTemplate: () => set({ template: null }),
}))