'use client';

import Image from 'next/image';
import { PiStarFill } from 'react-icons/pi';
import ArchitectureTitleComponent from '../base/ArchitectureTitleComponent';
import Card from '../ui/Card';

const publicReviews = [
    {
        id: 'clu1a01aa0001xyz123',
        username: 'Ser Brienne of Tarth',
        userimage: '/images/google.png',
        rating: 5,
        content:
            "Finally, a platform that doesn't make me want to throw my laptop out the window. Deployed my first Solana program without sacrificing a goat.",
        createdAt: new Date('2025-01-10T10:00:00Z'),
    },
    {
        id: 'clu1a01aa0002xyz123',
        username: 'Tyrion Lannister',
        userimage: '/avatars/tyrion.jpg',
        rating: 5,
        content:
            "I drink and I know things. Mostly about Rust now, thanks to Winterfell's AI. 10/10 would recommend while drunk.",
        createdAt: new Date('2025-01-11T16:30:00Z'),
    },
    {
        id: 'clu1a01aa0003xyz123',
        username: 'Arya Stark',
        userimage: '/avatars/arya.jpg',
        rating: 5,
        content:
            'A girl has no name, but her smart contracts have perfect IDLs. Valar Morghulis to manual coding.',
        createdAt: new Date('2025-01-12T09:12:00Z'),
    },
    {
        id: 'clu1a01aa0004xyz123',
        username: 'Jon Snow',
        userimage: '/avatars/jon.jpg',
        rating: 5,
        content:
            'I knew nothing about Anchor. Now I know something. Character development arc complete.',
        createdAt: new Date('2025-01-13T13:55:00Z'),
    },
    {
        id: 'clu1a01aa0004xyz123',
        username: 'Jon Snow',
        userimage: '/avatars/jon.jpg',
        rating: 5,
        content:
            'I knew nothing about Anchor. Now I know something. Character development arc complete.',
        createdAt: new Date('2025-01-13T13:55:00Z'),
    },
];

function timeAgo(date: Date) {
    const diff = (Date.now() - date.getTime()) / 1000;
    const days = Math.floor(diff / 86400);
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
}

export default function ReviewsSection() {
    return (
        <div className="min-h-screen z-90 relative">
            <ArchitectureTitleComponent
                firstText="Winter tales"
                secondText="from the Wall"
                bordercolor="primary"
                bgcolor=""
            />

            <div className="mt-16 flex space-y-8 w-full">
                {publicReviews.map((review) => (
                    <Card
                        key={review.id}
                        className="h-40 w-full max-w-70 ml-10 flex flex-col items-start tracking-wider bg-[#11111190] relative px-3.5"
                    >
                        <div className="flex flex-col justify-evenly h-full w-full">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex text-yellow-400 gap-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <PiStarFill key={i} className="w-4 h-4" />
                                    ))}
                                </div>

                                <div className="flex gap-x-1.5">
                                    <div className="h-2 w-2 bg-[#e9524aa8] rounded-full" />
                                    <div className="h-2 w-2 bg-[#f1ad1bc5] rounded-full" />
                                    <div className="h-2 w-2 bg-[#59c837a9] rounded-full" />
                                </div>
                            </div>

                            <div className="max-w-40 text-left leading-snug text-xs text-light/60 line-clamp-3 mb-3">
                                {review.content}
                            </div>

                            <div className="flex justify-between items-end w-full">
                                <div className="flex gap-x-2 items-center">
                                    <div className="relative h-5 w-5 overflow-hidden rounded-full">
                                        <Image
                                            src={review.userimage}
                                            alt={review.username}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="text-sm leading-0 tracking-wider text-light/80 uppercase pt-1">
                                        {review.username.split(' ')[0]}
                                    </div>
                                </div>

                                <div className="text-xs text-light/60">
                                    {timeAgo(review.createdAt)}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
