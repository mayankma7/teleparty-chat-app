import { z } from "zod";

export const userDetailsSchema = z.object({
  nickname: z.string().nonempty(),
});

export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;
