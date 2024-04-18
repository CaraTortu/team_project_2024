import { z } from "zod";

import { eq, and, gt, lt, inArray } from "drizzle-orm";
import {
    createTRPCRouter,
    protectedProcedure,
    staffProtectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { appointment, users } from "~/server/db/schema";

export const appointmentRouter = createTRPCRouter({
    getAppointments: protectedProcedure
        .input(z.object({ pastOrFuture: z.string() }))
        .query(async ({ ctx: { session }, input }) => {
            return await db
                .select({
                    id: appointment.id,
                    appointmentDate: appointment.appointmentDate,
                    paymentAmount: appointment.paymentAmount,
                    paymentStatus: appointment.paymentStatus,
                    details: appointment.details,
                    notes: appointment.notes,
                    diagnoses: appointment.diagnoses,
                    doctorName: users.name,
                })
                .from(appointment)
                .where(
                    and(
                        eq(appointment.userId, session.user.id),
                        eq(appointment.isCancelled, false),
                        input.pastOrFuture == "future"
                            ? gt(appointment.appointmentDate, new Date())
                            : lt(appointment.appointmentDate, new Date()),
                    ),
                )
                .leftJoin(users, eq(users.id, appointment.doctorId))
                .execute()
                .then((res) =>
                    res.sort((a, b) =>
                        a.appointmentDate < b.appointmentDate ? -1 : 1,
                    ),
                );
        }),
    getDoctorAppointments: staffProtectedProcedure
        .input(z.object({ day: z.date() }))
        .query(async ({ ctx: { session }, input }) => {
            const startDate = new Date(
                input.day.getFullYear(),
                input.day.getMonth(),
                input.day.getDate(),
            );
            const endDate = new Date(
                input.day.getFullYear(),
                input.day.getMonth(),
                input.day.getDate() + 1,
            );

            return await db
                .select({
                    id: appointment.id,
                    appointmentDate: appointment.appointmentDate,
                    details: appointment.details,
                    notes: appointment.notes,
                    diagnoses: appointment.diagnoses,
                    patientName: users.name,
                    patientId: users.id,
                })
                .from(appointment)
                .where(
                    and(
                        eq(appointment.doctorId, session.user.id),
                        eq(appointment.isCancelled, false),
                        lt(appointment.appointmentDate, endDate),
                        gt(appointment.appointmentDate, startDate),
                    ),
                )
                .leftJoin(users, eq(users.id, appointment.userId))
                .execute()
                .then((res) =>
                    res.sort((a, b) =>
                        a.appointmentDate < b.appointmentDate ? -1 : 1,
                    ),
                );
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
                    inArray(appointment.doctorId, doctor_ids),
                    gt(appointment.appointmentDate, startDate),
                    lt(appointment.appointmentDate, endDate),
                    eq(appointment.isCancelled, false),
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
                            free:
                                appointment.getTime() > new Date().getTime() &&
                                !appointment_booked_doctor
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
    getPatientPastAppointments: staffProtectedProcedure
        .input(z.object({ patientId: z.string().optional().nullish() }))
        .query(async ({ ctx, input }) => {
            if (!input.patientId) {
                return null;
            }

            return await ctx.db
                .select({
                    date: appointment.appointmentDate,
                    diagnoses: appointment.diagnoses,
                    notes: appointment.notes,
                })
                .from(appointment)
                .where(
                    and(
                        eq(appointment.userId, input.patientId),
                        eq(appointment.isCancelled, false),
                        lt(appointment.appointmentDate, new Date()),
                    ),
                )
                .orderBy(appointment.appointmentDate);
        }),
    createAppointment: protectedProcedure
        .input(
            z.object({
                patientId: z.string().min(1).max(255).optional(),
                doctorId: z.string().min(1).max(255),
                appointmentDate: z.date(),
                details: z.string().min(1).max(1024),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if ([0, 6].includes(input.appointmentDate.getDay())) {
                return {
                    success: false,
                    reason: "You cannot book an appointment on saturday or sunday",
                };
            }

            if (input.appointmentDate.getTime() < new Date().getTime()) {
                return {
                    success: false,
                    reason: "You cannot book appointments in the past",
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

            if (!doctor?.clinic_id) {
                return { success: false, reason: "Invalid doctor ID" };
            }

            // TODO: Check the appointment is free
            const app = await db.query.appointment.findFirst({
                where: and(
                    eq(appointment.appointmentDate, input.appointmentDate),
                    eq(appointment.isCancelled, false),
                ),
            });

            if (app !== undefined) {
                return {
                    success: false,
                    reason: "You have an appointment booked for this time already",
                };
            }

            await db
                .insert(appointment)
                .values({
                    details: input.details,
                    userId: patientId,
                    doctorId: doctor.id,
                    createdById:
                        ctx.session.user.userType === "doctor"
                            ? ctx.session.user.id
                            : patientId,
                    appointmentDate: input.appointmentDate,
                    paymentAmount: 60,
                    clinicId: doctor.clinic_id
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
                        eq(appointment.appointmentDate, input.appointDate),
                        eq(appointment.userId, ctx.session.user.id),
                        eq(appointment.isCancelled, false),
                        gt(appointment.appointmentDate, new Date()),
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
    updateNotes: staffProtectedProcedure
        .input(
            z.object({
                day: z.date(),
                userID: z.string(),
                notes: z.string(),
                diagnoses: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (
                input.day.getDate() < new Date().getDate() ||
                input.day.getMonth() < new Date().getMonth() ||
                input.day.getFullYear() < new Date().getFullYear()
            ) {
                return {
                    success: false,
                    reason: "You cannot edit appointments from previous days",
                };
            }

            await ctx.db
                .update(appointment)
                .set({ notes: input.notes, diagnoses: input.diagnoses })
                .where(
                    and(
                        eq(appointment.userId, input.userID),
                        eq(appointment.doctorId, ctx.session.user.id),
                        eq(appointment.appointmentDate, input.day),
                    ),
                );

            return { success: true };
        }),
});
