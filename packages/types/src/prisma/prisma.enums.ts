
export enum BuildStatus {
    NEVER_BUILT = 'NEVER_BUILT',
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    QUEUED = 'QUEUED',
}

export enum Command {
    WINTERFELL_BUILD = 'WINTERFELL_BUILD',
    WINTERFELL_TEST = 'WINTERFELL_TEST',
    WINTERFELL_DEPLOY_DEVNET = 'WINTERFELL_DEPLOY_DEVNET',
    WINTERFELL_DEPLOY_MAINNET = 'WINTERFELL_DEPLOY_MAINNET',
    WINTERFELL_VERIFY = 'WINTERFELL_VERIFY',
}

export enum ContractGenerationStage {
    PLANNING = 'PLANNING',
    GENERATING_CODE = 'GENERATING_CODE',
    BUILDING = 'BUILDING',
    CREATING_FILES = 'CREATING_FILES',
    FINALIZING = 'FINALIZING',
    END = 'END',
    ERROR = 'ERROR',
}

export enum GenerationStatus {
    IDLE = 'IDLE',
    GENERATING = 'GENERATING',
}

export enum ContractType {
    TOKEN = 'TOKEN',
    NFT = 'NFT',
    STAKING = 'STAKING',
    DAO = 'DAO',
    DEFI = 'DEFI',
    MARKETPLACE = 'MARKETPLACE',
    CUSTOM = 'CUSTOM',
}

export enum Network {
    DEVNET = 'DEVNET',
    TESTNET = 'TESTNET',
    MAINNET_BETA = 'MAINNET_BETA',
}

export enum DeploymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum ChatRole {
    PLAN = 'PLAN',
    USER = 'USER',
    AI = 'AI',
    SYSTEM = 'SYSTEM',
    TEMPLATE = 'TEMPLATE',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
}

export enum SystemMessageType {
    BUILD_START = 'BUILD_START',
    BUILD_PROGRESS = 'BUILD_PROGRESS',
    BUILD_COMPLETE = 'BUILD_COMPLETE',
    BUILD_ERROR = 'BUILD_ERROR',
}

export enum PlanType {
    FREE = 'FREE',
    PREMIUM = 'PREMIUM',
    PREMIUM_PLUS = 'PREMIUM_PLUS',
}