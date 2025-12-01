// schemas/userSchema.ts
import { z } from "zod";

export const userSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  role: z.enum(["admin", "user"]),
  department: z.string().min(1),
  password: z.string().min(6)
});

export type UserFormData = z.infer<typeof userSchema>;
