export type WebSocketPayloadType = "RUN_COMMAND";

export enum TerminalSocketData {
  INFO = "INFO",
  lOGS = "lOGS",
  EXECUTING_COMMAND = 'EXECUTING_COMMAND',
  BUILD_ERROR = "BUILD_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_MESSAGE = "SERVER_MESSAGE",
  CONNECTED = "CONNECTED",
}

export interface WSServerIncomingPayload<T> {
  type: TerminalSocketData;
  payload: T;
}
