import { V1Job } from '@kubernetes/client-node';
import { env } from '../configs/configs.env';
import { pod_resources } from './resources.kubernetes';

interface JobConfig {
    job_name: string;
    job_id: string;
    command: string;
    user_id: string;
    contract_id: string;
}

export default function get_job_template(configs: JobConfig) {
    const { job_id, job_name, user_id, contract_id, command } = configs;

    const job_template: V1Job = {
        apiVersion: 'batch/v1',
        kind: 'Job',
        metadata: {
            name: job_name,
            namespace: env.KUBERNETES_NAMESPACE,
            labels: {
                app: 'winterfell-exec',
                'job-id': job_id,
                'contract-id': contract_id,
                'user-id': user_id,
            },
            annotations: {
                'created-at': new Date().toISOString(),
                'anchor-command': command,
            },
        },
        spec: {
            activeDeadlineSeconds: 900,
            backoffLimit: 0,
            ttlSecondsAfterFinished: 100,
            template: {
                metadata: {
                    labels: {
                        app: 'winterfell-exec',
                        'job-id': job_id,
                    },
                },
                spec: {
                    restartPolicy: 'Never',
                    containers: [
                        {
                            name: 'anchor-executor',
                            image: 'winterfellhub/test:latest',
                            // Keep container alive for exec commands
                            command: ['/bin/sh', '-c'],
                            args: ['tail -f /dev/null'],
                            workingDir: '/workspace',
                            volumeMounts: [
                                {
                                    name: 'workspace',
                                    mountPath: '/workspace',
                                },
                            ],
                            resources: pod_resources,
                            env: [
                                {
                                    name: 'RUST_BACKTRACE',
                                    value: '1',
                                },
                                {
                                    name: 'ANCHOR_WALLET',
                                    value: '/workspace/.config/solana/id.json',
                                },
                                {
                                    name: 'JOB_ID',
                                    value: job_id,
                                },
                                {
                                    name: 'CONTRACT_ID',
                                    value: contract_id,
                                },
                            ],
                            imagePullPolicy: 'Always',
                        },
                    ],
                    volumes: [
                        {
                            name: 'workspace',
                            emptyDir: {},
                        },
                    ],
                },
            },
        },
    };
    return job_template;
}
