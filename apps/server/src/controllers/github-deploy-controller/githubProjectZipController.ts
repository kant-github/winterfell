import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@winterfell/database';
import { github_services } from '../../services/init';

export default async function githubProjectZipController(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user) return ResponseWriter.unauthorized(res, 'unauthorized');

        const user_record = await prisma.user.findUnique({
            where: { id: user.id },
            select: { githubAccessToken: true },
        });
        if (!user_record?.githubAccessToken)
            return ResponseWriter.unauthorized(res, 'GitHub not authenticated');

        const { contractId } = req.body;
        if (!contractId) return ResponseWriter.not_found(res, 'contract id required');

        const buffer = await github_services.create_zip_file(contractId);
        if (!buffer) return ResponseWriter.not_found(res, 'No codebase found');

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="project_${contractId}.zip"`);

        res.status(200).send(buffer);
        return;
    } catch (error) {
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
