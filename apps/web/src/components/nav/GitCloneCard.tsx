'use client';
import { useEffect, useRef, useState } from 'react';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
import { IoIosSend } from 'react-icons/io';
import { HiPencil } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import ToolTipComponent from '../ui/TooltipComponent';
import { Input } from '../ui/input';
import { cn } from '@/src/lib/utils';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useChatStore } from '@/src/store/user/useChatStore';
import { toast } from 'sonner';
import GithubServer from '@/src/lib/server/github-server';
import useDebounce from '@/src/hooks/useDebounce';
import { RxCross2 } from 'react-icons/rx';

enum CloneOptions {
    HTTPS = 'HTTPS',
    SSH = 'SSH',
}

export default function GitCloneCard() {
    const [activeTab, setActiveTab] = useState<CloneOptions>(CloneOptions.HTTPS);
    const [repoName, setRepoName] = useState<string>('winterfell');
    const [editingRepo, setEditingRepo] = useState<boolean>(false);
    const [inputError, setInputError] = useState<boolean>(false);
    const [isRepoValid, setIsRepoValid] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [isPushing, setIsPushing] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const { contractId } = useChatStore();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const debouncedRepoName = useDebounce(repoName, 1000);

    const username = session?.user.githubUsername;
    const httpsURL = `https://github.com/${username}/${repoName}.git`;
    const sshURL = `git@github.com:${username}/${repoName}.git`;
    const finalURL = activeTab === CloneOptions.HTTPS ? httpsURL : sshURL;

    useEffect(() => {
        if (editingRepo && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingRepo]);

    useEffect(() => {
        if (!editingRepo) return;

        if (!debouncedRepoName.trim()) {
            setIsRepoValid(null);
            return;
        }
        handleOnClick();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedRepoName]);

    async function handleOnClick() {
        const trimmed = repoName.trim();
        if (!trimmed) {
            toast.warning('Enter a valid repo name');
            setInputError(true);
            return;
        }
        if (!GithubServer.validateRepoNameFormat(trimmed)) {
            toast.warning('Invalid repo name format');
            setInputError(true);
            return;
        }
        setRepoName(trimmed);
        setIsChecking(true);
        setInputError(false);

        try {
            if (!session || !session.user.token) return;
            const result = await GithubServer.checkRepoName(
                trimmed,
                contractId ?? window.location.pathname.split('/playground/')[1],
                session.user.token,
            );

            if (result.success) {
                setIsRepoValid(true);
                setEditingRepo(false);
                toast.success('Repo name is available');
            } else {
                setIsRepoValid(false);
                setInputError(true);
                toast.warning(result.message);
            }
        } catch {
            toast.error('Failed to validate repo name');
            setInputError(true);
            setIsRepoValid(false);
        } finally {
            setIsChecking(false);
        }
    }

    async function handleCodePushToGithub() {
        const trimmed = repoName.trim();
        if (!trimmed) {
            toast.error('Please enter a repository name');
            return;
        }
        if (!GithubServer.validateRepoNameFormat(trimmed)) {
            toast.error('Invalid repo name format');
            return;
        }
        if (isRepoValid === false) {
            toast.error('Repo name unavailable');
            return;
        }

        try {
            setIsPushing(true);
            if (!session || !session.user.token) return;
            const result = await GithubServer.pushCodeToGithub(
                trimmed,
                contractId ?? window.location.pathname.split('/playground')[1],
                session?.user.token,
            );
            if (result.success) {
                toast.loading('Pushing...');
                await new Promise((res) => setTimeout(res, 1000));
                toast.success('Code exported to GitHub');
            } else {
                toast.error(result.message || 'Failed to export');
            }
        } catch {
            toast.error('GitHub export failed');
        } finally {
            setIsPushing(false);
        }
    }

    const borderColor = inputError
        ? 'border-red-500'
        : isRepoValid
          ? 'border-emerald-500'
          : 'border-neutral-800';

    const isSendDisabled = isPushing || editingRepo || isRepoValid !== true;

    return (
        <div className="flex flex-col gap-y-3 overflow-hidden">
            <div className="flex gap-x-2">
                <Button
                    onClick={() => {
                        setActiveTab(CloneOptions.HTTPS);
                        setEditingRepo(false);
                    }}
                    size="xs"
                    className={cn(
                        'text-[11px] tracking-wider font-semibold !bg-dark text-light border border-transparent',
                        activeTab === CloneOptions.HTTPS
                            ? 'border text-dark !bg-light'
                            : 'hover:brightness-125',
                    )}
                >
                    HTTPS
                </Button>

                <Button
                    onClick={() => {
                        setActiveTab(CloneOptions.SSH);
                        setEditingRepo(false);
                    }}
                    size="xs"
                    className={cn(
                        'text-[11px] tracking-wider font-semibold !bg-dark text-light border border-transparent',
                        activeTab === CloneOptions.SSH
                            ? 'border text-dark !bg-light'
                            : 'hover:brightness-125',
                    )}
                >
                    SSH
                </Button>
            </div>

            <div className="flex items-center gap-2 w-full">
                <div
                    className={cn(
                        'relative group flex-1 bg-dark/50 border border-neutral-800 px-3 py-2 rounded-[4px] flex items-center',
                        borderColor,
                        'overflow-hidden',
                    )}
                >
                    {editingRepo ? (
                        <div className="flex items-center w-full whitespace-nowrap overflow-hidden pr-12">
                            <span className="text-light/70 flex-shrink-0">
                                https://github.com/{username}/
                            </span>

                            <Input
                                ref={inputRef}
                                value={repoName}
                                onChange={(e) => {
                                    setRepoName(e.target.value);
                                    setInputError(false);
                                    setIsRepoValid(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isChecking) {
                                        e.preventDefault();
                                        handleOnClick();
                                    }
                                }}
                                className="bg-transparent border-none focus-visible:ring-0 h-5 outline-none px-1 pl-0 text-light/90 flex-shrink"
                            />
                        </div>
                    ) : (
                        <Input
                            className="text-[13px] h-5 tracking-wider truncate select-none pr-12 pl-0 bg-transparent border-none focus-visible:ring-0"
                            value={finalURL}
                            readOnly
                        />
                    )}

                    <div className="absolute right-3 inset-y-0 flex items-center gap-3">
                        {!editingRepo && (
                            <ToolTipComponent content="Copy">
                                <IoCopyOutline
                                    className="size-4 cursor-pointer text-light/80 hover:-translate-y-px transition-transform"
                                    onClick={() => navigator.clipboard.writeText(finalURL)}
                                />
                            </ToolTipComponent>
                        )}

                        <AnimatePresence initial={false} mode="wait">
                            {editingRepo ? (
                                <motion.div
                                    key="status"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {isChecking ? (
                                        <div className="size-4 border-[2px] border-light/40 border-t-transparent rounded-full animate-spin" />
                                    ) : isRepoValid === true ? (
                                        <IoCheckmark className="size-4 text-green-400" />
                                    ) : isRepoValid === false ? (
                                        <RxCross2 className="size-4 text-red-600" />
                                    ) : null}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="pencil"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <ToolTipComponent content="Edit repo name">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInputError(false);
                                                setEditingRepo(true);
                                            }}
                                            className="cursor-pointer hover:-translate-y-px transition-transform"
                                        >
                                            <HiPencil className="size-4" />
                                        </button>
                                    </ToolTipComponent>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <Button
                    size="icon"
                    disabled={isSendDisabled}
                    onClick={handleCodePushToGithub}
                    className={cn(
                        'h-8 w-8 flex items-center justify-center',
                        isSendDisabled && 'opacity-60',
                    )}
                >
                    {isPushing ? (
                        <div className="size-4 border-[2px] border-light/60 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <IoIosSend className="size-5" />
                    )}
                </Button>
            </div>
        </div>
    );
}
