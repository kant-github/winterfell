'use client';
import { GET_CHAT_URL } from '@/routes/api_routes';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { cleanWebSocketClient } from '@/src/lib/singletonWebSocket';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import axios from 'axios';
import { useChatStore } from '@/src/store/user/useChatStore';
import React, { useEffect, useState, useCallback, useRef, use } from 'react';
import ContractReviewCard from '@/src/components/base/ContractReviewCard';
import { useRouter } from 'next/navigation';
import Playyground from '@/src/lib/server/playground';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';

const REVIEW_STORAGE_KEY = 'contract-reviewed-';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { cleanStore, loading, messages, upsertMessage } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree, parseFileStructure } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { resetContractId } = useChatStore();
    const { session } = useUserSessionStore();
    const router = useRouter();
    const [showReviewCard, setShowReviewCard] = useState(false);
    const navigationAttemptedRef = useRef(false);
    const hasReviewed = useCallback(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem(`${REVIEW_STORAGE_KEY}${contractId}`) === 'true';
    }, [contractId]);

    const [hasShownReview, setHasShownReview] = useState(hasReviewed);
    const { activeTemplate } = useTemplateStore();

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

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            if (hasShownReview && window.history.state === null) {
                window.history.back();
            }
        };
    }, [messages.length, hasShownReview]);

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
