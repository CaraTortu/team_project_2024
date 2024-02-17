import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
    user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
