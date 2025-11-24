import KubernetesClient from '../k8s/client.kubernetes';
import KubernetesManager from '../k8s/manager.kubernetes';
import RedisPubSub from '../queue/redis.pubsub';
import RedisQueue from '../queue/redis.queue';
import RedisLockService from './redis.services';

export default class Services {
    public kubernetes_client: KubernetesClient;
    public kubernetes_manager: KubernetesManager;
    public redis_lock_service: RedisLockService;
    public redis_queue: RedisQueue;
    public redis_publisher: RedisPubSub;

    constructor() {
        this.kubernetes_client = new KubernetesClient();
        this.kubernetes_manager = new KubernetesManager(this.kubernetes_client);
        this.redis_lock_service = new RedisLockService();
        this.redis_queue = new RedisQueue('socket-to-orchestrator');
        this.redis_publisher = new RedisPubSub();
    }
}
