'use client';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useChatStore } from '@/src/store/user/useChatStore';
import BuilderMessage from './BuilderMessage';
import useGenerate from '@/src/hooks/useGenerate';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';

export default function BuilderChats() {
    const params = useParams();
    const contractId = params.contractId as string;
    const hasInitialized = useRef<boolean>(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { setContractId } = useChatStore();
    const { handleGeneration } = useGenerate();
    const { messages, loading } = useBuilderChatStore();
    const { activeTemplate } = useTemplateStore();

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (hasInitialized.current) {
            return;
        }
        if (!messages || messages.length === 0) return;
        if (messages.length <= 2 && messages[0].contractId === contractId) {
            hasInitialized.current = true;
            if (activeTemplate) {
                startChat(messages[0].content, activeTemplate.id);
            } else {
                startChat(messages[0].content);
            }
            setContractId(contractId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, messages.length]);

    async function startChat(instruction: string, template_id?: string) {
        handleGeneration(contractId, instruction, template_id);
    }

    function returnParsedData(message: string) {
        const result = message.split('<stage>')[0];
        return result;
    }

    return (
        <div
            className="w-full max-w-md min-w-md flex flex-col pt-4"
            style={{ height: 'calc(100vh - 3.5rem)' }}
        >
            <div className="flex-1 flex flex-col gap-y-3 text-light text-sm pl-4 overflow-y-auto min-h-0 custom-scrollbar">
                {messages.map((message) => (
                    <BuilderMessage
                        returnParsedData={returnParsedData}
                        key={message.id}
                        message={message}
                        loading={loading}
                    />
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="flex items-center justify-center w-full py-4 px-6 flex-shrink-0 relative">
                <BuilderChatInput />
            </div>
        </div>
    );
}
