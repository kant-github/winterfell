import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@winterfell/database';
import axios from 'axios';
import env from '../../configs/config.env';
import { github_services } from '../../services/init';
import ResponseWriter from '../../class/response_writer';

type UpdateUserData = {
    provider?: string;
    githubAccessToken?: string | null;
    githubId?: string | null;
    githubUsername?: string | null;
};

export default async function signInController(req: Request, res: Response) {
    try {
        const { user, account, turnstileToken, linkingUserId } = req.body;import { Request, Response } from "express";
import prisma from "@repo/database";
import ResponseWriter from "../../class/response_writer";
import jwt from "jsonwebtoken";
import { env } from "../../configs/env.config";

export default async function signInController(req: Request, res: Response) {
    try {
        const { user, account } = req.body;

        if (!user?.email || !account?.provider) {
            return ResponseWriter.not_found(res, "insufficient creds");
        }

        const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                image: user.image,
            },
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: account.provider,
            },
        });

        const token = jwt.sign(
            {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.image,
            },
            env.SERVER_JWT_SECRET,
            { expiresIn: "30d" }
        );

        return ResponseWriter.success(res, { ...dbUser, token }, "Sign in succeeded");
        
    } catch (error) {
        console.error("failed to sign in", error);
        return ResponseWriter.server_error(
            res,
            "Internal server error",
            error instanceof Error ? error.message : undefined
        );
    }
}


        if (!user?.email) {
            return res.status(400).json({ success: false });
        }
        if (!account?.provider) {
            return res.status(400).json({ success: false });
        }
        if (!turnstileToken) {
            return res.status(400).json({ success: false });
        }

        if (!env.SERVER_JWT_SECRET) {
            return res.status(500).json({ success: false });
        }

        const clientIp =
            req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

        const isValid = await verifyTurnstileToken(turnstileToken, clientIp);

        if (!isValid) {
            console.log('turnstile rejected');
            return res.status(403).json({ success: false });
        }

        const isGithub = account.provider === 'github';

        let existingUser = null;

        if (linkingUserId) {
            existingUser = await prisma.user.findUnique({
                where: { id: linkingUserId },
            });
        }

        if (!existingUser) {
            existingUser = await prisma.user.findUnique({
                where: { email: user.email },
            });
        }

        let myUser;
        let owner: string | null = null;

        if (existingUser) {
            const updateData: UpdateUserData = {};

            const providers = existingUser.provider?.split(',') || [];
            if (!providers.includes(account.provider)) {
                providers.push(account.provider);
                updateData.provider = providers.join(',');
            }

            if (isGithub) {
                console.log('fetching github username');
                owner = await github_services.get_github_owner(account.access_token);
                console.log('github owner:', owner);

                updateData.githubAccessToken = account.access_token;
                updateData.githubId = account.providerAccountId;
                updateData.githubUsername = owner;
            }

            myUser = await prisma.user.update({
                where: { id: existingUser.id },
                data: updateData,
            });
        } else {
            if (isGithub) {
                console.log('fetching github username for new user');
                owner = await github_services.get_github_owner(account.access_token);
                console.log('github owner:', owner);
            }

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

        const token = jwt.sign(jwtPayload, env.SERVER_JWT_SECRET, { expiresIn: '30d' });

        return res.json({
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
        });
    } catch (error) {
        console.error('Failed to signin', error);
        ResponseWriter.server_error(
            res,
            'Failed to signin',
            error instanceof Error ? error.message : undefined,
        );
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
    } catch {
        return false;
    }
}
