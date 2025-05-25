import { z } from "zod";

export const userDetailsSchema = z.object({
  nickname: z.string().nonempty(),
  pictureUrl: z.string().optional(),
});

export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;
