import { z } from "zod";

export const subscriberSchema = z.object({
  email: z.string().email(),
  status: z.enum(["active", "inactive"]),
  createdAt: z.string(),
  preferences: z.object({
    frequency: z.enum(["instant", "daily", "weekly"]).default("instant"),
    categories: z.array(z.string()).optional(),
  })
});

export type Subscriber = z.infer<typeof subscriberSchema>;