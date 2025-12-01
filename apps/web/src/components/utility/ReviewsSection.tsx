'use client';
import ArchitectureTitleComponent from '../base/ArchitectureTitleComponent';
import { InfiniteMovingCards } from '../ui/infinite-moving-cards';

interface Review {
    name: string;
    role: string;
    review: string;
    rating: number;
}

const reviews: Review[] = [
    {
        name: 'Ser Brienne of Tarth',
        role: 'Smart Contract Knight',
        review: "Finally, a platform that doesn't make me want to throw my laptop out the window. Deployed my first Solana program without sacrificing a goat.",
        rating: 5,
    },
    {
        name: 'Tyrion Lannister',
        role: 'DeFi Architect',
        review: "I drink and I know things. Mostly about Rust now, thanks to Winterfell's AI. 10/10 would recommend while drunk.",
        rating: 5,
    },
    {
        name: 'Arya Stark',
        role: 'No-Code Assassin',
        review: 'A girl has no name, but her smart contracts have perfect IDLs. Valar Morghulis to manual coding.',
        rating: 5,
    },
    {
        name: 'Jon Snow',
        role: 'Blockchain Bastard',
        review: 'I knew nothing about Anchor. Now I know something. Character development arc complete.',
        rating: 5,
    },
    {
        name: 'Daenerys Targaryen',
        role: 'Mother of Contracts',
        review: "I will take what is mine with fire and blood... or just use Winterfell's one-click deploy. Way easier.",
        rating: 5,
    },
    {
        name: 'Hodor',
        role: 'Backend Developer',
        review: 'Hodor hodor hodor hodor. Hodor hodor hodor! (Translation: Best dev tool ever. Seriously.)',
        rating: 5,
    },
    {
        name: 'Cersei Lannister',
        role: 'Frontend Queen',
        review: 'When you play the game of smart contracts, you win or you debug. With Winterfell, you win. Every. Single. Time.',
        rating: 5,
    },
    {
        name: 'The Night King',
        role: 'Security Auditor',
        review: 'Been dead for centuries, came back just to use this. AI caught vulnerabilities even I missed. Spooky good.',
        rating: 5,
    },
    {
        name: 'Samwell Tarly',
        role: 'Documentation Writer',
        review: 'Auto-generated docs better than what I could write in the Citadel library. My maester chain feels inadequate now.',
        rating: 5,
    },
    {
        name: 'Sansa Stark',
        role: 'Product Manager',
        review: 'Survived Ramsay Bolton and managed enterprise deployments. Winterfell is easier than both.',
        rating: 5,
    },
    {
        name: 'Jaime Lannister',
        role: 'Full-Stack Swordsman',
        review: 'Lost my right hand, gained AI-powered contract generation. Fair trade tbh.',
        rating: 5,
    },
    {
        name: 'Bran Stark',
        role: 'Three-Eyed Developer',
        review: 'I can see the past, present, and future. In all timelines, Winterfell is the best platform.',
        rating: 5,
    },
    {
        name: 'Melisandre',
        role: 'Token Priestess',
        review: 'The night is dark and full of bugs. Winterfell is the light that brings the dawn. For the watch!',
        rating: 5,
    },
    {
        name: 'Tormund Giantsbane',
        role: 'Wildling Engineer',
        review: "I've wrestled bears and giants. Deploying smart contracts was harder. Was. Past tense.",
        rating: 5,
    },
    {
        name: 'Varys',
        role: 'Network Spy',
        review: 'I have little birds everywhere. They all whisper the same thing: Winterfell slaps harder than Joffrey.',
        rating: 5,
    },
    {
        name: 'Theon Greyjoy',
        role: 'Redemption Arc Dev',
        review: 'What is dead may never die. What is deployed on Winterfell never breaks. Probably.',
        rating: 5,
    },
];

export default function ReviewsSection() {
    const firstRow = reviews.slice(0, 8).map((r) => ({
        quote: r.review,
        name: r.name,
        title: r.role,
    }));

    const secondRow = reviews.slice(8, 16).map((r) => ({
        quote: r.review,
        name: r.name,
        title: r.role,
    }));

    return (
        <div className="min-h-screen bg-primary z-90">
            <ArchitectureTitleComponent
                firstText="Winter tales"
                secondText="from the Wall"
                bordercolor="border-[#141517]"
                bgcolor="bg-[#6c44fc]"
            />

            <div className="mt-16 space-y-8">
                <InfiniteMovingCards
                    items={firstRow}
                    direction="left"
                    speed="slow"
                    pauseOnHover={false}
                />

                <InfiniteMovingCards
                    items={secondRow}
                    direction="right"
                    speed="slow"
                    pauseOnHover={false}
                />
            </div>
        </div>
    );
}
