'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import ArchitectureTitleComponent from "../base/ArchitectureTitleComponent";

// Types
type User = {
    id: string;
    name: string;
    image: string;
    role: string;
}

type Review = {
    id: string;
    userId: string;
    rating: number;
    title: string | null;
    content: string | null;
    visible: boolean;
    createdAt: string;
    user: User;
}

// Mock data
const reviewsData: Review[] = [
    {
        id: '1',
        userId: 'u1',
        rating: 5,
        title: 'Fantastic AI Tool',
        content: 'What a fantastic AI Proactiv AI is, I just love it. It has completely transformed the way I approach problems and develop solutions.',
        visible: true,
        createdAt: '2024-11-15T10:30:00Z',
        user: {
            id: 'u1',
            name: 'Manu Arora',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
            role: 'Tech Innovator & Entrepreneur'
        }
    },
    {
        id: '2',
        userId: 'u2',
        rating: 5,
        title: 'Game-changer',
        content: 'Absolutely revolutionary, a game-changer for our industry.',
        visible: true,
        createdAt: '2024-11-16T14:20:00Z',
        user: {
            id: 'u2',
            name: 'Bob Smith',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
            role: 'Industry Analyst'
        }
    },
    {
        id: '3',
        userId: 'u3',
        rating: 5,
        title: 'So Easy to Use',
        content: 'I made a soap with the help of AI, it was so easy to use.',
        visible: true,
        createdAt: '2024-11-17T09:15:00Z',
        user: {
            id: 'u3',
            name: 'Tyler Durden',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
            role: 'Creative Director & Business Owner'
        }
    },
    {
        id: '4',
        userId: 'u4',
        rating: 5,
        title: 'Unmatched Efficiency',
        content: "The efficiency it brings is unmatched. It's a vital tool that has helped us cut costs and improve our end product significantly.",
        visible: true,
        createdAt: '2024-11-18T11:45:00Z',
        user: {
            id: 'u4',
            name: 'Eva Green',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
            role: 'Operations Director'
        }
    },
    {
        id: '5',
        userId: 'u5',
        rating: 5,
        title: "Can't Imagine Going Back",
        content: "I can't imagine going back to how things were before this AI.",
        visible: true,
        createdAt: '2024-11-19T16:30:00Z',
        user: {
            id: 'u5',
            name: 'Cathy Lee',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
            role: 'Product Manager'
        }
    },
    {
        id: '6',
        userId: 'u6',
        rating: 5,
        title: 'Saved Countless Hours',
        content: 'It has saved us countless hours. Highly recommended for anyone looking to enhance their efficiency and productivity.',
        visible: true,
        createdAt: '2024-11-20T13:00:00Z',
        user: {
            id: 'u6',
            name: 'Henry Ford',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
            role: 'Operations Analyst'
        }
    },
    {
        id: '7',
        userId: 'u7',
        rating: 5,
        title: 'Like a Superpower',
        content: "It's like having a superpower! This AI tool has given us the ability to do things we never thought were possible in our workflow.",
        visible: true,
        createdAt: '2024-11-21T10:10:00Z',
        user: {
            id: 'u7',
            name: 'Sarah Johnson',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
            role: 'Innovation Lead'
        }
    },
    {
        id: '8',
        userId: 'u8',
        rating: 5,
        title: 'Robust Solution',
        content: "A robust solution that fits perfectly into our workflow. It has enhanced our team's capabilities and allowed us to tackle more complex projects.",
        visible: true,
        createdAt: '2024-11-22T15:25:00Z',
        user: {
            id: 'u8',
            name: 'Frank Moore',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
            role: 'Project Manager'
        }
    },
    {
        id: '9',
        userId: 'u9',
        rating: 5,
        title: 'Must-Have Tool',
        content: "A must-have tool for any professional. It's revolutionized the way we approach problem-solving and decision-making.",
        visible: true,
        createdAt: '2024-11-23T12:40:00Z',
        user: {
            id: 'u9',
            name: 'Ivy Wilson',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
            role: 'Business Consultant'
        }
    },
    {
        id: '10',
        userId: 'u10',
        rating: 5,
        title: 'Transformed Our Work',
        content: "This AI has transformed our work! It's like having an extra team member who never sleeps and always delivers quality results.",
        visible: true,
        createdAt: '2024-11-24T08:55:00Z',
        user: {
            id: 'u10',
            name: 'Michael Chen',
            image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop',
            role: 'Engineering Manager'
        }
    }
];

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-zinc-800/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-primary/10"
        >
            <Quote className="w-8 h-8 text-primary/40 mb-4" />
            <p className="text-gray-200 text-base leading-relaxed mb-6">
                {review.content}
            </p>
            <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <Image
                        src={review.user.image}
                        alt={review.user.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                    />
                </div>
                <div>
                    <p className="text-white font-semibold">{review.user.name}</p>
                    <p className="text-zinc-400 text-sm">{review.user.role}</p>
                </div>
            </div>
        </motion.div>
    );
}

// Review Column Component
function ReviewColumn({ reviews, duration }: { reviews: Review[]; duration: number }) {
    return (
        <div className="relative h-full overflow-hidden mask-gradient">
            <motion.div
                animate={{
                    y: [0, '-50%']
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="flex flex-col"
            >
                {[...reviews, ...reviews].map((review, index) => (
                    <ReviewCard key={`${review.id}-${index}`} review={review} />
                ))}
            </motion.div>
        </div>
    );
}

// Main Component
export default function ReviewsSection() {
    const { session } = useUserSessionStore();
    const publicReviews = reviewsData.filter((review) => review.visible);

    const column1 = publicReviews.slice(0, 3);
    const column2 = publicReviews.slice(3, 6);
    const column3 = publicReviews.slice(6, 10);

    return (
        <section className="relative min-h-screen max-h-screen flex flex-col items-center overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black pb-20 px-4">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />

            <div className="relative z-10 w-full">
                <ArchitectureTitleComponent
                    firstText="Winter tales"
                    secondText="from the Wall"
                    bgcolor="bg-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] relative max-w-7xl mx-auto text-left">

                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

                    <ReviewColumn reviews={column1} duration={30} />
                    <ReviewColumn reviews={column2} duration={35} />
                    <ReviewColumn reviews={column3} duration={32} />
                </div>

                {session && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 text-center"
                    >
                        <button className="px-8 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-primary font-semibold transition-all duration-300 hover:scale-105">
                            Share Your Story
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}