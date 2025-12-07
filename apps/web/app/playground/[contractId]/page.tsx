'use client';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { cleanWebSocketClient } from '@/src/lib/singletonWebSocket';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useChatStore } from '@/src/store/user/useChatStore';
import React, { useEffect, use } from 'react';
import ContractReviewCard from '@/src/components/base/ContractReviewCard';
import Playground from '@/src/lib/server/playground';
import { useReviewModalStore } from '@/src/store/user/useReviewModalStore';
import { ChatRole } from '@/src/types/prisma-types';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { cleanStore, loading, setLoading } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { resetContractId } = useChatStore();
    const { session } = useUserSessionStore();
    const { open, hide } = useReviewModalStore();

    useEffect(() => {
        if (!session?.user?.token) return;

        let interval: NodeJS.Timeout | null = null;
        let stopped = false;

        const poll = async () => {
            if (!session?.user?.token) return;
            if (stopped) return;

            // setLoading(true);
            await Playground.get_chat(session.user.token, contractId);

            const { messages } = useBuilderChatStore.getState();
            if (messages.length === 0) return;

            const last = messages[messages.length - 1];

            const shouldContinue = last.role === ChatRole.SYSTEM;

            if (!shouldContinue) {
                if (interval) clearInterval(interval);
                stopped = true;
                setLoading(false);
            }
        };

        poll();

        interval = setInterval(poll, 2000);

        return () => {
            stopped = true;
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, session?.user?.token]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
                event.preventDefault();
                setCollapseFileTree(!collapseFileTree);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    useEffect(() => {
        function handleHideContractReviewCard(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                hide();
            }
        }
        document.addEventListener('keydown', handleHideContractReviewCard);
        return () => document.removeEventListener('keydown', handleHideContractReviewCard);
    });

    useEffect(() => {
        if (loading || !session || !session.user || !session.user.token) return;
        Playground.get_chat(session.user.token, contractId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, session]);

    useEffect(() => {
        if (!session || !session.user) return;

        const { messages } = useBuilderChatStore.getState();
        if (messages.length === 0) return;

        const last = messages[messages.length - 1];

        if (last.role === ChatRole.SYSTEM || last.role === ChatRole.USER) setLoading(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, session]);

    useEffect(() => {
        return () => {
            cleanStore();
            resetContractId();
            reset();
            cleanWebSocketClient();
        };
    }, [contractId]);

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden tracking-wider">
            <BuilderNavbar />
            <div className="flex-1 min-h-0 flex flex-col">
                <BuilderDashboard />
            </div>
            <ContractReviewCard
                contractId={use(params).contractId}
                open={open}
                onClose={hide}
                onSubmit={() => hide()}
            />
        </div>
    );
}
