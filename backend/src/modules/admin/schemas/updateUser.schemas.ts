import {z} from "zod";

export const updateUserSchema = z.object({  // schema
    body: z.object({
        username: z.string().min(3).optional(),
        email: z.email("Invalid email format").optional(),
        role: z.enum(["admin", "user", "trainer"]).optional(),
        isBlocked: z.boolean().optional(),
        phone: z.string().optional(),
        city: z.string().optional(),
        pincode: z.string().optional(),
        gender: z.enum(["Male" , "Female" , "Other"]).optional()
    })
})

export type UpdateUserRequestDto = z.infer<typeof updateUserSchema>["body"] // incoming dto
// ["body"] extracts only the body type and keeps your DTO clean.