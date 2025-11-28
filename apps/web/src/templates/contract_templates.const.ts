export const anchorContractTemplates = [
    {
        id: 'ckv9q1g0x0004ab12cdef3456',
        title: 'Staking Rewards Contract',
        image: '/templates/contract-1.jpg',
        description:
            'A contract that allows users to stake their tokens and earn periodic rewards based on APY.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['stake', 'unstake', 'claimRewards', 'getUserInfo'] },
    },
    {
        id: 'ckv9q1g0x0005ab12cdef3456',
        title: 'Liquidity Pool',
        image: '/templates/contract-2.jpg',
        description:
            'An AMM-style contract that enables token swaps and provides liquidity incentives for users.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['addLiquidity', 'removeLiquidity', 'swapTokens', 'getPoolInfo'] },
    },
    {
        id: 'ckv9q1g0x0006ab12cdef3456',
        title: 'Token Airdrop Distributor',
        image: '/templates/contract-3.jpg',
        description:
            'A utility contract for distributing tokens to multiple users efficiently and securely.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['createAirdrop', 'claimTokens', 'checkEligibility'] },
    },
    {
        id: 'ckv9q1g0x0007ab12cdef3456',
        title: 'Escrow Payment Contract',
        image: '/templates/contract-4.jpg',
        description:
            'A decentralized escrow contract that holds funds until conditions are met between buyer and seller.',
        contractType: 'PROGRAM',
        clientSdk: {
            functions: ['createEscrow', 'releasePayment', 'cancelEscrow', 'getEscrowStatus'],
        },
    },
    {
        id: 'ckv9q1g0x0008ab12cdef3456',
        title: 'Oracle Price Feed',
        image: '/templates/contract-5.jpg',
        description:
            'A contract that fetches and stores off-chain price data from trusted oracle networks.',
        contractType: 'PROGRAM',
        clientSdk: { functions: ['updatePrice', 'getLatestPrice', 'setOracleAuthority'] },
    },
    {
        id: 'ckv9q1g0x0009ab12cdef3456',
        title: 'Crowdfunding Contract',
        image: '/templates/contract-6.jpg',
        description:
            'A decentralized fundraising contract where users can create campaigns and receive contributions.',
        contractType: 'PROGRAM',
        clientSdk: {
            functions: ['createCampaign', 'contribute', 'withdrawFunds', 'getCampaignInfo'],
        },
    },
];
