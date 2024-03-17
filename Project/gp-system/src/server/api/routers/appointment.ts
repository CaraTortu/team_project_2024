import { z } from "zod";

import { eq, and, gt, lt, inArray } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { appointment, users } from "~/server/db/schema";

export const appointmentRouter = createTRPCRouter({
    getAppointments: protectedProcedure.query(async ({ ctx: { session } }) => {
        return await db
            .select({
                id: appointment.id,
                appointmentDate: appointment.appointmentDate,
                paymentAmount: appointment.paymentAmount,
                paymentStatus: appointment.paymentStatus,
                title: appointment.title,
                details: appointment.details,
                doctorName: users.name,
            })
            .from(appointment)
            .where(
                and(
                    eq(appointment.userId, session.user.id),
                    eq(appointment.isCancelled, false),
                ),
            )
            .leftJoin(users, eq(users.id, appointment.doctorId))
            .execute();
    }),
    getAvailableAppointments: protectedProcedure
        .input(z.object({ day: z.date(), clinic_id: z.number().min(0) }))
        .query(async ({ input }) => {
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

            if ([0, 6].includes(input.day.getDay())) {
                return { success: true, data: [] };
            }

            const clinic_doctors = await db
                .select({
                    id: users.id,
                    name: users.name,
                })
                .from(users)
                .where(
                    and(
                        eq(users.clinic_id, input.clinic_id),
                        eq(users.userType, "doctor"),
                    ),
                )
                .execute();

            if (clinic_doctors === undefined) {
                return { success: false, reason: "The clinic does not exist" };
            }

            const doctor_ids = clinic_doctors.map((doctor) => doctor.id);

            const appointmentsBooked = await db.query.appointment.findMany({
                where: and(
                    and(
                        and(
                            inArray(appointment.doctorId, doctor_ids),
                            gt(appointment.appointmentDate, startDate),
                        ),
                        lt(appointment.appointmentDate, endDate),
                        eq(appointment.isCancelled, false),
                    ),
                ),
                with: {
                    doctor: {
                        columns: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            const latestDate = new Date(
                input.day.getFullYear(),
                input.day.getMonth(),
                input.day.getDate(),
                9,
                0,
                0,
            );

            // TODO: retrieve the latest time each person will work.
            endDate.setHours(14);
            endDate.setDate(endDate.getDate() - 1);
            const availableAppointments: Date[] = [];

            while (latestDate <= endDate) {
                availableAppointments.push(new Date(latestDate.getTime()));
                latestDate.setMinutes(latestDate.getMinutes() + 30);
            }

            const freeAppointments = clinic_doctors.map((doctor) => {
                const appointment_booked_doctor = appointmentsBooked.filter(
                    (appointment) => appointment.doctor.id == doctor.id,
                );

                return {
                    doctor_id: doctor.id,
                    doctor_name: doctor.name,
                    available_appointments: availableAppointments.map(
                        (appointment) => ({
                            free: !appointment_booked_doctor
                                .map((a) =>
                                    a.appointmentDate.getTime().toString(),
                                )
                                .includes(appointment.getTime().toString()),
                            time: appointment,
                        }),
                    ),
                };
            });

            return { success: true, data: freeAppointments };
        }),
    createAppointment: protectedProcedure
        .input(
            z.object({
                patientId: z.string().min(1).max(255).optional(),
                doctorId: z.string().min(1).max(255),
                appointmentDate: z.date(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if ([0, 6].includes(input.appointmentDate.getDay())) {
                return {
                    success: false,
                    reason: "You cannot book an appointment on saturday or sunday",
                };
            }

            const patientId =
                ctx.session.user.userType == "user"
                    ? ctx.session.user.id
                    : input.patientId;

            if (!patientId) {
                return { success: false, reason: "Please supply a patient ID" };
            }

            const doctor = await db.query.users.findFirst({
                where: eq(users.id, input.doctorId),
            });

            if (!doctor) {
                return { success: false, reason: "Invalid doctor ID" };
            }

            // TODO: Check the appointment is free
            const app = await db.query.appointment.findFirst({
                where: and(
                    and(
                        eq(appointment.appointmentDate, input.appointmentDate),
                        eq(appointment.doctorId, input.doctorId),
                    ),
                    eq(appointment.isCancelled, false),
                ),
            });

            if (app !== undefined) {
                return { success: false, reason: "Appointment already booked" };
            }

            // TODO: Verify date and time
            // TODO: Add payment amount

            await db
                .insert(appointment)
                .values({
                    userId: patientId,
                    doctorId: doctor.id,
                    createdById:
                        ctx.session.user.userType === "doctor"
                            ? ctx.session.user.id
                            : patientId,
                    appointmentDate: input.appointmentDate,
                    paymentAmount: 60,
                })
                .execute();

            return { success: true };
        }),
    cancelAppointment: protectedProcedure
        .input(z.object({ appointDate: z.date() }))
        .mutation(async ({ ctx, input }) => {
            const appointment_deleted = await ctx.db
                .update(appointment)
                .set({ isCancelled: true })
                .where(
                    and(
                        and(
                            eq(appointment.appointmentDate, input.appointDate),
                            eq(appointment.userId, ctx.session.user.id),
                        ),
                        eq(appointment.isCancelled, false),
                    ),
                )
                .returning();

            if (appointment_deleted.length == 0) {
                return {
                    success: false,
                    reason: "This appointment does not exist or has already been cancelled",
                };
            }

            return { success: true };
        }),
});
