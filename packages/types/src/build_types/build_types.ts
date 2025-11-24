import { BuildStatus } from "@repo/database";
import { TerminalSocketData } from "../socket/const";

export interface BuildCacheCheck {
  isCached: boolean;
  codeHash: string | null;
  lastBuildStatus?: BuildStatus;
  lastBuildAt?: Date;
  buildJobId?: string;
  canReuseBuild: boolean;
}

export enum COMMAND {
  WINTERFELL_BUILD = "WINTERFELL_BUILD",
  WINTERFELL_TEST = "WINTERFELL_TEST",
  WINTERFELL_DEPLOY_DEVNET = "WINTERFELL_DEPLOY_DEVNET",
  WINTERFELL_DEPLOY_MAINNET = "WINTERFELL_DEPLOY_MAINNET",
  WINTERFELL_VERIFY = "WINTERFELL_VERIFY",
}

export interface BaseJobPayload {
  userId: string;
  contractId: string;
  contractName: string;
  timestamp: number;
  jobId: string;
  retryCount?: number;
}

export interface BuildJobPayload extends BaseJobPayload {
  command: COMMAND;
}

export interface BuildJobCompletionPayload extends BaseJobPayload {
  lines: string;
  type: TerminalSocketData;
}

export interface WSServerIncomingPayload<T> {
  type: TerminalSocketData;
  payload: T;
}

export interface CommandExecutionPayload {
  userId: string;
  contractId: string;
  jobId: string;
  line: string;
  timestamp: number;
  phase: TerminalSocketData;
}
