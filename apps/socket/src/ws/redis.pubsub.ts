import Redis from 'ioredis';

export default class RedisPubSub {
    private publisher: Redis;
    private subscriber: Redis;
    private is_connected: boolean = false;
    private handlers: Map<string, (message: string) => void> = new Map();

    constructor() {
        this.publisher = new Redis('');
        this.subscriber = new Redis('');
        this.is_connected = true;

        this.subscriber.on('message', (channel: string, message: string) => {
            const handler = this.handlers.get(channel);
            if (handler) handler(message);
        });
    }

    /**
     * this method is used to subscribe to a topic in the redis channel
     *
     * @param topic
     */
    public subscribe(topic: string, handler: (message: string) => void) {
        if (!this.is_connected) return;
        this.handlers.set(topic, handler);
        this.subscriber.subscribe(topic);
    }

    /**
     * this method is used to publish a message
     *
     * @param topic
     * @param message
     */
    public publish(topic: string, message: string) {
        return this.publisher.publish(topic, message);
    }

    /**
     *
     * @param topic
     */
    public unsubscribe(topic: string) {
        this.handlers.delete(topic);
        this.subscriber.unsubscribe(topic);
    }
}
