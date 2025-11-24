import { Job, Worker } from 'bullmq';
import { env } from '../configs/config.env';
import RedisPubSub from '../ws/redis.pubsub';
import { TerminalSocketData } from '@repo/types';

export default class RedisSubscriberQueue {
    private worker: Worker;
    private redis: RedisPubSub;

    constructor(queue_name: string, redis: RedisPubSub) {
        this.worker = new Worker(queue_name, this.process_job.bind(this), {
            connection: {
                url: env.SOCKET_REDIS_URL,
            },
        });
        this.redis = redis;
    }

    private async process_job(job: Job) {
        const { userId, contractId, line, timestamp, type, jobId, phase } = job.data;
        const topic = `${userId}_${contractId}`;

        const outgoing = {
            type: type as TerminalSocketData,
            payload: {
                line,
                timestamp,
                jobId,
                userId,
                contractId,
                phase,
            },
        };
        const json = JSON.stringify(outgoing);

        console.log('Publishing to redis:', json);
        this.redis.publish(topic, json);
    }
}
