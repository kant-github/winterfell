import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@winterfell/database';

export default async function getAllTemplates(req: Request, res: Response) {
    const user = req.user;
    if (!user) return ResponseWriter.unauthorized(res, 'Unauthorized');

    try {
        const templates = await prisma.template.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                tags: true,
                s3_prefix: true,
                solanaVersion: true,
                anchorVersion: true,
                createdAt: true,
            },
        });

        if (!templates || templates.length === 0) {
            ResponseWriter.custom(res, 200, {
                message: 'No templates found',
                meta: { timestamp: Date.now().toString() },
            });
            return;
        }

        ResponseWriter.success(res, templates, 'Fetched templates successfully');
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
