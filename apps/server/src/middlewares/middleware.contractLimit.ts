import { PlanType, prisma } from "@repo/database";
import { NextFunction, Request, Response } from "express";
import PLANS from "../configs/config.plans";


export default async function contractLimit(req: Request, res: Response, next: NextFunction) {
    try {
        
        const user = req.user;
        if(!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const existing_user = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            include: {
                subscription: true,
                contracts: true,
            }
        });

        if(!existing_user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const total_created_contracts = existing_user.contracts.length;

        const current_plan = existing_user.subscription?.plan;

        // there is a problem, what if the user refreshes the subscription, here he will be blocked after 10 contracts
        // but after re-payment of his subscription he should be allowed to create more
        if((!current_plan || current_plan === PlanType.FREE) && total_created_contracts >= PLANS.FREE.limit) {
            res.status(423).json({
                success: false,
                message: 'contract limit reached',
            });
            return;
        } else if(current_plan === PlanType.PREMIUM && total_created_contracts >= PLANS.PREMIUM.limit) {
            res.status(423).json({
                success: false,
                message: 'contra. t limit reached',
            });
            return;
        } else if(current_plan === PlanType.PREMIUM_PLUS && total_created_contracts >= PLANS.PREMIUM_PLUS.limit) {
            res.status(423).json({
                success: false,
                message: 'contract limit reached',
            });
            return;
        } else {
            next();
        }
    } catch (error) {
        console.error('Error in contract limit middleware: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}