import { Prisma, prisma } from '@winterfell/database';

export async function seedTemplates() {
    const templates: Prisma.TemplateCreateInput[] = [
        // template 1: counter contract
        {
            id: '456fbc47-4f46-487a-9d7d-01fb16a7396e',
            title: 'Counter Contract',
            description:
                'Simple Anchor program demonstrating increment, decrement and initialize instructions.',
            category: 'utility',
            tags: ['counter', 'example', 'anchor', 'solana'],
            anchorVersion: '0.32.1',
            solanaVersion: '1.18.4',
            imageUrl: 'https://d3k5vke5jsl4rb.cloudfront.net/images/contract-1.jpg',
            summarisedObject: JSON.stringify([
                {
                    id: 'Cargo.toml',
                    path: 'Cargo.toml',
                    type: 'project_config',
                    content: {
                        name: 'workspace',
                        description:
                            'Root Cargo.toml for the Solana workspace, defining members and release profiles.',
                    },
                },
                {
                    id: 'package.json',
                    path: 'package.json',
                    type: 'package_config',
                    content: {
                        description:
                            'Node.js package configuration with scripts, dependencies, and devDependencies for the project.',
                    },
                },
                {
                    id: 'tsconfig.json',
                    path: 'tsconfig.json',
                    type: 'typescript_config',
                    content: {
                        description:
                            'TypeScript configuration for the project, specifying compiler options and type roots.',
                    },
                },
                {
                    id: 'rust-toolchain.toml',
                    path: 'rust-toolchain.toml',
                    type: 'toolchain_config',
                    content: {
                        description:
                            'Rust toolchain configuration, specifying channel, components, and profile.',
                    },
                },
                {
                    id: '.gitignore',
                    path: '.gitignore',
                    type: 'ignore_config',
                    content: {
                        description:
                            'Git ignore file, specifying files and directories to be excluded from version control.',
                    },
                },
                {
                    id: '.prettierignore',
                    path: '.prettierignore',
                    type: 'ignore_config',
                    content: {
                        description:
                            'Prettier ignore file, specifying files and directories to be excluded from formatting.',
                    },
                },
                {
                    id: 'programs/counter/src/instructions/mod.rs',
                    path: 'programs/counter/src/instructions/mod.rs',
                    type: 'module_declaration',
                    content: {
                        mods: [
                            { name: 'initialize' },
                            { name: 'increment' },
                            { name: 'decrement' },
                        ],
                    },
                },
                {
                    id: 'programs/counter/src/instructions/initialize.rs',
                    path: 'programs/counter/src/instructions/initialize.rs',
                    type: 'instruction_and_struct',
                    content: {
                        instructions: [
                            {
                                name: 'initialize_handler',
                                params: [],
                                returns: [{ type: 'Result<()>' }],
                            },
                        ],
                        structs: [
                            {
                                name: 'Initialize',
                                type: 'Accounts',
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: 'counter',
                                        type: "Account<'info, Counter>",
                                        macro: 'account',
                                    },
                                    {
                                        name: 'signer',
                                        type: "Signer<'info>",
                                        macro: 'account(mut)',
                                    },
                                    {
                                        name: 'system_program',
                                        type: "Program<'info, System>",
                                        macro: 'none',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/counter/src/instructions/increment.rs',
                    path: 'programs/counter/src/instructions/increment.rs',
                    type: 'instruction_and_struct',
                    content: {
                        instructions: [
                            {
                                name: 'increment_handler',
                                params: [],
                                returns: [{ type: 'Result<()>' }],
                            },
                        ],
                        structs: [
                            {
                                name: 'Increment',
                                type: 'Accounts',
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: 'counter',
                                        type: "Account<'info, Counter>",
                                        macro: 'account(mut)',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/counter/src/instructions/decrement.rs',
                    path: 'programs/counter/src/instructions/decrement.rs',
                    type: 'instruction_and_struct',
                    content: {
                        instructions: [
                            {
                                name: 'decrement_handler',
                                params: [],
                                returns: [{ type: 'Result<()>' }],
                            },
                        ],
                        structs: [
                            {
                                name: 'Decrement',
                                type: 'Accounts',
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: 'counter',
                                        type: "Account<'info, Counter>",
                                        macro: 'account(mut)',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/counter/src/errors/mod.rs',
                    path: 'programs/counter/src/errors/mod.rs',
                    type: 'module_declaration',
                    content: {
                        mods: [{ name: 'error_codes' }],
                    },
                },
                {
                    id: 'programs/counter/src/errors/error_codes.rs',
                    path: 'programs/counter/src/errors/error_codes.rs',
                    type: 'error_definition',
                    content: {
                        description:
                            'Defines custom error codes for the Counter program, including Overflow and Underflow.',
                    },
                },
                {
                    id: 'programs/counter/src/lib.rs',
                    path: 'programs/counter/src/lib.rs',
                    type: 'program_main',
                    content: {
                        mod_name: 'counter',
                        public_key: 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS',
                        instructions: [
                            { name: 'initialize' },
                            { name: 'increment' },
                            { name: 'decrement' },
                        ],
                    },
                },
                {
                    id: 'programs/counter/src/state/mod.rs',
                    path: 'programs/counter/src/state/mod.rs',
                    type: 'struct_definition',
                    content: {
                        structs: [
                            {
                                name: 'Counter',
                                type: 'struct',
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: 'count',
                                        type: 'u64',
                                        macro: 'none',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    id: 'tests/counter.ts',
                    path: 'tests/counter.ts',
                    type: 'test_file',
                    content: {
                        description:
                            'TypeScript tests for the Counter program, covering initialization, increment, decrement, and error handling.',
                    },
                },
                {
                    id: 'migrations/deploy.ts',
                    path: 'migrations/deploy.ts',
                    type: 'migration_script',
                    content: {
                        description:
                            'Deployment script for the Counter program, setting up the Anchor provider.',
                    },
                },
                {
                    id: 'Anchor.toml',
                    path: 'Anchor.toml',
                    type: 'anchor_config',
                    content: {
                        name: 'counter',
                        description:
                            'Anchor project configuration for the Counter program, including toolchain, features, and provider settings.',
                    },
                },
                {
                    id: 'programs/counter/Cargo.toml',
                    path: 'programs/counter/Cargo.toml',
                    type: 'program_cargo_config',
                    content: {
                        name: 'counter',
                        description:
                            'Cargo.toml for the Counter program, defining package metadata and dependencies.',
                    },
                },
            ]),
        },
        // template 2: vault contract
        {
            id: 'a2aba581-9376-4a7e-b872-635508e8a14f',
            title: 'Vault Contract',
            description:
                'Vault program supporting initialization, deposits, and withdrawals using PDA-managed accounts.',
            category: 'defi',
            tags: ['vault', 'anchor', 'solana', 'pda', 'defi'],
            anchorVersion: '0.32.1',
            solanaVersion: '1.18.4',
            imageUrl: 'https://d3k5vke5jsl4rb.cloudfront.net/images/contract-2.jpg',
            summarisedObject: JSON.stringify([
                {
                    id: 'Cargo.toml',
                    path: 'Cargo.toml',
                    type: 'config_file',
                    content: {
                        name: 'Cargo.toml',
                        description: 'Workspace and build configuration for Rust projects.',
                    },
                },
                {
                    id: 'rust-toolchain.toml',
                    path: 'rust-toolchain.toml',
                    type: 'config_file',
                    content: {
                        name: 'rust-toolchain.toml',
                        description: 'Defines the Rust toolchain version and components.',
                    },
                },
                {
                    id: '.gitignore',
                    path: '.gitignore',
                    type: 'config_file',
                    content: {
                        name: '.gitignore',
                        description: 'Specifies intentionally untracked files to ignore.',
                    },
                },
                {
                    id: '.prettierignore',
                    path: '.prettierignore',
                    type: 'config_file',
                    content: {
                        name: '.prettierignore',
                        description:
                            'Specifies files and folders to ignore for Prettier formatting.',
                    },
                },
                {
                    id: 'migrations/deploy.ts',
                    path: 'migrations/deploy.ts',
                    type: 'config_file',
                    content: {
                        name: 'deploy.ts',
                        description: 'Anchor migration script for deploying the program.',
                    },
                },
                {
                    id: 'Anchor.toml',
                    path: 'Anchor.toml',
                    type: 'config_file',
                    content: {
                        name: 'Anchor.toml',
                        description:
                            'Anchor workspace configuration, including program ID and provider settings.',
                    },
                },
                {
                    id: 'package.json',
                    path: 'package.json',
                    type: 'config_file',
                    content: {
                        name: 'package.json',
                        description: 'Node.js package manifest with dependencies and scripts.',
                    },
                },
                {
                    id: 'tsconfig.json',
                    path: 'tsconfig.json',
                    type: 'config_file',
                    content: {
                        name: 'tsconfig.json',
                        description: 'TypeScript compiler configuration for the project.',
                    },
                },
                {
                    id: 'programs/vault/Cargo.toml',
                    path: 'programs/vault/Cargo.toml',
                    type: 'config_file',
                    content: {
                        name: 'Cargo.toml',
                        description: "Package configuration for the 'vault' Solana program.",
                    },
                },
                {
                    id: 'programs/vault/src/lib.rs',
                    path: 'programs/vault/src/lib.rs',
                    type: 'program_entry',
                    content: {
                        mod_name: 'vault',
                        public_key: 'Fg6PaFprADpQdcMDGM9sWb2y582V232N82222222222',
                        instructions: [
                            {
                                name: 'initialize_vault',
                            },
                            {
                                name: 'deposit',
                            },
                            {
                                name: 'withdraw',
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/state/mod.rs',
                    path: 'programs/vault/src/state/mod.rs',
                    type: 'module_file',
                    content: {
                        mods: [
                            {
                                name: 'vault',
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/state/vault.rs',
                    path: 'programs/vault/src/state/vault.rs',
                    type: 'account_struct',
                    content: {
                        structs: [
                            {
                                name: 'Vault',
                                type: 'account',
                                instruction_macro: [
                                    {
                                        name: 'Vault',
                                        type: 'PDA',
                                    },
                                ],
                                struct_vars: [
                                    {
                                        name: 'owner',
                                        type: 'Pubkey',
                                        macro: 'pubkey',
                                    },
                                    {
                                        name: 'total_deposited_amount',
                                        type: 'u64',
                                        macro: 'u64',
                                    },
                                    {
                                        name: 'bump',
                                        type: 'u8',
                                        macro: 'u8',
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/mod.rs',
                    path: 'programs/vault/src/instructions/mod.rs',
                    type: 'module_file',
                    content: {
                        mods: [
                            {
                                name: 'initialize_vault',
                            },
                            {
                                name: 'deposit',
                            },
                            {
                                name: 'withdraw',
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/initialize_vault.rs',
                    path: 'programs/vault/src/instructions/initialize_vault.rs',
                    type: 'instruction_and_accounts',
                    content: {
                        instructions: [
                            {
                                name: 'initialize_vault',
                                params: [],
                                returns: [
                                    {
                                        type: 'Result<()>',
                                    },
                                ],
                            },
                        ],
                        structs: [
                            {
                                name: 'InitializeVault',
                                type: 'Accounts',
                                instruction_macro: [
                                    {
                                        name: 'vault',
                                        type: "Account<'info, Vault>",
                                    },
                                    {
                                        name: 'signer',
                                        type: "Signer<'info>",
                                    },
                                    {
                                        name: 'system_program',
                                        type: "Program<'info, System>",
                                    },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/deposit.rs',
                    path: 'programs/vault/src/instructions/deposit.rs',
                    type: 'instruction_and_accounts',
                    content: {
                        instructions: [
                            {
                                name: 'deposit',
                                params: [
                                    {
                                        name: 'amount',
                                        type: 'u64',
                                    },
                                ],
                                returns: [
                                    {
                                        type: 'Result<()>',
                                    },
                                ],
                            },
                        ],
                        structs: [
                            {
                                name: 'Deposit',
                                type: 'Accounts',
                                instruction_macro: [
                                    {
                                        name: 'vault',
                                        type: "PDA Account<'info, Vault>",
                                    },
                                    {
                                        name: 'depositor',
                                        type: "Signer<'info>",
                                    },
                                    {
                                        name: 'system_program',
                                        type: "Program<'info, System>",
                                    },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/instructions/withdraw.rs',
                    path: 'programs/vault/src/instructions/withdraw.rs',
                    type: 'instruction_and_accounts',
                    content: {
                        instructions: [
                            {
                                name: 'withdraw',
                                params: [
                                    {
                                        name: 'amount',
                                        type: 'u64',
                                    },
                                ],
                                returns: [
                                    {
                                        type: 'Result<()>',
                                    },
                                ],
                            },
                        ],
                        structs: [
                            {
                                name: 'Withdraw',
                                type: 'Accounts',
                                instruction_macro: [
                                    {
                                        name: 'vault',
                                        type: "PDA Account<'info, Vault>",
                                    },
                                    {
                                        name: 'owner',
                                        type: "Signer<'info>",
                                    },
                                    {
                                        name: 'system_program',
                                        type: "Program<'info, System>",
                                    },
                                ],
                                struct_vars: [],
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/errors/mod.rs',
                    path: 'programs/vault/src/errors/mod.rs',
                    type: 'module_file',
                    content: {
                        mods: [
                            {
                                name: 'error_codes',
                            },
                        ],
                    },
                },
                {
                    id: 'programs/vault/src/errors/error_codes.rs',
                    path: 'programs/vault/src/errors/error_codes.rs',
                    type: 'error_definition',
                    content: {
                        description: 'Custom error codes for the Vault program.',
                    },
                },
                {
                    id: 'tests/vault.ts',
                    path: 'tests/vault.ts',
                    type: 'test_file',
                    content: {
                        name: 'vault.ts',
                        description: 'Tests for the Vault program functionality.',
                    },
                },
            ]),
        },
        //
    ];

    for (const template of templates) {
        await prisma.template.upsert({
            where: { id: template.id },
            update: template,
            create: template,
        });
    }

    console.log('templates updated');
}
