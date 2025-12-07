import { Contract } from '@/src/types/prisma-types';
import { create } from 'zustand';

interface AllContractStoreProps {
    allContracts: Contract[] | [];
    setAllContracts: (contract: Contract[]) => void;
}

export const useAllContractStore = create<AllContractStoreProps>((set) => ({
    allContracts: [],
    setAllContracts: (allContracts) => set({ allContracts }),
}));
