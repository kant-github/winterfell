import { prisma } from '@winterfell/database';

export async function seedTemplates() {
    const templates = [
        {
            id: "456fbc47-4f46-487a-9d7d-01fb16a7396e",
            title: "Counter Contract",
            description: "Simple Anchor program demonstrating increment, decrement and initialize instructions.",
            category: "utility",
            tags: [
                "counter",
                "example",
                "anchor",
                "solana"
            ],
            anchorVersion: "0.32.1",
            solanaVersion: "1.18.4",
            summarisedObject: JSON.stringify([
                {
                    id: "Cargo.toml",
                    path: "Cargo.toml",
                    type: "project_config",
                    content: {
                        name: "workspace",
                        description: "Root Cargo.toml for the Solana workspace, defining members and release profiles."
                    }
                },
                {
                    id: "package.json",
                    path: "package.json",
                    type: "package_config",
                    content: {
                        description: "Node.js package configuration with scripts, dependencies, and devDependencies for the project."
                    }
                },
                {
                    id: "tsconfig.json",
                    path: "tsconfig.json",
                    type: "typescript_config",
                    content: {
                        description: "TypeScript configuration for the project, specifying compiler options and type roots."
                    }
                },
                {
                    id: "rust-toolchain.toml",
                    path: "rust-toolchain.toml",
                    type: "toolchain_config",
                    content: {
                        description: "Rust toolchain configuration, specifying channel, components, and profile."
                    }
                },
                {
                    id: ".gitignore",
                    path: ".gitignore",
                    type: "ignore_config",
                    content: {
                        description: "Git ignore file, specifying files and directories to be excluded from version control."
                    }
                },
                {
                    id: ".prettierignore",
                    path: ".prettierignore",
                    type: "ignore_config",
                    content: {
                        description: "Prettier ignore file, specifying files and directories to be excluded from formatting."
                    }
                },
                {
                    id: "programs/counter/src/instructions/mod.rs",
                    path: "programs/counter/src/instructions/mod.rs",
                    type: "module_declaration",
                    content: {
                        mods: [
                            { name: "initialize" },
                            { name: "increment" },
                            { name: "decrement" }
                        ]
                    }
                },
                {
                    id: "programs/counter/src/instructions/initialize.rs",
                    path: "programs/counter/src/instructions/initialize.rs",
                    type: "instruction_and_struct",
                    content: {
                        instructions: [
                            {
                                name: "initialize_handler",
                                params: [],
                                returns: [
                                    { type: "Result<()>" }
                                ]
                            }
                        ],
                        structs: [
                            {
                                name: "Initialize",
                                type: "Accounts",
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: "counter",
                                        type: "Account<'info, Counter>",
                                        macro: "account"
                                    },
                                    {
                                        name: "signer",
                                        type: "Signer<'info>",
                                        macro: "account(mut)"
                                    },
                                    {
                                        name: "system_program",
                                        type: "Program<'info, System>",
                                        macro: "none"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "programs/counter/src/instructions/increment.rs",
                    path: "programs/counter/src/instructions/increment.rs",
                    type: "instruction_and_struct",
                    content: {
                        instructions: [
                            {
                                name: "increment_handler",
                                params: [],
                                returns: [
                                    { type: "Result<()>" }
                                ]
                            }
                        ],
                        structs: [
                            {
                                name: "Increment",
                                type: "Accounts",
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: "counter",
                                        type: "Account<'info, Counter>",
                                        macro: "account(mut)"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "programs/counter/src/instructions/decrement.rs",
                    path: "programs/counter/src/instructions/decrement.rs",
                    type: "instruction_and_struct",
                    content: {
                        instructions: [
                            {
                                name: "decrement_handler",
                                params: [],
                                returns: [
                                    { type: "Result<()>" }
                                ]
                            }
                        ],
                        structs: [
                            {
                                name: "Decrement",
                                type: "Accounts",
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: "counter",
                                        type: "Account<'info, Counter>",
                                        macro: "account(mut)"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "programs/counter/src/errors/mod.rs",
                    path: "programs/counter/src/errors/mod.rs",
                    type: "module_declaration",
                    content: {
                        mods: [
                            { name: "error_codes" }
                        ]
                    }
                },
                {
                    id: "programs/counter/src/errors/error_codes.rs",
                    path: "programs/counter/src/errors/error_codes.rs",
                    type: "error_definition",
                    content: {
                        description: "Defines custom error codes for the Counter program, including Overflow and Underflow."
                    }
                },
                {
                    id: "programs/counter/src/lib.rs",
                    path: "programs/counter/src/lib.rs",
                    type: "program_main",
                    content: {
                        mod_name: "counter",
                        public_key: "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
                        instructions: [
                            { name: "initialize" },
                            { name: "increment" },
                            { name: "decrement" }
                        ]
                    }
                },
                {
                    id: "programs/counter/src/state/mod.rs",
                    path: "programs/counter/src/state/mod.rs",
                    type: "struct_definition",
                    content: {
                        structs: [
                            {
                                name: "Counter",
                                type: "struct",
                                instruction_macro: [],
                                struct_vars: [
                                    {
                                        name: "count",
                                        type: "u64",
                                        macro: "none"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    id: "tests/counter.ts",
                    path: "tests/counter.ts",
                    type: "test_file",
                    content: {
                        description: "TypeScript tests for the Counter program, covering initialization, increment, decrement, and error handling."
                    }
                },
                {
                    id: "migrations/deploy.ts",
                    path: "migrations/deploy.ts",
                    type: "migration_script",
                    content: {
                        description: "Deployment script for the Counter program, setting up the Anchor provider."
                    }
                },
                {
                    id: "Anchor.toml",
                    path: "Anchor.toml",
                    type: "anchor_config",
                    content: {
                        name: "counter",
                        description: "Anchor project configuration for the Counter program, including toolchain, features, and provider settings."
                    }
                },
                {
                    id: "programs/counter/Cargo.toml",
                    path: "programs/counter/Cargo.toml",
                    type: "program_cargo_config",
                    content: {
                        name: "counter",
                        description: "Cargo.toml for the Counter program, defining package metadata and dependencies."
                    }
                }
            ])
        }
    ];

    for (const template of templates) {
        await prisma.template.upsert({
            where: { id: template.id },
            update: template,
            create: template
        });
    }

    console.log('templates updated');
}
