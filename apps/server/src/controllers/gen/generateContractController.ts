import { ChatRole, PlanType, prisma } from '@winterfell/database';
import { Request, Response } from 'express';
import { generator, objectStore } from '../../services/init';
import ResponseWriter from '../../class/response_writer';
import { generate_contract_schema } from '../../schemas/generate_contract_schema';
import { FileContent, MODEL } from '@winterfell/types';
import env from '../../configs/config.env';
import axios from 'axios';

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

        const { contract_id, instruction, model } = parsed_data.data;

        // template override request
        const contract = await prisma.contract.findUnique({
            where: {
                id: contract_id
            },
            include: {
                messages: true
            }
        });

        // validates initial message and isTemplate, gets the template from template-cdn and updates the contract to user-contracts' s3
        // thsi way, it becomes an existing contract and user can continue from there
        if (contract?.isTemplate && contract.messages.length === 1) {
            console.log('inside update template');
            const files = await axios.get(`${env.SERVER_CLOUDFRONT_DOMAIN_TEMPLATES}/${contract.title}/resource`);
            if (!files) {
                ResponseWriter.server_error(res, 'Failed to fetch template files');
                return;
            }
            console.log('files from cdn are: ', files);
            
            try {
                console.log('updating the files to user-contract s3');
                await objectStore.uploadContractFiles(contract_id, files.data, JSON.stringify(files));
                console.log('updated the files');
            } catch (error) {
                console.error('error in uploading the files to s3', error);
                return;
            }
        }


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
            ResponseWriter.stream.write(
                res,
                `data: ${JSON.stringify({
                    type: 'error',
                    error: 'Internal server error',
                })}\n\n`,
            );
            ResponseWriter.stream.end(res);
        }
    }
}
