import axios from 'axios';
import { CHECK_REPO_NAME, EXPORT_CONTRACT_URL } from '@/routes/api_routes';

export default class GithubServer {
    public static validateRepoNameFormat(name: string): boolean {
        return /^[a-zA-Z0-9_.-]+$/.test(name);
    }

    public static async checkRepoName(
        repoName: string,
        token: string,
    ): Promise<{ success: boolean; message?: string }> {
        const response = await axios.post(
            CHECK_REPO_NAME,
            { repo_name: repoName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    }

    public static async pushCodeToGithub({
        repoName,
        contractId,
        token,
    }: {
        repoName: string;
        contractId: string;
        token: string;
    }): Promise<{ success: boolean; message?: string }> {
        const res = await axios.post(
            EXPORT_CONTRACT_URL,
            {
                repo_name: repoName,
                contract_id: contractId,
                hasGithub: token,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return res.data;
    }
}
