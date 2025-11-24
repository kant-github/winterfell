import { CoreV1Api, Exec, KubeConfig, Log } from '@kubernetes/client-node';

export default class KubernetesClient {
    public core_api: CoreV1Api;
    public kube_config: KubeConfig;
    public log: Log;
    public exec: Exec;

    constructor() {
        this.kube_config = new KubeConfig();
        this.kube_config.loadFromDefault();
        this.core_api = this.kube_config.makeApiClient(CoreV1Api);
        this.log = new Log(this.kube_config);
        this.exec = new Exec(this.kube_config);
    }
}
