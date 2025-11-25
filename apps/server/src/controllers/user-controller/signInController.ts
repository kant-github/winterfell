import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database';
import ResponseWriter from '../../class/response_writer';
import { get_github_owner } from '../../services/git_services';
import axios from 'axios';
import env from '../../configs/config.env';

const SERVER_JWT_SECRET = process.env.SERVER_JWT_SECRET;

export default async function signInController(req: Request, res: Response) {
    const { user, account, turnstileToken } = req.body;
    if (!user || !user.email) {
        console.error('Missing user or user.email');
        return res.status(400).json({
            success: false,
            error: 'Missing user email',
        });
    }

    if (!turnstileToken) {
        return res.status(400).json({
            success: false,
            error: 'Missing turnstile token',
        });
    }

    const clientIp =
        req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const isValidToken = await verifyTurnstileToken(turnstileToken, clientIp);

    if (!isValidToken) {
        return res.status(403).json({
            success: false,
            error: 'Invalid captcha verification',
        });
    }

    if (!account || !account.provider) {
        return res.status(400).json({
            success: false,
            error: 'Missing account provider',
        });
    }

    if (!SERVER_JWT_SECRET) {
        return res.status(500).json({
            success: false,
            error: 'Server configuration error',
        });
    }
    try {
        let myUser;
        let owner;
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        const isGithub = account.provider === 'github';
        if (existingUser) {
            const updateData: any = {
                name: user.name,
                image: user.image,
            };

            const providers = existingUser.provider?.split(',') || [];
            if (!providers.includes(account.provider)) {
                providers.push(account.provider);
                updateData.provider = providers.join(',');
            }

            if (isGithub) {
                owner = await get_github_owner(account.access_token);
                updateData.githubAccessToken = account.access_token;
                updateData.githubId = account.providerAccountId;
                updateData.githubUsername = owner;
            }

            myUser = await prisma.user.update({
                where: { email: user.email },
                data: updateData,
            });
        } else {
            myUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: account.provider,
                    githubAccessToken: isGithub ? account.access_token : null,
                    githubId: isGithub ? account.providerAccountId : null,
                    githubUsername: isGithub ? owner : null,
                },
            });
        }

        const jwtPayload = {
            id: myUser.id,
            email: myUser.email,
            name: myUser.name,
        };

        const token = jwt.sign(jwtPayload, SERVER_JWT_SECRET, { expiresIn: '30d' });

        const response = {
            success: true,
            user: {
                id: myUser.id,
                name: myUser.name,
                email: myUser.email,
                image: myUser.image,
                provider: myUser.provider,
                hasGithub: !!myUser.githubAccessToken,
                githubUsername: myUser.githubUsername,
            },
            token,
        };
        res.json(response);
        return;
    } catch (err) {
        ResponseWriter.error(res, 'Authentication failed', 500);
        console.error('error in sign in : ', err);
        return;
    }
}

async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
    try {
        const response = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                secret: env.SERVER_TURNSTILE_SERVER_KEY,
                response: token,
                remoteip: ip,
            },
        );

        return response.data.success === true;
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return false;
    }
}
