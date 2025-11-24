import z from "zod";


export const planner_output_schema = z.object({
    plan: z.string(),
    files_likely_affected: z.array(z.object({
        do: z.enum(["create", "update", "delete"]),
        file_path: z.string(),
        what_to_do: z.string(),
    })),
})