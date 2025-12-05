'use client';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GENERATE_CONTRACT, GENERATE_TEMPLATE } from '@/routes/api_routes';

import { useChatStore } from '@/src/store/user/useChatStore';
import { ChatRole } from '@/src/types/prisma-types';
import { toast } from 'sonner';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import GenerateContract from '@/src/lib/server/generate_contract';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import BuilderMessage from './BuilderMessage';

export default function BuilderChats() {
    const [hasContext, setHasContext] = useState<boolean>(false);
    const params = useParams();
    const router = useRouter();
    const contractId = params.contractId as string;
    const hasInitialized = useRef<boolean>(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { activeTemplate, resetTemplate } = useTemplateStore();
    const { session } = useUserSessionStore();
    const { setContractId } = useChatStore();
    const { messages, loading, setLoading } = useBuilderChatStore();
    const { setCollapseFileTree, parseFileStructure } = useCodeEditor();

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (hasInitialized.current) return;
        if (
            activeTemplate &&
            activeTemplate.id &&
            messages.length === 1 &&
            messages[0].role === ChatRole.USER &&
            messages[0].contractId === contractId
        ) {
            getTemplates(messages[0].content);
        } else if (
            messages.length === 1 &&
            messages[0].role === 'USER' &&
            messages[0].contractId === contractId
        ) {
            hasInitialized.current = true;
            startChat(messages[0].content);
            setContractId(contractId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, messages.length]);

    async function getTemplates(message: string) {
        try {
            setLoading(true);
            const response = await fetch(GENERATE_CONTRACT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({
                    contract_id: contractId,
                    template_id: activeTemplate?.id,
                    instruction: message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate template');
            }
            const json = await response.json();

            const files = json.data;
            if (!Array.isArray(files)) {
                throw new Error('Invalid template data');
            }

            parseFileStructure(files);
            setCollapseFileTree(true);
            resetTemplate();
        } catch (error) {
            console.error('Chat stream error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function startChat(message: string) {
        await GenerateContract.router(
            session?.user.token || '',
            contractId,
            message,
            setHasContext,
            (error) => {
                toast.error(error.message);
                router.push('/');
            },
        );
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
                        hasContext={hasContext}
                        key={message.id}
                        message={message}
                        loading={loading}
                    />
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="flex items-center justify-center w-full py-4 px-6 flex-shrink-0">
                <BuilderChatInput />
            </div>
        </div>
    );
}
