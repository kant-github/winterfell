import ObjectStore from '../class/object_store';
import ContentGenerator from '../controllers/gen/content_generator';
import Generator from '../generator/temp/generator';
import RazorpayGateway from '../payments/razorpay';
import { GithubWorkerQueue } from '../queue/github_worker_queue';
import ServerToOrchestratorQueue from '../queue/queue.redis';
import GithubServices from './services.github';

export let contentGenerator: ContentGenerator;
export let objectStore: ObjectStore;
export let razorpay: RazorpayGateway;
export let server_orchestrator_queue: ServerToOrchestratorQueue;
export let github_worker_queue: GithubWorkerQueue;
export let generator: Generator;
export let github_services: GithubServices;

export default function init_services() {
    contentGenerator = new ContentGenerator();
    objectStore = new ObjectStore();
    razorpay = new RazorpayGateway();
    // server_orchestrator_queue = new ServerToOrchestratorQueue('server-to-orchestrator');
    github_worker_queue = new GithubWorkerQueue('github-push');
    generator = new Generator();
    github_services = new GithubServices();
}
