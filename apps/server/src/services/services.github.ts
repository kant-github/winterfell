import axios from 'axios';
import { FileContent } from '../types/github_worker_queue_types';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import env from '../configs/config.env';

export default class GithubServices {
    public async fetch_codebase(contract_id: string): Promise<FileContent[] | null> {
        try {
            const { data } = await axios.get(
                `${env.SERVER_CLOUDFRONT_DOMAIN}/${contract_id}/resource`,
            );
            return data;
        } catch (error) {
            console.error('Failed to fetch codebase', error);
            return null;
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

    // private async create_repo_for_user(repo_name: string) {
    //     try {
    //         await this.octokit.repos.createForAuthenticatedUser({
    //             name: repo_name,
    //             private: false,
    //         });
    //         return { success: true };
    //     } catch (error) {
    //         return { success: false };
    //     }
    // }

    public async check_repo_exists(repo_name: string, github_access_token: string) {
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

    // public async get_github_repo(repo_name: string, user_id: string) {
    //     try {
    //         const owner = await this.get_github_owner();
    //         const user = await prisma.user.findUnique({
    //             where: { id: user_id }
    //         });
    //         if (!user) return { success: false, message: "User not found" };

    //         let existing_repo = null;

    //         try {
    //             existing_repo = await this.octokit.repos.get({ owner, repo: repo_name });
    //         } catch {
    //             existing_repo = null;
    //         }

    //         if (existing_repo?.data) {
    //             if (user.githubRepoName === repo_name) {
    //                 return { success: true, message: "repo exists and matches user" };
    //             }
    //             if (user.githubRepoName && user.githubRepoName !== repo_name) {
    //                 return { success: false, message: "repo exists but not linked to user" };
    //             }

    //             await prisma.user.update({
    //                 where: { id: user_id },
    //                 data: { githubRepoName: repo_name }
    //             });

    //             return { success: true, message: "Repo linked to user" };
    //         }

    //         const created = await this.create_repo_for_user(repo_name);
    //         if (!created.success) {
    //             return { success: false, message: "failed to create github repo" };
    //         }

    //         await prisma.user.update({
    //             where: { id: user_id },
    //             data: { githubRepoName: repo_name }
    //         });

    //         return { success: true, message: "repo created and linked" };

    //     } catch (error) {
    //         console.error(error);
    //         return { success: false, message: "Internal server error" };
    //     }
    // }
}
