import { GET_ALL_CONTRACTS, GET_ALL_TEMPLATES, GET_USER_CONTRACTS } from '@/routes/api_routes';
import { Contract, Template } from '@/src/types/prisma-types';
import axios from 'axios';

export default class Marketplace {
    public static async getUserContracts(token: string): Promise<Contract[]> {
        try {
            const { data } = await axios.get(GET_USER_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data.data;
        } catch (error) {
            console.error('Failed to fetch user contracts', error);
            return [];
        }
    }

    public static async getAllContracts(token: string): Promise<Contract[]> {
        try {
            const { data } = await axios.get(GET_ALL_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data.data;
        } catch (error) {
            console.error('Failed to fetch all contracts', error);
            return [];
        }
    }

    public static async getTemplates(): Promise<Template[]> {
        try {
            const { data } = await axios.get(GET_ALL_TEMPLATES);

            return data.data;
        } catch (error) {
            console.error('Failed to fetch templates', error);
            return [];
        }
    }
}
