'use client';
import { GET_CHAT_URL } from '@/routes/api_routes';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { useWebSocket } from '@/src/hooks/useWebSocket';
import { cleanWebSocketClient } from '@/src/lib/singletonWebSocket';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useTerminalLogStore } from '@/src/store/code/useTerminalLogStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import axios from 'axios';
import { useChatStore } from '@/src/store/user/useChatStore';
import React, { useEffect, useState, useCallback, useRef, use } from 'react';
import ContractReviewCard from '@/src/components/base/ContractReviewCard';
import { useRouter } from 'next/navigation';
import { IncomingPayload, WSServerIncomingPayload } from '@winterfell/types';

const REVIEW_STORAGE_KEY = 'contract-reviewed-';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { cleanStore, loading } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { addLog } = useTerminalLogStore();
    const { subscribeToHandler } = useWebSocket();
    const { resetContractId } = useChatStore();
    const { session } = useUserSessionStore();
    const { upsertMessage, messages } = useBuilderChatStore();
    const { parseFileStructure } = useCodeEditor();
    const router = useRouter();

    const [showReviewCard, setShowReviewCard] = useState(false);
    const navigationAttemptedRef = useRef(false);

    // Check if user has already reviewed this contract
    const hasReviewed = useCallback(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem(`${REVIEW_STORAGE_KEY}${contractId}`) === 'true';
    }, [contractId]);

    const [hasShownReview, setHasShownReview] = useState(hasReviewed);

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

    // Intercept browser back navigation
    useEffect(() => {
        // Don't block if no messages or already reviewed
        const shouldBlockNavigation = messages.length > 0 && !hasShownReview;

        if (!shouldBlockNavigation) {
            return;
        }

        function handlePopState(event: PopStateEvent) {
            // Block the navigation and show review card
            event.preventDefault();
            window.history.pushState(null, '', window.location.href);
            setShowReviewCard(true);
        }

        // Push initial state ONCE to enable popstate detection
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            // Clean up the extra history state we added
            // Only go back if the effect is cleaning up due to hasShownReview changing
            if (hasShownReview && window.history.state === null) {
                window.history.back();
            }
        };
    }, [messages.length, hasShownReview]);

    function handleIncomingTerminalLogs(message: WSServerIncomingPayload<IncomingPayload>) {
        const { line } = message.payload;
        console.log("message is : ", message);
        addLog({
            type: message.type,
            text: line,
        });
    }

    async function get_chat() {
        try {
            if (!session?.user.token) return;
            const { data } = await axios.post(
                GET_CHAT_URL,
                {
                    contractId: contractId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                },
            );
            const sortedMessages = [...data.messages].sort((a, b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
            for (let i = 0; i < sortedMessages.length; i++) {
                upsertMessage(sortedMessages[i]);
            }
            const parsedFiles = JSON.parse(data.contractFiles);
            if (parsedFiles) {
                parseFileStructure(parsedFiles);
            }
            setCollapseFileTree(true);
        } catch (error) {
            console.error('Error while fetching chats from server: ', error);
        }
    }

    useEffect(() => {
        if (loading) return;
        get_chat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, session]);

    useEffect(() => {
        subscribeToHandler(handleIncomingTerminalLogs);
        return () => {
            cleanStore();
            resetContractId();
            reset();
            cleanWebSocketClient();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId]);

    function handleReviewSubmit(data: { rating: number; liked: string; disliked: string }) {
        localStorage.setItem(`${REVIEW_STORAGE_KEY}${contractId}`, 'true');
        setShowReviewCard(false);
        setHasShownReview(true);
        navigationAttemptedRef.current = false;

        router.back();
    }

    function handleReviewClose() {
        localStorage.setItem(`${REVIEW_STORAGE_KEY}${contractId}`, 'true');
        setShowReviewCard(false);
        setHasShownReview(true);
        navigationAttemptedRef.current = false;
        router.back();
    }
    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <BuilderNavbar />
            <div className="flex-1 min-h-0 flex flex-col">
                <BuilderDashboard />
            </div>
            <ContractReviewCard
                contractId={use(params).contractId}
                open={showReviewCard}
                onClose={handleReviewClose}
                onSubmit={handleReviewSubmit}
            />
        </div>
    );
}
