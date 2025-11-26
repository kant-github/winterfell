import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@winterfell/database';
import { github_services } from '../../services/init';

export default async function githubRepoNameValidatorController(req: Request, res: Response) {
    try {
        const user_id = req.user?.id;
        if (!user_id) return ResponseWriter.unauthorized(res, 'Unauthorized');

        const { repo_name } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: user_id },
        });

        if (!user?.githubAccessToken) {
            return ResponseWriter.custom(res, 200, {
                success: false,
                message: 'GitHub authentication required',
                data: null,
                meta: { timestamp: new Date().toISOString() },
            });
        }

        const repo_exists = await github_services.check_repo_exists(
            repo_name,
            user.githubAccessToken,
        );

        if (repo_exists.exists === true) {
            return ResponseWriter.custom(res, 200, {
                success: false,
                message: 'Repo name is unavailable',
                data: null,
                meta: { timestamp: new Date().toISOString() },
            });
        }

        return ResponseWriter.success(res, repo_name, 'Repo name is available');
    } catch (error) {
        return ResponseWriter.error(res, 'Internal server error');
    }
}
