import { ContractData } from '@winterfell/types';
import { create } from 'zustand';

interface AllContractStoreProps {
    allContracts: ContractData[] | [];
    setAllContracts: (contract: ContractData[]) => void;
}

export const useAllContractStore = create<AllContractStoreProps>((set) => ({
    allContracts: [],
    setAllContracts: (allContracts) => set({ allContracts }),
}));
