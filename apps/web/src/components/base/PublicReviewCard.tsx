'use client';
import { cn } from '@/src/lib/utils';
import Card from '../ui/Card';
import {
    PiSmileyAngryThin,
    PiSmileySadThin,
    PiSmileyMehThin,
    PiSmileyThin,
    PiSmileyWinkThin,
} from 'react-icons/pi';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { SiMinutemailer } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { public_review_schema } from '@winterfell/types';
import axios from 'axios';
import { PUBLIC_REVIEW_URL } from '@/routes/api_routes';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { toast } from 'sonner';

const emotions = [
    { icon: PiSmileyAngryThin, value: 1 },
    { icon: PiSmileySadThin, value: 2 },
    { icon: PiSmileyMehThin, value: 3 },
    { icon: PiSmileyThin, value: 4 },
    { icon: PiSmileyWinkThin, value: 5 },
];

interface ReviewForm {
    rating: number;
    content: string;
}

export default function PublicReviewCard() {
    const { session } = useUserSessionStore();
    const [form, setForm] = useState<ReviewForm>({
        rating: 0,
        content: '',
    });

    const updateForm = (updates: Partial<ReviewForm>) => {
        setForm((prev) => ({ ...prev, ...updates }));
    };

    async function handleSubmit() {
        if (!session || !session.user || !session.user.token) {
            toast.info('Ghosts cant leave reviews, Log in to continue!');
            return;
        }
        const payload = {
            rating: form.rating,
            content: form.content,
        };
        try {
            const validateData = public_review_schema.safeParse({
                rating: payload.rating,
                content: payload.content,
            });
            if (!validateData.success) return;

            const response = await axios.post(PUBLIC_REVIEW_URL, payload, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                },
            });

            if (response.data.success) {
                toast.success('Thanks for the feedback. We promise to read it... probably');
                form.rating = 0;
                form.content = '';
            }
        } catch {
            toast.error('Failed to submit the review');
        }
    }

    return (
        <Card className="max-w-md flex flex-col gap-y-3 mt-5 items-center px-3 py-4 rounded-[4px] shadow-xl">
            <div className="flex justify-between w-full">
                <div className="text-light/60 tracking-wider">leave your feedback here...</div>

                <div className="flex gap-x-4 justify-center">
                    {emotions.map((emotion) => {
                        const Icon = emotion.icon;
                        const isSelected = form.rating === emotion.value;
                        return (
                            <button
                                aria-label="smiley"
                                type="button"
                                key={emotion.value}
                                onClick={() => updateForm({ rating: emotion.value })}
                                className={cn(
                                    'transition-colors border-none',
                                    'border hover:text-primary-light cursor-pointer',
                                    isSelected
                                        ? 'text-primary hover:text-primary'
                                        : 'text-light/40 hover:border-primary/40',
                                )}
                            >
                                <Icon size={27} />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="w-full relative">
                <Textarea
                    value={form.content}
                    onChange={(e) => updateForm({ content: e.target.value })}
                    placeholder="What did you like?"
                    className="w-full border border-neutral-800 rounded-[4px]"
                />

                <AnimatePresence>
                    {form.content.trim().length > 0 && (
                        <motion.div
                            key="send-btn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-[14px] right-3"
                        >
                            <Button size="sm" onClick={handleSubmit} className="exec-button-dark">
                                <SiMinutemailer className="size-4" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    );
}
