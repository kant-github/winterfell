import { Contract } from '@/src/types/prisma-types';
import { create } from 'zustand';

interface ContractStoreProps {
    userContracts: Contract[] | [];
    setUserContracts: (contracts: Contract[]) => void;
}

export const useContractStore = create<ContractStoreProps>((set) => ({
    userContracts: [],
    setUserContracts: (userContracts) => set({ userContracts }),
}));
