import { Queue } from 'bullmq';
import queue_config from '../configs/configs.queue';
import { CommandExecutionPayload } from '@repo/types';

export default class OrchestratorToSocketQueue {
    private queue: Queue;

    constructor(queue_name: string) {
        this.queue = new Queue(queue_name, queue_config);
    }

    public async queue_logs(payload: CommandExecutionPayload) {
        try {
            const job = await this.queue.add('BUILD_LOGS', payload, {
                removeOnComplete: true,
                attempts: 1,
            });

            console.log('sending data to socket server from k8s');
            return job.id;
        } catch (error) {
            console.error('Failed to push log back to socket server', error);
        }
    }
}
