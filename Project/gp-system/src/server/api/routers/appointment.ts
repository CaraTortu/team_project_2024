//import { z } from "zod";

import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { appointment, users } from "~/server/db/schema";

export const appointmentRouter = createTRPCRouter({
    getAppointments: protectedProcedure.query(async ({ ctx: { session } }) => {
        return await db
            .select({
                appointmentDate: appointment.appointmentDate,
                paymentAmount: appointment.paymentAmount,
                paymentStatus: appointment.paymentStatus,
                isCancelled: appointment.isCancelled,
                doctorName: users.name,
            })
            .from(appointment)
            .where(eq(appointment.userId, session.user.id))
            .leftJoin(users, eq(users.id, appointment.doctorId))
            .execute();
    }),
});
