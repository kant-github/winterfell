import { GET_ALL_CONTRACTS, GET_ALL_TEMPLATES, GET_USER_CONTRACTS } from '@/routes/api_routes';
import { ContractData, ContractTemplateData } from '@winterfell/types';
import axios from 'axios';

export default class ContractServer {
    public static async getUserContracts(token: string): Promise<ContractData[]> {
        try {
            const response = await axios.get(GET_USER_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch user contracts', error);
            return [];
        }
    }

    public static async getAllContracts(token: string): Promise<ContractData[]> {
        try {
            const response = await axios.get(GET_ALL_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch all contracts', error);
            return [];
        }
    }

    public static async getTemplates(token: string): Promise<ContractTemplateData[]> {
        try {
            const response = await axios.get(GET_ALL_TEMPLATES, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch templates', error);
            return [];
        }
    }
}
