import { Request, Response } from "express";
import ResponseWriter from "../../class/response_writer";
import { generate_contract } from "../../schemas/generate_contract_schema";
import { PlanType, prisma } from "@winterfell/database";
import { MODEL } from "@winterfell/types";
import Contract from "./contract";


export default async function generate_contract_controller(req: Request, res: Response) {
    try {
        
        // checking for valid user
        const user = req.user;
        if(!user) {
            ResponseWriter.unauthorized(res, 'Unauthorised');
            return;
        }

        // checking for valid data
        const parsed_data = generate_contract.safeParse(req.body);
        if (!parsed_data.success) {
            ResponseWriter.error(res, 'Invalid data', 400);
            return;
        }

        const { contract_id, instruction, template_id, model } = parsed_data.data;

        // checking if the contract exists
        let contract = await prisma.contract.findUnique({
            where: {
                id: contract_id,
                userId: user.id,
            },
            include: {
                messages: true,
            }
        });

        if(!contract) {
            ResponseWriter.unauthorized(res, 'Unauthorised');
            return;
        }

        // if the contract doesn't exist, then create it
        contract = await prisma.contract.create({
            data: {
                id: contract_id,
                userId: user.id,
                contractType: 'CUSTOM',
                title: 'contractor',
            },
            include: {
                messages: true,
            }
        });

        // check for claude model
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

        if(contract.messages.length === 0) {
            // contract is just been created

            // check if the user is asking with template
            if(template_id) {
                Contract.generate_with_template(
                    res,
                    contract_id,
                    template_id,
                    instruction,
                    model,
                );
            } else {
                // start generation if and only if the instruction is provided
                if(instruction) {
                    Contract.generate_new_contract(
                        res,
                        contract_id,
                        user.id,
                        instruction,
                        model,
                    );
                } else {
                    ResponseWriter.error(res, 'Instruction not provided', 401);
                    return;
                }
            }
        } else {
            // start generation if and only if the instruction is provided
            if(instruction) {
                Contract.continue_old_contract(
                    res,
                    contract,
                    instruction,
                    model,
                );
            } else {
                ResponseWriter.error(res, 'Instruction not provided', 401);
                return;
            }
        }

    } catch (error) {
        console.error('Error in generate_contract_controller: ', error);
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

function get_template_files(template_id: string) {

}