import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { appointment, users } from "~/server/db/schema";

export const paymentRouter = createTRPCRouter({
    createCheckoutSession: protectedProcedure
        .input(z.object({ appointmentId: z.string() }))
        .mutation(async ({ ctx: { db, stripe, session }, input }) => {
            const userId = session.user.id;

            if (isNaN(Number(input.appointmentId))) {
                return {
                    success: false,
                    reason: "This appointment does not exist",
                };
            }

            const appointmentId = Number.parseInt(input.appointmentId);

            const userAppointments = await db
                .select({
                    id: appointment.id,
                    paymentStatus: appointment.paymentStatus,
                    paymentAmount: appointment.paymentAmount,
                    appointmentDate: appointment.appointmentDate,
                })
                .from(appointment)
                .where(
                    and(
                        eq(appointment.userId, userId),
                        eq(appointment.id, appointmentId),
                    ),
                );

            if (userAppointments.length == 0) {
                return {
                    success: false,
                    reason: "This appointment does not exist",
                };
            }

            const appointment_selected = userAppointments[0];

            if (
                appointment_selected?.paymentStatus == "complete" ||
                !appointment_selected?.paymentAmount
            ) {
                return {
                    success: false,
                    reason: "You have already paid for this appointment",
                };
            }

            const payment_session = await stripe.checkout.sessions.create({
                ui_mode: "embedded",
                currency: "eur",
                customer_email: session.user.email ?? "",
                line_items: [
                    {
                        price_data: {
                            currency: "eur",
                            product_data: {
                                name:
                                    "Gp appointment at " +
                                    appointment_selected.appointmentDate.toUTCString(),
                            },
                            unit_amount:
                                appointment_selected.paymentAmount * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                metadata: {
                    appointmentId,
                },
                automatic_tax: {
                    enabled: true,
                },
                return_url: `${env.NEXTAUTH_URL}/dashboard/checkout/${appointment_selected.id}/{CHECKOUT_SESSION_ID}`,
            });

            await db
                .update(appointment)
                .set({ checkoutSession: payment_session })
                .where(eq(appointment.id, appointmentId));

            return {
                success: true,
                clientSecret: payment_session.client_secret,
            };
        }),
    getCheckoutStatus: protectedProcedure
        .input(z.object({ checkoutId: z.string() }))
        .query(async ({ ctx: { db, stripe }, input }) => {
            const sess = await stripe.checkout.sessions.retrieve(
                input.checkoutId,
            );

            const appointmentId = z
                .object({ appointmentId: z.string() })
                .safeParse(sess.metadata);

            if (!appointmentId.success) {
                return {
                    success: false,
                    reason: "Something went wrong on our end.",
                };
            }

            const payment_status: "complete" | "pending" =
                sess.status == "complete" ? "complete" : "pending";
            const appointment_details = await db
                .update(appointment)
                .set({
                    paymentStatus: payment_status,
                    checkoutSession: sess,
                    paidDate: new Date(),
                })
                .where(
                    eq(
                        appointment.id,
                        Number(appointmentId.data.appointmentId),
                    ),
                )
                .returning();

            if (appointment_details.length == 0) {
                return { success: false, reason: "How did this happen?" };
            }

            const f_appointment = appointment_details[0]!;
            const doctor_name = await db
                .select({ name: users.name })
                .from(users)
                .where(eq(users.id, f_appointment.doctorId));

            return {
                success: true,
                session: sess,
                appointment: {
                    id: f_appointment.id,
                    doctorName: doctor_name[0]?.name,
                    appointmentDate: f_appointment.appointmentDate,
                },
            };
        }),
});
