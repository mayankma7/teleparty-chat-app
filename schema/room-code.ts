import { z } from "zod";

export const roomCodeSchema = z.object({
  code: z.string().nonempty("Please enter an existing code"),
});

export type RoomCodeFormData = z.infer<typeof roomCodeSchema>;
