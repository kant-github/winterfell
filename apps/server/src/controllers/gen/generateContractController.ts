import { ChatRole, PlanType, prisma } from '@winterfell/database';
import { Request, Response } from 'express';
import { generator } from '../../services/init';
import ResponseWriter from '../../class/response_writer';
import { generate_contract_schema } from '../../schemas/generate_contract_schema';
import { MODEL } from '@winterfell/types';

export default async function generateContractController(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user) {
            ResponseWriter.unauthorized(res, 'Unauthorized');
            return;
        }

        const parsed_data = generate_contract_schema.safeParse(req.body);

        if (!parsed_data.success) {
            ResponseWriter.error(res, 'Invalid data', 400);
            return;
        }

        // safe parse validation check
        const { contract_id, instruction, model } = parsed_data.data;

        if (model === MODEL.CLAUDE) {
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

            if (!is_premium_user) {
                ResponseWriter.unauthorized(res, 'you are not subscribed to use premium feature.');
                return;
            }
        }

        const existing_contract = await prisma.contract.findUnique({
            where: {
                id: contract_id,
                userId: user.id,
            },
            include: {
                messages: true,
            },
        });

        if (existing_contract) {
            // const total_messages = existing_contract.messages.filter((m) => {
            //     if (m.role === ChatRole.USER && !m.plannerContext) {
            //         return true;
            //     }
            //     return false;
            // });
            const total_messages = 1;

            if (total_messages > 5) {
                ResponseWriter.error(res, 'message limit reached!', 403);
                return;
            }

            // create user message
            await prisma.message.create({
                data: {
                    role: ChatRole.USER,
                    content: instruction,
                    contractId: existing_contract.id,
                },
            });

            generator.generate(
                res,
                'old',
                instruction,
                model || MODEL.GEMINI,
                existing_contract.id,
                JSON.parse(existing_contract.summarisedObject || ''),
            );
        } else {
            // call for new
            const contract = await prisma.contract.create({
                data: {
                    id: contract_id,
                    title: 'contractor',
                    contractType: 'CUSTOM',
                    userId: user.id,
                    isTemplate: false,
                },
            });

            // create user message
            await prisma.message.create({
                data: {
                    role: ChatRole.USER,
                    content: instruction,
                    contractId: contract_id,
                },
            });

            generator.generate(res, 'new', instruction, model || MODEL.GEMINI, contract.id);
        }
    } catch (error) {
        console.error('Error in generate contract controller: ', error);
        if (!res.headersSent) {
            ResponseWriter.server_error(res);
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
