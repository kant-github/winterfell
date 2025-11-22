import { Request, Response } from 'express';
import { ChatRole, prisma } from '@repo/database';
import { contentGenerator } from '../../services/init';
import { startChatSchema } from '../../schemas/start_chat_schema';
import { Keypair } from '@solana/web3.js';
import ResponseWriter from '../../class/response_writer';

export default async function startChatController(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
        ResponseWriter.unauthorized(res, 'Unauthorized');
        return;
    }

    const data = startChatSchema.safeParse(req.body);

    if (!data.success) {
        ResponseWriter.error(
            res,
            'Invalid request',
            400,
            'VALIDATION_ERROR',
            JSON.stringify(data.error),
        );
        return;
    }

    const { contractId, message } = data.data;

    try {
        let contract;
        contract = await prisma.contract.findUnique({
            where: { id: contractId, userId: userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!contract) {
            contract = await prisma.contract.create({
                data: {
                    id: contractId,
                    title: 'contractor',
                    contractType: 'CUSTOM',
                    userId: userId,
                },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
        }

        const currentUserMessage = await prisma.message.create({
            data: {
                role: ChatRole.USER,
                content: message,
                contractId: contract.id,
            },
        });

        const key_pair = Keypair.generate();
        await contentGenerator.generateInitialResponse(
            res,
            currentUserMessage,
            contract.messages,
            contract.id,
            key_pair.publicKey.toBase58(),
        );
    } catch (err) {
        console.error('Controller Error:', err);
        if (!res.headersSent) {
            ResponseWriter.server_error(
                res,
                'Internal server error',
                err instanceof Error ? err.message : undefined,
            );
            return;
        } else {
            res.write(
                `data: ${JSON.stringify({
                    type: 'error',
                    error: 'Internal server error',
                })}\n\n`,
            );
            res.end();
        }
    }
}
