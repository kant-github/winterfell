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
import Playyground from '@/src/lib/server/playground';
import { useReviewModalStore } from '@/src/store/user/useReviewModalStore';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { cleanStore, loading } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { resetContractId } = useChatStore();
    const { session } = useUserSessionStore();
    const { open, hide } = useReviewModalStore();

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
        if (loading || !session || !session.user || !session.user.token) return;
        Playyground.get_chat(session.user.token, contractId);
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
        <div className="h-screen w-screen flex flex-col overflow-hidden">
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
