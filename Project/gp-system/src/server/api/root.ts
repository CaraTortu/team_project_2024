import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { appointmentRouter } from "./routers/appointment";
import { clinicRouter } from "./routers/clinic";
import { paymentRouter } from "./routers/payment";

export const appRouter = createTRPCRouter({
    user: userRouter,
    appointment: appointmentRouter,
    clinic: clinicRouter,
    payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
