import RedisPubSub from '../ws/redis.pubsub';
import SocketToOrchestratorQueue from '../queue/redis.queue';
import WebSocketServer from '../ws/socket.server';
import RedisSubscriberQueue from '../queue/redis.subscriber.queue';

export let wsserver: WebSocketServer;
export let redis_pubsub: RedisPubSub;
export let socket_orchestrator_queue: SocketToOrchestratorQueue;
export let redis_subscriber_queue: RedisSubscriberQueue;

export default function init_services() {
    try {
        redis_pubsub = new RedisPubSub();
        wsserver = new WebSocketServer(redis_pubsub);
        socket_orchestrator_queue = new SocketToOrchestratorQueue('socket-to-orchestrator');
        redis_subscriber_queue = new RedisSubscriberQueue('orchestrator-to-socket', redis_pubsub);
    } catch (error) {
        console.error('Error initializing services:', error);
        throw error;
    }
}
