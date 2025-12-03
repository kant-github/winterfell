import { Request, Response } from 'express';
import ResponseWriter from '../../class/response_writer';
import { ChatRole, prisma } from '@winterfell/database';
import { generate_template_schema } from '../../schemas/generate_template_schema';
import env from '../../configs/config.env';
import axios from 'axios';

export default async function generate_template_controller(req: Request, res: Response) {
    try {
        console.log('inside generate template controller');
        const user = req.user;
        if (!user || !user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }
        const db_user = await prisma.user.findUnique({
            where: { id: user.id },
        });

        if (!db_user) {
            ResponseWriter.not_found(res);
            return;
        }

        const parsed = generate_template_schema.safeParse(req.body);
        if (!parsed.success) {
            ResponseWriter.validation_error(res, 'Invalid data');
            return;
        }

        const { contract_id, instruction, template_id } = parsed.data;

        const valid_template = await prisma.template.findUnique({
            where: { id: template_id },
        });

        if (!valid_template) {
            ResponseWriter.not_found(res, 'Template not found');
            return;
        }

        const template_data = await axios.get(
            `${env.SERVER_CLOUDFRONT_DOMAIN_TEMPLATES}/${template_id}/resource`,
            {
                responseType: 'json',
            },
        );

        if (!Array.isArray(template_data.data)) {
            throw new Error('Invalid template data format');
        }

        await prisma.contract.create({
            data: {
                id: contract_id,
                title: template_id,
                contractType: 'CUSTOM', // take this from template
                userId: user.id,
                isTemplate: true,
            },
        });

        await prisma.message.create({
            data: {
                role: ChatRole.USER,
                content: instruction,
                contractId: contract_id,
            },
        });

        ResponseWriter.success(
            res,
            template_data.data,
            `Fetched ${parsed.data.template_id} template succesfully`,
        );
        return;
    } catch (error) {
        ResponseWriter.server_error(
            res,
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        console.error('Failed to generate template: ', error);
        return;
    }
}
