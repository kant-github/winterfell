import axios from "axios";
import env from "../../configs/config.env";
import ResponseWriter from "../../class/response_writer";
import { Response } from "express";
import { ChatRole, Message, prisma } from "@winterfell/database";
import { generator } from "../../services/init";
import { MODEL } from "@winterfell/types";
import { Contract as ContractType } from "@winterfell/database";


export default class Contract {

    static async generate_with_template(
        res: Response,
        contract_id: string,
        template_id: string,
        instruction?: string,
        model?: MODEL,
    ) {
        // fetch the template data
        const template_data = await axios.get(
            `${env.SERVER_CLOUDFRONT_DOMAIN_TEMPLATES}/${template_id}/resource`,
            {
                responseType: 'json',
            },
        );

        // checks if template_data doesn't exist
        if (!template_data || !Array.isArray(template_data.data)) {
            ResponseWriter.not_found(res, 'Template not found');
            return;
        }

        // first send the user the complete template
        ResponseWriter.stream.write(
            res,
            `data: ${JSON.stringify({
                contractFiles: template_data,
            })}\n\n`,
        );

        // check if the user sent any instruction or not
        if (!instruction) {
            // if not then end the stream
            ResponseWriter.stream.end(res);
            return;
        } else {
            // if yes then continue generation with the sent instruction

            // get the templates idl
            const template = await prisma.template.findUnique({
                where: {
                    id: template_id,
                },
            });

            // this should never hit, as template should exist in s3 and db both
            if (!template) {
                ResponseWriter.no_content(res);
                return;
            }

            // create user message
            await prisma.message.create({
                data: {
                    contractId: contract_id,
                    role: 'USER',
                    content: instruction,
                },
            });

            // start generating the contract
            generator.generate(
                res,
                'old',
                instruction,
                model || MODEL.GEMINI,
                contract_id,
                // template.summarisedObject
            );
        }
    }

    static async generate_new_contract(
        res: Response,
        contract_id: string,
        user_id: string,
        instruction: string,
        model?: MODEL,
    ) {

        // create the contract and user message to generate the contract
        await prisma.$transaction(async (tx) => {
            await tx.contract.create({
                data: {
                    id: contract_id,
                    userId: user_id,
                    title: 'contractor',
                    contractType: 'CUSTOM',
                }
            });

            await tx.message.create({
                data: {
                    contractId: contract_id,
                    role: 'USER',
                    content: instruction,
                },
            });

        });

        // generate the new contract
        generator.generate(
            res,
            'new',
            instruction,
            model || MODEL.GEMINI,
            contract_id,
        );
    }

    static async continue_old_contract(
        res: Response,
        contract: ContractType & { messages: Message[] },
        instruction: string,
        model?: MODEL,
    ) {

        // get the total number of messages
        // const total_messages = contract.messages.filter((m) => {
        //     if (m.role === ChatRole.USER && !m.plannerContext) {
        //         return true;
        //     }
        //     return false;
        // });
        const total_messages = 1;

        // let the user continue only if the message count is less than 5
        if (total_messages > 5) {
            ResponseWriter.error(res, 'message limit reached!', 403);
            return;
        }

        // create user message
        await prisma.message.create({
            data: {
                role: ChatRole.USER,
                content: instruction,
                contractId: contract.id,
            },
        });

        // call the generator with old chat
        generator.generate(
            res,
            'old',
            instruction,
            model || MODEL.GEMINI,
            contract.id,
            JSON.parse(contract.summarisedObject || ''),
        );

    }

}