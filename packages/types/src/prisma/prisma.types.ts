import { NODE } from "../file_types/file_types";
import {
    BuildStatus,
    ChatRole,
    Command,
    ContractGenerationStage,
    ContractType,
    DeploymentStatus,
    GenerationStatus,
    Network,
    PlanType,
    SubscriptionStatus
} from "./prisma.enums";

export interface FlatFile {
    id: string;
    name: string;
    path: string;
    type: NODE;
}

export interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    password?: string | null;
    provider?: string | null;

    githubId?: string | null;
    githubAccessToken?: string | null;
    githubUsername?: string | null;

    createdAt: Date;
    updatedAt: Date;

    subscription?: Subscription | null;
    contracts?: Contract[];
    uploadedFiles?: FileUpload[];
    contractGenerationReviews?: ContractGenerationReviews[];
    publicReviews?: PublicReview[];
}

export interface Contract {
    id: string;
    title: string;
    description?: string | null;
    contractType: ContractType;

    code?: string | null;
    codeHash?: string | null;
    s3_url?: string | null;

    githubRepoName?: string | null;

    lastBuildStatus?: BuildStatus | null;
    lastBuildId?: string | null;

    idl?: JSON;
    clientSdk?: JSON;

    summarisedObject?: string | null;
    generationStatus: GenerationStatus;

    deployed: boolean;
    programId?: string | null;
    version: number;

    userId: string;
    user?: User;

    createdAt: Date;
    updatedAt: Date;

    deployments?: Deployment[];
    buildJob?: BuildJob[];
    messages?: Message[];
    contractGenerationReviews?: ContractGenerationReviews[];
}

export interface Deployment {
    id: string;
    contractId: string;
    contract?: Contract;

    network: Network;
    deployedAt: Date;
    txSignature?: string | null;
    status: DeploymentStatus;
}

export interface Message {
    id: string;
    contractId: string;
    contract?: Contract;

    role: ChatRole;
    content: string;

    stage?: ContractGenerationStage;
    plannerContext?: string | PlanMessage;
    isPlanExecuted: boolean;

    templateId?: string;
    template?: Template;

    createdAt: Date;
}

export interface BuildJob {
    id: string;
    contractId: string;
    contract?: Contract;

    jobId: string;
    status: BuildStatus;
    podName?: string | null;
    command: Command;

    startedAt?: Date | null;
    completedAt?: Date | null;
    duration?: number | null;
    output?: JSON | null;
    error?: string | null;

    retryCount: number;
    maxRetry: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface FileUpload {
    id: string;
    filename: string;
    size: number;
    s3Url: string;

    userId: string;
    user?: User;

    createdAt: Date;
}

export interface ContractGenerationReviews {
    id: string;

    contractId: string;
    contract?: Contract;

    userId: string;
    user?: User;

    rating: number;
    liked?: string | null;
    disliked?: string | null;

    createdAt: Date;
}

export interface PublicReview {
    id: string;

    userId: string;
    user?: User;

    rating: number;
    title?: string | null;
    content?: string | null;

    visible: boolean;
    createdAt: Date;
}

export interface Subscription {
    id: string;
    userId: string;
    user?: User;

    plan: PlanType;
    status: SubscriptionStatus;

    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    razorpaySignature?: string | null;

    start: Date;
    end?: Date | null;
    autoRenew: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface Template {
    id: string;
    title: string;
    description?: string | null;
    category: string;
    tags: string[];
    s3_prefix?: string | null;
    solanaVersion: string;
    anchorVersion: string;
    summarisedObject: string;
    imageUrl: string;

    messages?: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PlanMessage {
    contract_name: string;
    contract_title: string;
    short_description: string;
    long_description: string;
    contract_instructions: {
        title: string;
        short_description: string;
        long_description: string;
    }[];
}

