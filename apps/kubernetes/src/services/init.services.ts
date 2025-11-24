import KubernetesClient from '../k8s/client.kubernetes';
import KubernetesManager from '../k8s/manager.kubernetes';
import OrchestratorToSocketQueue from '../queue/redis.publisher';
import RedisSubscriberQueue from '../queue/redis.subscriber.queue';
import RedisLockService from './redis.services';

export default class Services {
    public kubernetes_client: KubernetesClient;
    public kubernetes_manager: KubernetesManager;
    public redis_lock_service: RedisLockService;
    public redis_queue: RedisSubscriberQueue;
    public orchestrator_socket_queue: OrchestratorToSocketQueue;

    constructor() {
        this.kubernetes_client = new KubernetesClient();
        this.kubernetes_manager = new KubernetesManager(this.kubernetes_client);
        this.redis_lock_service = new RedisLockService();
        this.redis_queue = new RedisSubscriberQueue('socket-to-orchestrator');
        this.orchestrator_socket_queue = new OrchestratorToSocketQueue('orchestrator-to-socket');
    }
}
