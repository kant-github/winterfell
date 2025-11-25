import axios from 'axios';
import { FileContent } from '../types/github_worker_queue_types';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import env from '../configs/config.env';

export async function fetch_codebase(contractId: string): Promise<FileContent[] | null> {
    try {
        const { data } = await axios.get(`${env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`);
        return data;
    } catch(error) {
        console.error('Failed to fetch codebase', error);
        return null;
    }
}

export async function get_github_owner(github_access_token: string): Promise<string> {
    const octokit = new Octokit({ auth: github_access_token });
    const response: RestEndpointMethodTypes['users']['getAuthenticated']['response'] =
        await octokit.users.getAuthenticated();
    return response.data.login;
}
