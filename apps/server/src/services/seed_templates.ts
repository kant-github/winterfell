import { prisma } from '@winterfell/database';

export async function seedTemplates() {
    const templates = [
        {
            id: "456fbc47-4f46-487a-9d7d-01fb16a7396e",
            title: "Todo Contract",
            description: "A simple Anchor program for managing todo items.",
            category: "utility",
            tags: [
                "todo",
                "crud",
                "anchor",
                "solana"
            ],
            anchorVersion: "0.32.1",
            solanaVersion: "1.18.4",
            summarisedObject: JSON.stringify([
                {
                    "id": "rust-toolchain.toml",
                    "path": "rust-toolchain.toml",
                    "type": "description_file",
                    "content": {
                        "description": "Defines the Rust toolchain configuration for the project."
                    }
                },
                {
                    "id": "programs/todo_contract/Cargo.toml",
                    "path": "programs/todo_contract/Cargo.toml",
                    "type": "project_info",
                    "content": {
                        "name": "todo_contract",
                        "description": "Created with Anchor"
                    }
                },
                {
                    "id": "migrations/deploy.ts",
                    "path": "migrations/deploy.ts",
                    "type": "description_file",
                    "content": {
                        "description": "Deployment script for the TodoContract program."
                    }
                },
                {
                    "id": "programs/todo_contract/src/lib.rs",
                    "path": "programs/todo_contract/src/lib.rs",
                    "type": "program_definition",
                    "content": {
                        "mod_name": "todo_contract",
                        "public_key": "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
                        "instructions": [
                            {
                                "name": "create_todo"
                            },
                            {
                                "name": "mark_todo_complete"
                            },
                            {
                                "name": "delete_todo"
                            }
                        ]
                    }
                },
                {
                    "id": "programs/todo_contract/src/constants.rs",
                    "path": "programs/todo_contract/src/constants.rs",
                    "type": "description_file",
                    "content": {
                        "description": "Defines constants used within the todo contract, such as seeds and content length."
                    }
                },
                {
                    "id": "programs/todo_contract/src/errors/mod.rs",
                    "path": "programs/todo_contract/src/errors/mod.rs",
                    "type": "module_definition",
                    "content": {
                        "mods": [
                            {
                                "name": "error_codes"
                            }
                        ]
                    }
                },
                {
                    "id": "programs/todo_contract/src/errors/error_codes.rs",
                    "path": "programs/todo_contract/src/errors/error_codes.rs",
                    "type": "description_file",
                    "content": {
                        "description": "Defines custom error codes for the todo contract, including authorization and content validation."
                    }
                },
                {
                    "id": "programs/todo_contract/src/state/mod.rs",
                    "path": "programs/todo_contract/src/state/mod.rs",
                    "type": "module_definition",
                    "content": {
                        "mods": [
                            {
                                "name": "todo_account"
                            }
                        ]
                    }
                },
                {
                    "id": "programs/todo_contract/src/state/todo_account.rs",
                    "path": "programs/todo_contract/src/state/todo_account.rs",
                    "type": "struct_definition",
                    "content": {
                        "structs": [
                            {
                                "name": "TodoAccount",
                                "type": "Account",
                                "instruction_macro": [],
                                "struct_vars": [
                                    {
                                        "name": "creator",
                                        "type": "Pubkey",
                                        "macro": ""
                                    },
                                    {
                                        "name": "content",
                                        "type": "String",
                                        "macro": ""
                                    },
                                    {
                                        "name": "is_done",
                                        "type": "bool",
                                        "macro": ""
                                    },
                                    {
                                        "name": "bump",
                                        "type": "u8",
                                        "macro": ""
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "id": "programs/todo_contract/src/instructions/mod.rs",
                    "path": "programs/todo_contract/src/instructions/mod.rs",
                    "type": "module_definition",
                    "content": {
                        "mods": [
                            {
                                "name": "create_todo"
                            },
                            {
                                "name": "mark_todo_complete"
                            },
                            {
                                "name": "delete_todo"
                            }
                        ]
                    }
                },
                {
                    "id": "programs/todo_contract/src/instructions/create_todo.rs",
                    "path": "programs/todo_contract/src/instructions/create_todo.rs",
                    "type": "instruction_and_struct",
                    "content": {
                        "instructions": [
                            {
                                "name": "handler",
                                "params": [
                                    {
                                        "name": "ctx",
                                        "type": "Context<CreateTodo>"
                                    },
                                    {
                                        "name": "content",
                                        "type": "String"
                                    }
                                ],
                                "returns": [
                                    {
                                        "type": "Result<()>"
                                    }
                                ]
                            }
                        ],
                        "structs": [
                            {
                                "name": "CreateTodo",
                                "type": "Accounts",
                                "instruction_macro": [
                                    {
                                        "name": "content",
                                        "type": "String"
                                    }
                                ],
                                "struct_vars": [
                                    {
                                        "name": "todo_account",
                                        "type": "Account<'info, TodoAccount>",
                                        "macro": "init, payer = signer, space = TodoAccount::LEN, seeds = [TODO_SEED, signer.key().as_ref(), content.as_bytes()], bump"
                                    },
                                    {
                                        "name": "signer",
                                        "type": "Signer<'info>",
                                        "macro": "mut"
                                    },
                                    {
                                        "name": "system_program",
                                        "type": "Program<'info, System>",
                                        "macro": ""
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "id": "programs/todo_contract/src/instructions/mark_todo_complete.rs",
                    "path": "programs/todo_contract/src/instructions/mark_todo_complete.rs",
                    "type": "instruction_and_struct",
                    "content": {
                        "instructions": [
                            {
                                "name": "handler",
                                "params": [
                                    {
                                        "name": "ctx",
                                        "type": "Context<MarkTodoComplete>"
                                    }
                                ],
                                "returns": [
                                    {
                                        "type": "Result<()>"
                                    }
                                ]
                            }
                        ],
                        "structs": [
                            {
                                "name": "MarkTodoComplete",
                                "type": "Accounts",
                                "instruction_macro": [],
                                "struct_vars": [
                                    {
                                        "name": "todo_account",
                                        "type": "Account<'info, TodoAccount>",
                                        "macro": "mut, seeds = [TODO_SEED, todo_account.creator.key().as_ref(), todo_account.content.as_bytes()], bump = todo_account.bump"
                                    },
                                    {
                                        "name": "signer",
                                        "type": "Signer<'info>",
                                        "macro": "mut"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "id": "programs/todo_contract/src/instructions/delete_todo.rs",
                    "path": "programs/todo_contract/src/instructions/delete_todo.rs",
                    "type": "instruction_and_struct",
                    "content": {
                        "instructions": [
                            {
                                "name": "handler",
                                "params": [
                                    {
                                        "name": "ctx",
                                        "type": "Context<DeleteTodo>"
                                    }
                                ],
                                "returns": [
                                    {
                                        "type": "Result<()>"
                                    }
                                ]
                            }
                        ],
                        "structs": [
                            {
                                "name": "DeleteTodo",
                                "type": "Accounts",
                                "instruction_macro": [],
                                "struct_vars": [
                                    {
                                        "name": "todo_account",
                                        "type": "Account<'info, TodoAccount>",
                                        "macro": "mut, close = signer, seeds = [TODO_SEED, todo_account.creator.key().as_ref(), todo_account.content.as_bytes()], bump = todo_account.bump"
                                    },
                                    {
                                        "name": "signer",
                                        "type": "Signer<'info>",
                                        "macro": "mut"
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "id": "tests/todo_contract.ts",
                    "path": "tests/todo_contract.ts",
                    "type": "description_file",
                    "content": {
                        "description": "Integration tests for the TodoContract program, covering creation, completion, and deletion of todos."
                    }
                },
                {
                    "id": ".gitignore",
                    "path": ".gitignore",
                    "type": "description_file",
                    "content": {
                        "description": "Specifies intentionally untracked files to ignore by Git."
                    }
                },
                {
                    "id": ".prettierignore",
                    "path": ".prettierignore",
                    "type": "description_file",
                    "content": {
                        "description": "Specifies files and directories to be ignored by Prettier formatting."
                    }
                },
                {
                    "id": "Anchor.toml",
                    "path": "Anchor.toml",
                    "type": "project_info",
                    "content": {
                        "name": "todo_contract",
                        "description": "Anchor configuration file for the todo contract project."
                    }
                },
                {
                    "id": "Cargo.toml",
                    "path": "Cargo.toml",
                    "type": "project_info",
                    "content": {
                        "name": "todo_contract",
                        "description": "A Solana Anchor contract for managing todo items."
                    }
                },
                {
                    "id": "package.json",
                    "path": "package.json",
                    "type": "project_info",
                    "content": {
                        "name": "todo_contract",
                        "description": "Package metadata and scripts for the todo contract project."
                    }
                },
                {
                    "id": "tsconfig.json",
                    "path": "tsconfig.json",
                    "type": "description_file",
                    "content": {
                        "description": "TypeScript configuration file for the project."
                    }
                }
            ])
        }
    ]

    for (const template of templates) {
        await prisma.template.upsert({
            where: { id: template.id },
            update: template,
            create: template,
        });
    }

    console.log('templates updated');
}
