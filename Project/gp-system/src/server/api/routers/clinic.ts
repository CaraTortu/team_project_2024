import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clinic } from "~/server/db/schema";

export const clinicRouter = createTRPCRouter({
    getClinics: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db
            .select({
                id: clinic.id,
                name: clinic.name,
                address: clinic.address,
                lat: clinic.latitude,
                long: clinic.longitude,
            })
            .from(clinic);
    }),
});
