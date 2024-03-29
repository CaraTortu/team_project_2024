import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { appointmentRouter } from "./routers/appointment";
import { clinicRouter } from "./routers/clinic";

export const appRouter = createTRPCRouter({
    user: userRouter,
    appointment: appointmentRouter,
    clinic: clinicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
