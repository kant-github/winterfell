import { Request, Response } from 'express';
import { github_services, github_worker_queue } from '../../services/init';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@winterfell/database';

export default async function githubCodePushController(req: Request, res: Response) {
    const user_id = req.user?.id;
    if (!user_id) {
        ResponseWriter.unauthorized(res, 'Unauthorized');
        return;
    }

    const { repo_name, contract_id } = req.body;

    if (!repo_name || !contract_id) {
        ResponseWriter.validation_error(res, 'Repo name and contract ID are required');
        return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(repo_name)) {
        ResponseWriter.validation_error(res, 'Invalid repo name');
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: user_id } });
    if (!user || !user.githubAccessToken) {
        ResponseWriter.unauthorized(res, 'Authentication required');
        return;
    }

    const contract = await prisma.contract.findUnique({ where: { id: contract_id } });
    if (!contract) {
        ResponseWriter.not_found(res, 'Contract not found');
        return;
    }

    const db_repo = contract.githubRepoName;
    if (db_repo && db_repo === repo_name) {
        const owner = await github_services.get_github_owner(user.githubAccessToken);

        await github_worker_queue.enqueue({
            github_access_token: user.githubAccessToken,
            owner,
            repo_name,
            user_id,
            contract_id,
        });

        const repo_url = `https://github.com/${owner}/${repo_name}`;
        ResponseWriter.success(res, repo_url, 'Export job queued successfully', 200);
        return;
    }

    if (db_repo && db_repo !== repo_name) {
        ResponseWriter.custom(res, 200, {
            success: false,
            message: `This contract is already linked to '${db_repo}`,
            meta: { timestamp: new Date().toISOString() },
        });
        return;
    }

    const repo_exists = await github_services.check_repo_exists(repo_name, user.githubAccessToken);
    if (repo_exists.exists) {
        ResponseWriter.custom(res, 200, {
            success: false,
            message: `The repository '${repo_name}' already exists in your GitHub account.`,
            meta: { timestamp: new Date().toISOString() },
        });
        return;
    }

    await prisma.contract.update({
        where: { id: contract_id },
        data: { githubRepoName: repo_name },
    });
    try {
        const owner = await github_services.get_github_owner(user.githubAccessToken);

        await github_worker_queue.enqueue({
            github_access_token: user.githubAccessToken,
            owner,
            repo_name,
            user_id,
            contract_id,
        });

        const repo_url = `https://github.com/${owner}/${repo_name}`;
        ResponseWriter.success(res, repo_url, 'Export job queued successfully', 200);
        return;
    } catch (error) {
        ResponseWriter.server_error(
            res,
            'Failed to export to GitHub',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
