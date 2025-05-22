import z from "zod";

export const userMessageSchema = z.object({
  message: z.string().nonempty(),
});

export type UserMessageFormData = z.infer<typeof userMessageSchema>;
