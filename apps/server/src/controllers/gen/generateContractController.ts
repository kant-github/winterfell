import { PlanType, prisma } from "@repo/database";
import { Request, Response } from "express";
import { generator } from "../../services/init";
import { MODEL } from "../../generator/types/model_types";


export default async function generateContractController(req: Request, res: Response) {
    try {

        console.log('generate contract controller hit');
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

        console.log(body);

        if(model === MODEL.CLAUDE) {
            const existing_user = await prisma.user.findUnique({
                where: {
                    id: user.id,
                    email: user.email,
                },
                include: {
                    subscription: true,
                },
            });

            const is_premium_user = 
                existing_user?.subscription?.plan === PlanType.PREMIUM ||
                existing_user?.subscription?.plan === PlanType.PREMIUM_PLUS;

            if(!is_premium_user) {
                res.status(403).json({
                    success: false,
                    message: 'you are not subscribed to use premium feature.',
                });
            }
        }

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

            const contract = await prisma.contract.create({
                data: {
                    id: contract_id,
                    title: 'contractor',
                    contractType: 'CUSTOM',
                    userId: user.id,
                },
            });

            generator.generate(
                res,
                'new',
                instruction,
                model || MODEL.GEMINI,
                contract.id,
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