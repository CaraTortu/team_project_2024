import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import bcrypt from "bcrypt";
import { randomString } from "~/server/utils";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
    registerUser: publicProcedure
        .input(
            z.object({
                name: z.string().max(255).min(3),
                email: z.string().email().max(255),
                password: z.string().min(8),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const users_with_same_email = await ctx.db
                .select()
                .from(users)
                .where(eq(users.email, input.email));

            if (users_with_same_email.length !== 0) {
                return { success: false, reason: "Email already exists" };
            }

            await ctx.db.insert(users).values({
                id: randomString(255),
                email: input.email,
                name: input.name,
                password: bcrypt.hashSync(input.password, 5),
                emailVerified: null,
            });

            return { success: true };
        }),
});