import { BuildJobPayload, COMMAND } from "@repo/types";
import { Job, Worker } from "bullmq";
import { kubernetes_services } from "..";
import { PodServices } from "../services/pod.services";
import { env } from "../configs/configs.env";

export default class RedisQueue {
  private queue: Worker;
  private namespace: string = env.KUBERNETES_NAMESPACE;

  constructor(queue_name: string) {
    this.queue = new Worker(queue_name, this.process_job.bind(this), {
      connection: {
        url: env.KUBERNETES_REDIS_URL,
      },
    });
  }

  private async process_job(job: Job) {
    const command = job.name as COMMAND;
    const payload = job.data as BuildJobPayload;
    console.log(`Processing job ${job.id}: ${command}`);

    try {
      switch (command) {
        case COMMAND.WINTERFELL_BUILD:
          return await this.handleBuild(payload);
        case COMMAND.WINTERFELL_TEST:
          return await this.handleTest(payload);
        case COMMAND.WINTERFELL_DEPLOY_DEVNET:
          return await this.handleDeployDevnet(payload);
        case COMMAND.WINTERFELL_DEPLOY_MAINNET:
          return await this.handleDeployMainnet(payload);
        case COMMAND.WINTERFELL_VERIFY:
          return await this.handleVerify(payload);
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }

  private async handleBuild(payload: BuildJobPayload) {
    console.log("run build command");
    try {
      const { userId, contractId, contractName, jobId, command } = payload;

      const pod_exists =
        await kubernetes_services.redis_lock_service.is_acquired(
          userId,
          contractId,
        );
      if (pod_exists) {
        throw new Error("Pod already exists for the same command execution");
      }

      console.log(
        "contract id is ------------------------------->  ",
        contractId,
      );

      const locked = await kubernetes_services.redis_lock_service.acquire_lock(
        userId,
        contractId,
      );
      if (!locked) {
        throw new Error("Failed to acquire lock");
      }
      console.log("lock acquired ------------------------------->");

      const files = await PodServices.get_codebase(contractId);
      if (!files || files.length === 0) {
        throw new Error("No files foudn");
      }
      console.log("received codebase ------------------------------->");

      const pod_name = await kubernetes_services.kubernetes_manager.create_pod(
        jobId,
        userId,
        contractId,
        command,
      );
      console.log("created pod ------------------------------->", pod_name);

      await kubernetes_services.kubernetes_manager.wait_for_pod_running(
        pod_name,
      );
      console.log("pod running -------------------------------------------->");
      await kubernetes_services.kubernetes_manager.wait_for_container_ready(
        this.namespace,
        pod_name,
        "anchor-executor",
      );
      console.log(
        "container ready, copying files to pod ------------------------------->",
      );
      await kubernetes_services.kubernetes_manager.copy_files_to_pod(
        this.namespace,
        pod_name,
        files,
      );

      console.log("runnign command ion pod ------------------------------->");
      await kubernetes_services.kubernetes_manager.run_command_on_pod({
        namespace: this.namespace,
        pod_name,
        container_name: "anchor-executor",
        command: ["sh", "-c", "anchor build"],
        onData: (chunk) => console.log(chunk),
      });

      return { success: true, message: "Build completed" };
    } catch (error) {
      console.error("Build failed");
      throw Error("phailedddd");
    } finally {
      console.log("deleting pod ---------------------------->");
      await kubernetes_services.kubernetes_manager.delete_pod(
        payload.userId,
        payload.contractId,
      );
      console.log("pod deleted, releasing lock --------------------------->");
      await kubernetes_services.redis_lock_service.release_lock(
        payload.userId,
        payload.contractId,
      );
      console.log("released lock");
    }
  }

  private async handleTest(payload: BuildJobPayload) {
    console.log("Testing contract:", payload.contractId);
    try {
      const { userId, contractId, contractName, jobId, command } = payload;

      const pod_exists =
        await kubernetes_services.redis_lock_service.is_acquired(
          userId,
          contractId,
        );
      if (pod_exists) {
        throw new Error("Pod already exists for the same command execution");
      }

      console.log(
        "contract id is ------------------------------->  ",
        contractId,
      );

      const locked = await kubernetes_services.redis_lock_service.acquire_lock(
        userId,
        contractId,
      );
      if (!locked) {
        throw new Error("Failed to acquire lock");
      }
      console.log("lock acquired ------------------------------->");

      const files = await PodServices.get_codebase(contractId);
      if (!files || files.length === 0) {
        throw new Error("No files foudn");
      }
      console.log("received codebase ------------------------------->");

      const pod_name = await kubernetes_services.kubernetes_manager.create_pod(
        jobId,
        userId,
        contractId,
        command,
      );
      console.log("created pod ------------------------------->", pod_name);

      await kubernetes_services.kubernetes_manager.wait_for_pod_running(
        pod_name,
      );
      console.log("pod running -------------------------------------------->");
      await kubernetes_services.kubernetes_manager.wait_for_container_ready(
        this.namespace,
        pod_name,
        "anchor-executor",
      );
      console.log(
        "container ready, copying files to pod ------------------------------->",
      );
      await kubernetes_services.kubernetes_manager.copy_files_to_pod(
        this.namespace,
        pod_name,
        files,
      );

      console.log("runnign command ion pod ------------------------------->");
      await kubernetes_services.kubernetes_manager.run_command_on_pod({
        namespace: this.namespace,
        pod_name,
        container_name: "anchor-executor",
        command: ["sh", "-c", "anchor test"],
        onData: (chunk) => console.log(chunk),
      });

      return { success: true, message: "Test completed" };
    } catch (error) {
      console.error("Build failed");
      throw Error("phailedddd");
    } finally {
      console.log("deleting pod ---------------------------->");
      await kubernetes_services.kubernetes_manager.delete_pod(
        payload.userId,
        payload.contractId,
      );
      console.log("pod deleted, releasing lock --------------------------->");
      await kubernetes_services.redis_lock_service.release_lock(
        payload.userId,
        payload.contractId,
      );
      console.log("released lock");
    }
  }

  private async handleDeployDevnet(payload: BuildJobPayload) {
    console.log("Deploying to devnet:", payload.contractId);
    return { success: true, message: "Deployed to devnet" };
  }

  private async handleDeployMainnet(payload: BuildJobPayload) {
    console.log("Deploying to mainnet:", payload.contractId);
    return { success: true, message: "Deployed to mainnet" };
  }

  private async handleVerify(payload: BuildJobPayload) {
    console.log("Verifying contract:", payload.contractId);
    return { success: true, message: "Verification completed" };
  }

  public async close() {
    await this.queue.close();
  }
}
