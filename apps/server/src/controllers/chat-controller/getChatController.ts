import { prisma } from '@winterfell/database';
import { Request, Response } from 'express';
import env from '../../configs/config.env';
import ResponseWriter from '../../class/response_writer';
import { STAGE } from '@winterfell/types';

export default async function (req: Request, res: Response) {
    try {
        const user = req.user;

        if (!user) {
            ResponseWriter.unauthorized(res);
            return;
        }

        const { contractId } = req.body;

        if (!contractId) {
            ResponseWriter.no_content(res);
            return;
        }

        const contract = await prisma.contract.findUnique({
            where: {
                id: contractId,
                userId: user.id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                isTemplate: true,
                code: true,
                summarisedObject: true,
                deployed: true,
                programId: true,
                version: true,
                createdAt: true,
                messages: {
                    select: {
                        id: true,
                        role: true,
                        content: true,
                        stage: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!contract) {
            ResponseWriter.not_found(res, `contract with id: ${contractId} was not found!`);
            return;
        }

        if (contract.isTemplate && contract.messages.length === 1) {
            const template_url = `${env.SERVER_CLOUDFRONT_DOMAIN_TEMPLATES}/${contract.title}/resource`;
            const response = await fetch(template_url);
            if (!response.ok) {
                throw new Error(`Failed to fetch contract: ${response.statusText}`);
            }
            const templateFiles = await response.text();

            res.status(200).json({
                success: true,
                latestMessage: contract.messages,
                message: 'fetched template files',
                messages: contract.messages,
                contract: contract,
                contractFiles: templateFiles,
            });
            return;
        }

        const sortedMessages = [...contract.messages].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );

        // this is the latest system message
        // check it out once
        const latestMessage = sortedMessages.find(
            (m) => m.role === 'SYSTEM' && m.stage === STAGE.END,
        );

        if (!latestMessage) {
            throw new Error('system message not found');
        }

        if (latestMessage.stage === STAGE.ERROR) {
            res.status(200).json({
                success: true,
                message: 'contract generation threw an error',
                latestMessage: latestMessage,
                messages: contract.messages,
                contract: contract,
            });
            return;
        }

        if (latestMessage.stage === STAGE.END) {
            const contract_url = `${env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`;
            const response = await fetch(contract_url);
            if (!response.ok) {
                throw new Error(`Failed to fetch contract: ${response.statusText}`);
            }

            const contractFiles = await response.text();

            res.status(200).json({
                success: true,
                latestMessage: latestMessage,
                message: 'fetched contract files',
                messages: contract.messages,
                contract: contract,
                contractFiles: contractFiles,
            });
            return;
        }

        res.status(200).json({
            success: true,
            latestMessage: latestMessage,
            message: 'chat fetched successfully',
            messages: contract.messages,
            contract: contract,
        });
        return;
    } catch (error) {
        console.error('Error while fetching chat data: ', error);
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }
}
