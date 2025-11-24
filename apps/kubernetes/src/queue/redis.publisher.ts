import { IncomingPayload, TerminalSocketData, WSServerIncomingPayload } from '@repo/types';
import Redis from 'ioredis';

export default class RedisPubSub {
    private publisher: Redis;

    constructor() {
        this.publisher = new Redis('');
    }

    private async publish(topic: string, message: WSServerIncomingPayload<IncomingPayload>) {
        try {
            const stringified_message = JSON.stringify(message);
            await this.publisher.publish(topic, stringified_message);
            console.log('publishing the msg to socket server');
        } catch (error) {
            console.error('Failed to publish redis evetn');
        }
    }

    private create_payload_structure(
        type: TerminalSocketData,
        payload: IncomingPayload,
    ): WSServerIncomingPayload<IncomingPayload> {
        return { type, payload };
    }

    public send_info(topic: string, payload: IncomingPayload) {
        return this.publish(topic, this.create_payload_structure(TerminalSocketData.INFO, payload)); // purple color
    }

    public send_logs(topic: string, payload: IncomingPayload) {
        return this.publish(topic, this.create_payload_structure(TerminalSocketData.LOGS, payload)); // green color
    }

    public send_command_exectuion(topic: string, payload: IncomingPayload) {
        return this.publish(
            topic,
            this.create_payload_structure(TerminalSocketData.EXECUTING_COMMAND, payload),
        ); // amber color
    }

    public send_build_error(topic: string, payload: IncomingPayload) {
        return this.publish(
            topic,
            this.create_payload_structure(TerminalSocketData.BUILD_ERROR, payload),
        ); // red color
    }

    public send_error_message(topic: string, payload: IncomingPayload) {
        return this.publish(
            topic,
            this.create_payload_structure(TerminalSocketData.ERROR_MESSAGE, payload),
        ); //red color
    }

    public send_validation_error(topic: string, payload: IncomingPayload) {
        return this.publish(
            topic,
            this.create_payload_structure(TerminalSocketData.VALIDATION_ERROR, payload),
        );
    }

    public send_server_message(topic: string, payload: IncomingPayload) {
        return this.publish(
            topic,
            this.create_payload_structure(TerminalSocketData.SERVER_MESSAGE, payload),
        ); // amber color
    }

    public send_completion_message(topic: string, payload: IncomingPayload) {
        return this.publish(
            topic,
            this.create_payload_structure(TerminalSocketData.COMPLETED, payload),
        );
    }
}
