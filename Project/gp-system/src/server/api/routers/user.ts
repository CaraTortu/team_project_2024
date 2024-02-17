import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import bcrypt from "bcrypt"

const randomString = (length: number) => {
    const dic = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let ran = "";
    for (let i = 0; i < length; i++) {
        ran += dic[Math.floor(Math.random() * dic.length)]
    }

    return ran
}

export const userRouter = createTRPCRouter({
    registerUser: publicProcedure
        .input(z.object({
                name: z.string().max(255),
                email: z.string().email().max(255),
                username: z.string().max(255),
                password: z.string(),
            }))
        .mutation(async ({ ctx, input }) => {
            ctx.db.insert(users).values({
                id: randomString(255), 
                email: input.email,
                name: input.name,
                password: bcrypt.hashSync(input.password, 20)
            })
        }),
});
