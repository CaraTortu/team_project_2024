import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clinic } from "~/server/db/schema";

export const clinicRouter = createTRPCRouter({
    getClinics: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db
            .select({
                id: clinic.id,
                address: clinic.address,
            })
            .from(clinic);
    }),
});
