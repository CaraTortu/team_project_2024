import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const clinicRouter = createTRPCRouter({
    getClinics: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db
            .query.clinic.findMany({
                with: {
                    appointments: {
                        columns: { id: true, isCancelled: true }
                    }
                }
            })
    }),
});
