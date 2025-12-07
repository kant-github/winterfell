import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { prisma } from '@winterfell/database';

export default async function get_current_chat_messages_controller(req: Request, res: Response) {
    try {
        if (!req.user || !req.user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }

        const { contractId } = req.body;

        if (!contractId) {
            ResponseWriter.not_found(res, 'No contractId provided');
            return;
        }

        const contract_record = await prisma.contract.findUnique({
            where: { id: contractId },
            select: {
                messages: true,
            },
        });

        ResponseWriter.success(res, contract_record, '');
        return;
    } catch (error) {
        console.error('error in fething current contract data', error);
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
