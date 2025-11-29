import z from 'zod';

export const new_planner_output_schema = z.object({
    should_continue: z.boolean(),
    plan: z.string(),
    contract_name: z.string(),
    context: z.string(),
    files_likely_affected: z.array(
        z.object({
            do: z.enum(['create', 'update', 'delete']),
            file_path: z.string(),
            what_to_do: z.string(),
        }),
    ),
});

export const old_planner_output_schema = z.object({
    should_continue: z.boolean(),
    plan: z.string(),
    context: z.string(),
    files_likely_affected: z.array(
        z.object({
            do: z.enum(['create', 'update', 'delete']),
            file_path: z.string(),
            what_to_do: z.string(),
        }),
    ),
});

// gemini doesn't support any types, I've to specify the complete exact type
// design the typing
export const finalizer_output_schema = z.object({
    idl: z.array(z.object()),
    context: z.string(),
});

export type finalizer =
    | {
          id: string;
          path: string;
          type: 'entrypoint';
          mod_name: string;
          pubic_key: string;
          instructions: [{ name: string }];
      }
    | {
          id: string;
          path: string;
          type: 'instruction';
          instructions: [
              {
                  name: string;
                  params: [{ name: string; type: string }];
                  returns: [{ type: string }];
              },
          ];
      }
    | {
          id: string;
          path: string;
          type: 'struct';
          structs: [
              {
                  name: string;
                  type: string;
                  instructions: [{ name: string; type: string }];
                  struct_vars: [{ name: string; type: string; macro: string }];
              },
          ];
      }
    | {
          id: string;
          path: string;
          type: 'instruction_and_struct';
          instructions: [
              {
                  name: string;
                  params: [{ name: string; type: string }];
                  returns: [{ type: string }];
              },
          ];
          structs: [
              {
                  name: string;
                  type: string;
                  instructions: [{ name: string; type: string }];
                  struct_vars: [{ name: string; type: string; macro: string }];
              },
          ];
      }
    | {
          id: string;
          path: string;
          type: 'test';
          description: string;
      }
    | {
          id: string;
          path: string;
      }
    | {
          id: string;
          path: string;
          type: 'mod';
          mods: [{ name: string }];
      }
    | {
          id: string;
          path: string;
          type: 'packages';
          name: string;
          description: string;
      };
