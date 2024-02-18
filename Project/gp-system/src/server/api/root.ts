import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { appointmentRouter } from "./routers/appointment";

export const appRouter = createTRPCRouter({
    user: userRouter,
    appointment: appointmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
