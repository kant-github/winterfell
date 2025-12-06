'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { PiStarFill } from "react-icons/pi";
import { RiCalendarTodoFill } from "react-icons/ri";
import Card from "../ui/Card";
import ArchitectureTitleComponent from "../base/ArchitectureTitleComponent";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";

const publicReviews = [
    {
        id: '1',
        username: 'Ser Brienne of Tarth',
        userimage: '/images/google.png',
        rating: 5,
        content:
            "Finally, a platform that doesn't make me want to throw my laptop out the window.",
        createdAt: new Date('2025-01-10T10:00:00Z'),
    },
    {
        id: '2',
        username: 'Tyrion Lannister',
        userimage: '/images/google.png',
        rating: 5,
        content: "I drink and I know things. Mostly about Rust now.",
        createdAt: new Date('2025-01-11T16:30:00Z'),
    },
    {
        id: '3',
        username: 'Arya Stark',
        userimage: '/images/google.png',
        rating: 5,
        content: 'A girl has no name, but her smart contracts have perfect IDLs.',
        createdAt: new Date('2025-01-12T09:12:00Z'),
    },
    {
        id: '4',
        username: 'Jon Snow',
        userimage: '/images/google.png',
        rating: 5,
        content: 'I knew nothing about Anchor. Now I know something.',
        createdAt: new Date('2025-01-13T13:55:00Z'),
    },
];

export default function ReviewsSection() {
    const duplicated = [...publicReviews, ...publicReviews];
    const { session } = useUserSessionStore();

    return (
        <section className="relative h-screen bg-primary flex flex-col items-center overflow-hidden">
            <ArchitectureTitleComponent
                firstText="Winter tales"
                secondText="from the Wall"
                bordercolor="primary"
                bgcolor=""
            />

            <div className="w-full flex mx-20 justify-around overflow-hidden h-full">
                <motion.div
                    className="flex flex-col gap-8"
                    animate={{
                        y: ["0%", "-50%"],
                    }}
                    transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {duplicated.map((item, index) => (
                        <Card
                            key={index}
                            className="bg-[#FCF9F5] p-3 rounded-[8px] shadow-xl w-[330px] mx-auto"
                        >


                            <div className="flex flex-col max-w-[300px] gap-y-2 mt-3 mx-auto">
                                <div className="flex text-yellow-500 gap-1">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <PiStarFill key={i} className="w-4 h-4" />
                                    ))}
                                </div>
                                <div className="text-dark-base text-left">
                                    {item.content}
                                </div>

                                <div className="flex justify-between text-dark-base">
                                    <div className="flex items-center gap-x-1.5">
                                        <div className="relative h-7 w-7 overflow-hidden rounded-full">
                                            <Image
                                                src={session?.user?.image!}
                                                alt={item.username}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-base pt-px">{item.username}</span>
                                    </div>

                                    <div className="text-xs flex items-center gap-x-1">
                                        <RiCalendarTodoFill className="size-4" />
                                        3 days ago
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>
                <motion.div
                    className="flex flex-col gap-8"
                    animate={{
                        y: ["-50%", "0%"],
                    }}
                    transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {duplicated.map((item, index) => (
                        <Card
                            key={index}
                            className="bg-[#FCF9F5] p-3 rounded-[8px] shadow-xl w-[330px] mx-auto"
                        >


                            <div className="flex flex-col max-w-[300px] gap-y-2 mt-3 mx-auto">
                                <div className="flex text-yellow-500 gap-1">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <PiStarFill key={i} className="w-4 h-4" />
                                    ))}
                                </div>
                                <div className="text-dark-base text-left">
                                    {item.content}
                                </div>

                                <div className="flex justify-between text-dark-base">
                                    <div className="flex items-center gap-x-1.5">
                                        <div className="relative h-7 w-7 overflow-hidden rounded-full">
                                            <Image
                                                src={session?.user?.image!}
                                                alt={item.username}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-base pt-px">{item.username}</span>
                                    </div>

                                    <div className="text-xs flex items-center gap-x-1">
                                        <RiCalendarTodoFill className="size-4" />
                                        3 days ago
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>
                <motion.div
                    className="flex flex-col gap-8"
                    animate={{
                        y: ["0%", "-50%"],
                    }}
                    transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {duplicated.map((item, index) => (
                        <Card
                            key={index}
                            className="bg-[#FCF9F5] p-3 rounded-[8px] shadow-xl w-[330px] mx-auto"
                        >


                            <div className="flex flex-col max-w-[300px] gap-y-2 mt-3 mx-auto">
                                <div className="flex text-yellow-500 gap-1">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <PiStarFill key={i} className="w-4 h-4" />
                                    ))}
                                </div>
                                <div className="text-dark-base text-left">
                                    {item.content}
                                </div>

                                <div className="flex justify-between text-dark-base">
                                    <div className="flex items-center gap-x-1.5">
                                        <div className="relative h-7 w-7 overflow-hidden rounded-full">
                                            <Image
                                                src={session?.user?.image!}
                                                alt={item.username}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-base pt-px">{item.username}</span>
                                    </div>

                                    <div className="text-xs flex items-center gap-x-1">
                                        <RiCalendarTodoFill className="size-4" />
                                        3 days ago
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
