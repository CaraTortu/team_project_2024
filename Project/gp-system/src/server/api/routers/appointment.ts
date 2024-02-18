//import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const appointmentRouter = createTRPCRouter({
    getAppointments: protectedProcedure.query(({ ctx: { session } }) => {
        console.log(session);
    }),
});
