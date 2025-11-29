import z from "zod";


export const get_file_schema = z.object({
    file_path: z.string().describe('Path of the file to fetch'),
    contract_id: z.string().describe('contract id whose files should be fetched'),
})