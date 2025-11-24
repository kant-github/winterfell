import './opentelemtry/instrumentation';

import express from 'express';
import http from 'http';
import env from './configs/config.env';
import cors from 'cors';
import router from './routes';
import init_services from './services/init';
import { loggingMiddleware } from './middlewares/middleware.logger';
import { logger } from './utils/logger';
import Agent from './generator/tools/agent';
import cookieParser from 'cookie-parser';
import Generator from './generator/temp/generator';
import { prisma } from '@repo/database';
import { MODEL } from './generator/types/model_types';
// import Agent from './generator/tools/agent';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(loggingMiddleware);
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);

app.use('/api/v1', router);

init_services();

server.listen(env.SERVER_PORT, () => {
    console.warn('Server is running on port : ', env.SERVER_PORT);
});

process.on('SIGINT', () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

const gen = async () => {

    const gen = new Generator();

    console.log('new contract generator called');

    const contract = await prisma.contract.create({
        data: {
            title: 'contractor',
            contractType: 'CUSTOM',
            userId: 'cmidirftj0000r6wlxid766om',
        },
    });

    gen.generate(
        'new',
        'create me a counter program with only increment',
        MODEL.GEMINI,
        contract.id,
    );

}
setTimeout(gen, 1000);