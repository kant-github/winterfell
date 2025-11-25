import { prisma } from "@repo/database";
import { Request, Response } from "express";
import { generator } from "../../services/init";


export default async function generateContractController(req: Request, res: Response) {
    try {

        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const body = req.body;
        // safe parse validation check
        const { contract_id, instruction, model } = body;

        const existing_contract = await prisma.contract.findUnique({
            where: {
                id: contract_id,
                userId: user.id,
            },
            select: {
                messages: true,
            }
        });

        if (existing_contract) {
            // call for update
            if (existing_contract.messages.length >= 5) {
                res.status(403).json({
                    success: false,
                    message: 'message limit reached!',
                });
                return;
            }
        } else {
            // call for new
            await generator.generate(
                res,
                'new',
                instruction,

            )
        }

    } catch (error) {
        console.error('Error in generate contract controller: ', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal server error',
            });
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