import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@winterfell/database';
import { get_github_owner } from '../../services/git_services';
import axios from 'axios';
import env from '../../configs/config.env';
import { github_services } from '../../services/init';

type UpdateUserData = {
    provider?: string;
    githubAccessToken?: string | null;
    githubId?: string | null;
    githubUsername?: string | null;
};

async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
    try {
        console.log('verifying turnstile token:', token, 'ip:', ip);

        const response = await axios.post(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                secret: env.SERVER_TURNSTILE_SERVER_KEY,
                response: token,
                remoteip: ip,
            },
        );

        console.log('turnstile response:', response.data);

        return response.data.success === true;
    } catch (error) {
        console.log('turnstile verification error:', error);
        return false;
    }
}

export default async function signInController(req: Request, res: Response) {
    console.log('signin controller start');

    const { user, account, turnstileToken, linkingUserId } = req.body;

    console.log('incoming body:', { user, account, turnstileToken, linkingUserId });

    if (!user?.email) {
        console.log('missing email');
        return res.status(400).json({ success: false });
    }

    if (!account?.provider) {
        console.log('missing provider');
        return res.status(400).json({ success: false });
    }

    if (!turnstileToken) {
        console.log('missing turnstile token');
        return res.status(400).json({ success: false });
    }

    if (!env.SERVER_JWT_SECRET) {
        console.log('missing jwt secret env');
        return res.status(500).json({ success: false });
    }

    const clientIp =
        req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;

    console.log('client ip:', clientIp);

    const isValid = await verifyTurnstileToken(turnstileToken, clientIp);

    console.log('turnstile valid:', isValid);

    if (!isValid) {
        console.log('turnstile rejected');
        return res.status(403).json({ success: false });
    }

    const isGithub = account.provider === 'github';

    console.log('is github:', isGithub);
    console.log('linking user id:', linkingUserId);

    let existingUser = null;

    if (linkingUserId) {
        console.log('checking user by linkingUserId');
        existingUser = await prisma.user.findUnique({
            where: { id: linkingUserId },
        });
        console.log('found by linkingUserId:', existingUser?.id || null);
    }

    if (!existingUser) {
        console.log('checking user by email');
        existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });
        console.log('found by email:', existingUser?.id || null);
    }

    let myUser;
    let owner: string | null = null;

    if (existingUser) {
        console.log('updating existing user:', existingUser.id);

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

        console.log('final update payload:', updateData);

        myUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: updateData,
        });

        console.log('user updated:', myUser.id);
    } else {
        console.log('creating new user');

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

        console.log('new user created:', myUser.id);
    }

    const jwtPayload = {
        id: myUser.id,
        email: myUser.email,
        name: myUser.name,
    };

    const token = jwt.sign(jwtPayload, env.SERVER_JWT_SECRET, { expiresIn: '30d' });

    console.log('jwt token created');

    console.log('sending final response');

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
}
