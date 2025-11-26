import { NextFunction, Request, Response } from 'express';
import ResponseWriter from '../class/response_writer';
import { prisma } from '@repo/database';

export default async function TempLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user) return ResponseWriter.unauthorized(res);

    try {
        const startOdDay = new Date();
        startOdDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const contractsToday = await prisma.contract.findMany({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startOdDay,
                    lte: endOfDay,
                },
            },
        });

        if (contractsToday.length >= 3) {
            return ResponseWriter.custom(res, 429, false, {
                success: false,
                message: 'contract limit reached for today',
                data: {
                    goBack: true,
                },
            });
        }
    } catch (err) {
        console.error('Error in TempLimitMiddleware:', err);
    }
}
