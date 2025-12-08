import express from 'express';
import http from 'http';
import env from './configs/config.env';
import cors from 'cors';
import router from './routes';
import init_services from './services/init';
import { logger } from './utils/logger';
import cookieParser from 'cookie-parser';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
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
