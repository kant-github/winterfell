import { Request, Response } from "express";
import ResponseWriter from "../../class/response_writer";
import { prisma } from "@winterfell/database";

export default async function get_current_chat_data_controller(req: Request, res: Response) {
    try {
        if (!req.user || !req.user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }

        const contractId = req.body;
        await prisma.contract.findUnique({
            where: {id: contractId},
            select: {
               title: true, 
            }
        })
    } catch (error) {
        
    }
}