import { z } from "zod";

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
    createAppointment: protectedProcedure
        .input(
            z.object({
                patientId: z.string().min(1).max(255).optional(),
                appointmentDate: z.date(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.session.user.userType === "user" && input.patientId) {
                return {
                    success: false,
                    reason: "You don't have permissions to do this'",
                };
            }

            const patientId = input.patientId ?? ctx.session.user.id;
            const doctorId = await db.query.users
                .findFirst({
                    where: eq(users.id, patientId),
                })
                .execute()
                .then((user) => user?.doctorId);

            // TODO: Check the appointment is free
            // TODO: Verify date and time
            // TODO: Add payment amount

            await db
                .insert(appointment)
                .values({
                    userId: patientId,
                    doctorId: doctorId ?? "",
                    createdById:
                        ctx.session.user.userType === "doctor"
                            ? doctorId
                            : patientId,
                    appointmentDate: input.appointmentDate,
                    paymentAmount: 60,
                })
                .execute();

            return { success: true };
        }),
});
