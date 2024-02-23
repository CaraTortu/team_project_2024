import { z } from "zod";

import { eq, and, gt, lt } from "drizzle-orm";
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
    getAvailableAppointments: protectedProcedure
        .input(z.object({ day: z.date() }))
        .query(async ({ ctx: { session }, input }) => {

            const startDate = new Date(
                input.day.getFullYear(),
                input.day.getMonth(),
                input.day.getDate() - 1,
            );
            const endDate = new Date(
                input.day.getFullYear(),
                input.day.getMonth(),
                input.day.getDate() + 1,
            );

            const userDoctor = await db.query.users
                .findFirst({ where: eq(users.id, session.user.id) })
                .then((r) => r?.doctorId);

            if (!userDoctor) {
                return { success: false, reason: "You have not set your GP" };
            }

            const appointmentsBooked = await db
                .select({
                    appointmentDate: appointment.appointmentDate,
                })
                .from(appointment)
                .where(
                    and(
                        eq(appointment.isCancelled, false),
                        gt(
                            appointment.appointmentDate,
                            startDate.toDateString(),
                        ),
                        lt(appointment.appointmentDate, endDate.toDateString()),
                    ),
                )
                .execute()
                .then((appointments) =>
                    appointments.map((p) =>
                        new Date(p.appointmentDate).toUTCString(),
                    ),
                );

            const latestDate = new Date(
                input.day.getFullYear(),
                input.day.getMonth(),
                input.day.getDate(),
                9, 0, 0
            );

            // TODO: retrieve the latest time each person will work.
            endDate.setHours(18);
            endDate.setDate(endDate.getDate() - 1);
            let availableAppointments = [];
            while (latestDate <= endDate) {
                availableAppointments.push(new Date(latestDate.getTime()));
                latestDate.setMinutes(latestDate.getMinutes() + 30);
            }

            const freeAppointments = new Map();
            availableAppointments.map((appointment) => {
                freeAppointments.set(
                    appointment.toUTCString(),
                    !appointmentsBooked.includes(appointment.toUTCString()),
                );
            });

            return { success: true, data: freeAppointments };
        }),
    createAppointment: protectedProcedure
        .input(
            z.object({
                patientId: z.string().min(1).max(255).optional(),
                appointmentDate: z.date(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const patientId =
                ctx.session.user.id == "user"
                    ? ctx.session.user.id
                    : input.patientId;

            if (!patientId) {
                return { success: false, reason: "Please supply a patient ID" };
            }

            const doctorId = await db.query.users
                .findFirst({
                    where: eq(users.id, patientId),
                })
                .execute()
                .then((user) => user?.doctorId);

            if (!doctorId) {
                return {
                    success: false,
                    reason: "Could not find a doctorId assigned to this patient",
                };
            }

            // TODO: Check the appointment is free
            // TODO: Verify date and time
            // TODO: Add payment amount

            await db
                .insert(appointment)
                .values({
                    userId: patientId,
                    doctorId: doctorId,
                    createdById:
                        ctx.session.user.userType === "doctor"
                            ? doctorId
                            : patientId,
                    appointmentDate: input.appointmentDate.toDateString(),
                    paymentAmount: 60,
                })
                .execute();

            return { success: true };
        }),
});
