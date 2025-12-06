'use client';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import Turnstile from 'react-turnstile';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { SiRust, SiSolana } from 'react-icons/si';
import { IoSparkles } from 'react-icons/io5';
import OpacityBackground from '../utility/OpacityBackground';
import { Button } from '../ui/button';
import AppLogo from '../tickers/AppLogo';
import { cn } from '@/src/lib/utils';

interface LoginModalProps {
    opensignInModal: boolean;
    setOpenSignInModal: Dispatch<SetStateAction<boolean>>;
}

function LoginLeftPanel() {
    return (
        <div className="col-span-1 relative w-full h-full">
            <Image
                src="/images/template/login-shader.png"
                fill
                alt="Login Illustration"
                className="object-cover"
                unoptimized
                priority
            />

            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-between p-8">
                <div className="flex items-start">
                    <AppLogo />
                </div>

                <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-bold text-light tracking-wide leading-tight">
                        Where AI meets Anchor.
                        <br />
                        <span className="text-light">No PhD required.</span>
                    </h3>

                    <p className="text-sm text-light/70 leading-relaxed max-w-[300px]">
                        Generate Rust smart contracts, deploy to Solana, and ship production-ready
                        dApps. All with the confidence of someone who actually read the Anchor docs.
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                        <IoSparkles
                            className={cn(
                                'text-[#9e83ff] text-xl h-10 w-10 p-2 border border-neutral-500 rounded-[8px]',
                            )}
                        />
                        <SiRust
                            className={cn(
                                'text-[#ff6b35] text-xl h-10 w-10 p-2 border border-neutral-500 rounded-[8px]',
                            )}
                        />
                        <SiSolana
                            className={cn(
                                'text-[#14F195] text-xl h-10 w-10 p-2 border border-neutral-500 rounded-[8px]',
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginModalRight({ opensignInModal, setOpenSignInModal }: LoginModalProps) {
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const [signingInProvider, setSigningInProvider] = useState<'GOOGLE' | 'GITHUB' | null>(null);

    async function handleSignIn(type: 'GOOGLE' | 'GITHUB') {
        if (!turnstileToken) {
            return;
        }

        setSigningInProvider(type);

        try {
            document.cookie = `turnstile_token=${turnstileToken}; path=/; max-age=300; SameSite=Lax; Secure`;
            await signIn(type === 'GOOGLE' ? 'google' : 'github', {
                redirect: false,
                callbackUrl: '/',
            });
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setSigningInProvider(null);
        }
    }

    return (
        <div
            className={cn(
                'w-full max-w-[420px] px-10 py-8',
                'flex flex-col items-center justify-center',
                'z-50 relative overflow-hidden h-full',
            )}
        >
            <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-5">
                <div className="text-center space-y-1">
                    <h2
                        className={cn(
                            'text-xl font-bold tracking-widest',
                            'bg-gradient-to-br from-[#e9e9e9] to-[#575757]',
                            'bg-clip-text text-transparent',
                        )}
                    >
                        Welcome to WINTERFELL
                    </h2>
                    <p className="text-[13px] text-light/80 tracking-wide">
                        Sign in to your account
                    </p>
                </div>

                <Button
                    onClick={() => handleSignIn('GOOGLE')}
                    disabled={!turnstileToken || signingInProvider !== null}
                    className={cn(
                        'w-full flex items-center justify-center gap-3',
                        'px-6 py-5 text-sm font-medium',
                        'bg-[#0f0f0f] hover:bg-[#141414]',
                        'border border-neutral-800 rounded-[8px]',
                        'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                >
                    <Image
                        src="/images/google.png"
                        height={20}
                        width={20}
                        alt="G"
                        priority
                        unoptimized
                    />
                    <span className="text-[#d4d8de] text-sm tracking-wide">
                        {signingInProvider === 'GOOGLE' ? 'Signing in...' : 'Continue with Google'}
                    </span>
                </Button>

                <Button
                    onClick={() => handleSignIn('GITHUB')}
                    disabled={!turnstileToken || signingInProvider !== null}
                    className={cn(
                        'w-full flex items-center justify-center gap-3',
                        'px-6 py-5 text-sm font-medium',
                        'bg-[#0f0f0f] hover:bg-[#141414]',
                        'border border-neutral-800 rounded-[8px]',
                        'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                >
                    <FaGithub className="text-[#d4d8de] size-5" />
                    <span className="text-[#d4d8de] text-sm tracking-wide">
                        {signingInProvider === 'GITHUB' ? 'Signing in...' : 'Continue with GitHub'}
                    </span>
                </Button>

                <div className="w-full flex justify-center py-2">
                    <Turnstile
                        className="bg-darkest border-0 rounded-full"
                        sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                        onVerify={(token) => setTurnstileToken(token)}
                        onError={() => setTurnstileToken(null)}
                        onExpire={() => setTurnstileToken(null)}
                        theme="dark"
                    />
                </div>

                <div>
                    <span className="text-xs text-neutral-300 tracking-wider">
                        By signing in, you agree to our <br />
                        <span className="text-[#9e83ff] hover:underline cursor-pointer">
                            Terms & Service
                        </span>{' '}
                        and
                        <span className="text-[#9e83ff] hover:underline cursor-pointer">
                            {' '}
                            Privacy Policy
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function LoginModal({ opensignInModal, setOpenSignInModal }: LoginModalProps) {
    if (!opensignInModal) return null;

    return (
        <OpacityBackground
            className="bg-darkest/70"
            onBackgroundClick={() => setOpenSignInModal(false)}
        >
            <div
                className={cn(
                    'max-w-[800px] w-full h-[500px]',
                    'bg-linear-to-b from-[#0a0a0a] via-darkest to-[#0d0d0d]',
                    'rounded-[8px] grid grid-cols-2',
                    'overflow-hidden shadow-2xl',
                )}
            >
                <LoginLeftPanel />
                <div className="col-span-1">
                    <LoginModalRight
                        opensignInModal={opensignInModal}
                        setOpenSignInModal={setOpenSignInModal}
                    />
                </div>
            </div>
        </OpacityBackground>
    );
}
