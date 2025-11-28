import axios from 'axios';
import { FileContent } from '../types/github_worker_queue_types';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import env from '../configs/config.env';
import JSZip from 'jszip';
import fs from 'fs';

export default class GithubServices {
    public async fetch_codebase(contract_id: string): Promise<FileContent[] | null> {
        try {
            const { data } = await axios.get(
                `${env.SERVER_CLOUDFRONT_DOMAIN}/${contract_id}/resource`,
            );
            return data;
        } catch (error) {
            console.error('Failed to fetch codebase', error);
            throw new Error('Failed to fetch code');
        }
    }

    public async get_github_owner(github_access_token: string): Promise<string> {
        try {
            const octokit = new Octokit({ auth: github_access_token });
            const response: RestEndpointMethodTypes['users']['getAuthenticated']['response'] =
                await octokit.users.getAuthenticated();
            return response.data.login;
        } catch (error) {
            throw new Error('GitHub owner doesnt exist');
        }
    }

    public async check_repo_exists(
        repo_name: string,
        github_access_token: string,
    ): Promise<{ exists: boolean; repo?: unknown; error?: string }> {
        try {
            const octokit = new Octokit({ auth: github_access_token });
            const owner = await this.get_github_owner(github_access_token);

            try {
                const repo = await octokit.repos.get({ owner, repo: repo_name });
                return { exists: true, repo: repo.data };
            } catch {
                return { exists: false };
            }
        } catch (error) {
            console.error('Failed while checking repo existence', error);
            return { exists: false, error: 'Internal server error' };
        }
    }

    public async create_zip_file(contract_id: string): Promise<Buffer | null> {
        try {
            const files = await this.fetch_codebase(contract_id);
            if (!files || files.length === 0) {
                console.error('No code found');
                return null;
            }

            const zip = new JSZip();
            for (const f of files) {
                zip.file(f.path, f.content);
            }

            console.log('creating buffer');

            const buffer = await zip.generateAsync({ type: 'nodebuffer' });
            fs.writeFileSync('/tmp/test-file', buffer);
            console.log('buffer received is -------------> ', Buffer.isBuffer(buffer));

            return buffer;
        } catch (error) {
            console.error('Failed to create zip format', error);
            return null;
        }
    }
}
