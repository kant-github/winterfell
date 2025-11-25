import { useCallback } from 'react';
import { COMMAND_WRITER, CommandResponse } from '../lib/terminal_commands';
import { useWebSocket } from './useWebSocket';
import { COMMAND } from '@repo/types';
import { useTerminalLogStore } from '../store/code/useTerminalLogStore';
import { useCommandHistoryStore } from '../store/code/useCommandHistoryStore';

export function useTerminal() {
    const { addLog, setLogs } = useTerminalLogStore();
    const { sendSocketMessage } = useWebSocket();
    const { addCommand } = useCommandHistoryStore();

    const handleCommand = useCallback(
        (command: string) => {
            const trimmed = command.trim() as COMMAND_WRITER;
            if (!trimmed) return;

            addCommand(trimmed);
            addLog({ type: 'command', text: trimmed });

            switch (trimmed) {
                case COMMAND_WRITER.CLEAR:
                    setLogs([]);
                    return;

                case COMMAND_WRITER.HELP:
                case COMMAND_WRITER.HOT_KEYS:
                case COMMAND_WRITER.PLATFORM:
                case COMMAND_WRITER.COMMANDS:
                    addLog({ type: 'command', text: CommandResponse[trimmed] });
                    return;

                case COMMAND_WRITER.WINTERFELL_BUILD:
                    addLog({ type: 'client', text: CommandResponse[trimmed] });
                    sendSocketMessage(COMMAND.WINTERFELL_BUILD, trimmed);
                    return;

                case COMMAND_WRITER.WINTERFELL_TEST:
                    addLog({ type: 'client', text: CommandResponse[trimmed] });
                    sendSocketMessage(COMMAND.WINTERFELL_TEST, trimmed);
                    return;

                case COMMAND_WRITER.WINTERFELL_DEPLOY_DEVNET:
                    addLog({ type: 'client', text: CommandResponse[trimmed] });
                    sendSocketMessage(COMMAND.WINTERFELL_DEPLOY_DEVNET, trimmed);
                    return;

                case COMMAND_WRITER.WINTERFELL_DEPLOY_MAINNET:
                    addLog({ type: 'client', text: CommandResponse[trimmed] });
                    sendSocketMessage(COMMAND.WINTERFELL_DEPLOY_MAINNET, trimmed);
                    return;

                default:
                    addLog({
                        type: 'error',
                        text: `winterfell: command not found: ${trimmed}. Try --help`,
                    });
            }
        },
        [addCommand, sendSocketMessage, addLog, setLogs],
    );

    return { handleCommand };
}
