import { useState, useCallback } from 'react';
import { COMMAND_WRITER, CommandResponse } from '../lib/terminal_commands';
import { Line, TerminalTab } from '../types/terminal_types';
import { useWebSocket } from './useWebSocket';
import { COMMAND, TerminalSocketData } from '@repo/types';

interface UseTerminalLogicProps {
    contractId: string;
    token: string | undefined | null;
    addCommand: (command: string) => void;
    setIsRunning: (value: boolean) => void;
}

export function useTerminalLogic({ token, addCommand, setIsRunning }: UseTerminalLogicProps) {
    const [terminals, setTerminals] = useState<TerminalTab[]>([
        { id: '1', name: 'shell', logs: [], input: '' },
    ]);

    const [activeTab, setActiveTab] = useState<string>('1');
    const { sendSocketMessage } = useWebSocket();

    const appendLog = useCallback((tabId: string, line: Line) => {
        setTerminals((prev) =>
            prev.map((t) => (t.id === tabId ? { ...t, logs: [...t.logs, line] } : t)),
        );
    }, []);

    const updateLogs = useCallback((tabId: string, logs: Line[]) => {
        setTerminals((prev) => prev.map((t) => (t.id === tabId ? { ...t, logs } : t)));
    }, []);

    const updateInput = useCallback((tabId: string, input: string) => {
        setTerminals((prev) => prev.map((t) => (t.id === tabId ? { ...t, input } : t)));
    }, []);

    const handleCommand = useCallback(
        (command: string) => {
            if (!token) return;
            const trimmed = command.trim() as COMMAND_WRITER;
            if (!trimmed) return;

            addCommand(trimmed);
            let output = '';

            switch (trimmed) {
                case COMMAND_WRITER.CLEAR:
                    updateLogs(activeTab, []);
                    return;

                case COMMAND_WRITER.HELP:
                case COMMAND_WRITER.HOT_KEYS:
                case COMMAND_WRITER.PLATFORM:
                case COMMAND_WRITER.COMMANDS:
                    output = CommandResponse[trimmed];
                    break;

                case COMMAND_WRITER.WINTERFELL_BUILD:
                case COMMAND_WRITER.WINTERFELL_TEST:
                case COMMAND_WRITER.WINTERFELL_DEPLOY_DEVNET:
                case COMMAND_WRITER.WINTERFELL_DEPLOY_MAINNET: {
                    output = CommandResponse[trimmed];
                    setIsRunning(true);

                    switch (trimmed) {
                        case COMMAND_WRITER.WINTERFELL_BUILD:
                            sendSocketMessage(COMMAND.WINTERFELL_BUILD, trimmed);
                            break;
                        case COMMAND_WRITER.WINTERFELL_TEST:
                            sendSocketMessage(COMMAND.WINTERFELL_TEST, trimmed);
                            break;
                        case COMMAND_WRITER.WINTERFELL_DEPLOY_DEVNET:
                            sendSocketMessage(COMMAND.WINTERFELL_DEPLOY_DEVNET, trimmed);
                            break;
                        case COMMAND_WRITER.WINTERFELL_DEPLOY_MAINNET:
                            sendSocketMessage(COMMAND.WINTERFELL_DEPLOY_MAINNET, trimmed);
                            break;
                    }

                    break;
                }

                default:
                    output = `winterfell: command not found: ${trimmed}. Try --help`;
                    break;
            }

            appendLog(activeTab, { type: 'command', text: trimmed });
            appendLog(activeTab, { type: TerminalSocketData.SERVER_MESSAGE, text: output });
        },
        [token, activeTab, addCommand, appendLog, updateLogs, sendSocketMessage],
    );

    const deleteTerminal = useCallback((id: string) => {
        // keep at least one terminal
        return;
    }, []);

    const currentTerminal = terminals.find((t) => t.id === activeTab)!;

    return {
        terminals,
        activeTab,
        currentTerminal,
        setActiveTab,
        handleCommand,
        updateInput,
        updateLogs,
        deleteTerminal,
    };
}
