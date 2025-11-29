import { ContractData } from '@winterfell/types';
import { create } from 'zustand';

interface ContractStoreProps {
    userContracts: ContractData[] | [];
    setUserContracts: (contracts: ContractData[]) => void;
}

export const useContractStore = create<ContractStoreProps>((set) => ({
    userContracts: [],
    setUserContracts: (userContracts) => set({ userContracts }),
}));
