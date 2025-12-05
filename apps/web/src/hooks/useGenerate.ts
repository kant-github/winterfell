import { useRouter } from "next/navigation";
import { useBuilderChatStore } from "../store/code/useBuilderChatStore";
import { useTemplateStore } from "../store/user/useTemplateStore";
import { useUserSessionStore } from "../store/user/useUserSessionStore";
import { v4 as uuid } from 'uuid';
import { ChatRole } from "../types/prisma-types";
import { STAGE } from "../types/stream_event_types";
import { useExecutorStore } from "../store/model/useExecutorStore";
import { EXECUTOR } from "@winterfell/types";
import GenerateContract from "../lib/server/generate_contract";
import { useState } from "react";
import { toast } from "sonner";

export default function useGenerate() {

    const { session } = useUserSessionStore();
    const { activeTemplate, resetTemplate } = useTemplateStore();
    const { messages, setMessage } = useBuilderChatStore();
    const { executor } = useExecutorStore();
    const router = useRouter();
    const [hasContext, setHasContext] = useState<boolean>(false);


    function handleGeneration(
        contractId: string,
        from: 'root' | 'pg',
        instruction?: string,
        templateId?: string,
    ) {

        alert('use generator hook called');

        let messageCount = 0;

        // do the agentic generation 
        if (executor === EXECUTOR.AGENTIC) {
            if (templateId && activeTemplate) {
                // send template even if instruction is not given
                alert('template selected');
                setMessage({
                    id: uuid(),
                    contractId: contractId,
                    role: ChatRole.TEMPLATE,
                    content: '',
                    templateId: templateId,
                    template: activeTemplate,
                    stage: STAGE.START,
                    isPlanExecuted: false,
                    createdAt: new Date(),
                });
                messageCount++;
            }

            if (instruction) {
                // create user message
                alert('instruction given');
                setMessage({
                    id: uuid(),
                    contractId: contractId,
                    role: ChatRole.USER,
                    content: instruction,
                    stage: STAGE.START,
                    isPlanExecuted: false,
                    createdAt: new Date(),
                });
                messageCount++;
            }

            if (!session || !session.user || !session.user.token) {
                return;
            }

            // page redirection
            if (from === 'root') {
                router.push(`/playground/${contractId}`)
            }

            GenerateContract.start_agentic_executor(
                session.user.token,
                contractId,
                setHasContext,
                instruction,
                templateId,
                (error) => {
                    toast.error(error.message);
                    router.push('/');
                },
            );

            // continue only if instruction is found
        } else if (executor === EXECUTOR.PLAN && instruction) {
            // if template is found then make a template message
            if (templateId && activeTemplate) {
                setMessage({
                    id: uuid(),
                    contractId: contractId,
                    role: ChatRole.TEMPLATE,
                    content: instruction,
                    templateId: templateId,
                    template: activeTemplate,
                    stage: STAGE.START,
                    isPlanExecuted: false,
                    createdAt: new Date(),
                });
                messageCount++;
            }
            setMessage({
                id: uuid(),
                contractId: contractId,
                role: ChatRole.USER,
                content: instruction,
                stage: STAGE.START,
                isPlanExecuted: false,
                createdAt: new Date(),
            });
            messageCount++;
        }

        // page redirection
        if (from === 'root') {
            router.push(`/playground/${contractId}`)
        }

        // pick the last messages of messageCount
        const message = messages.slice(-messageCount);
    }

    return {
        handleGeneration,
    };
}