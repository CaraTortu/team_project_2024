import { eq } from "drizzle-orm";
import { adminProtectedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { appointment } from "~/server/db/schema";

export const moneyRouter = createTRPCRouter({
    getIncome: adminProtectedProcedure.query(async ({ ctx }) => {
        const data = await ctx.db.query.clinic.findMany({
            with: {
                doctors: {
                    columns: { id: true, name: true },
                    with: {
                        doctor_appointments: {
                            columns: { paymentAmount: true, paidDate: true },
                            where: eq(appointment.paymentStatus, "complete"),
                        }
                    }
                }
            },
        });

        const income_total: Map<string, number> = new Map();

        data.forEach((clinic) => {
            clinic.doctors.forEach((doctor) => {
                doctor.doctor_appointments.forEach((appointment) => {
                    if (!income_total.has(clinic.name)) {
                        income_total.set(clinic.name, 0);
                    }
                    const new_income = income_total.get(clinic.name)! + (appointment.paymentAmount || 0)
                    income_total.set(clinic.name, new_income);
                })
            })
        })

        return {
            total: data.map((clinic) => {
                // Return a Map for which each clinic has a total income, and the amount each doctor has made
                return {
                    clinic: clinic.name,
                    clinic_income: income_total.get(clinic.name) || 0,
                    doctor_income: clinic.doctors.map((doctor) => {
                        return {
                            doctor: doctor.name,
                            income: doctor.doctor_appointments.reduce((acc, appointment) => acc + (appointment.paymentAmount || 0), 0)
                        }
                    })
                }
            }),
            monthly: data.map((clinic) => {
                // Return a Map in which each clinic has a total income, and the amount each doctor has made in the last month
                const this_month = new Date();
                this_month.setHours(0, 0, 0, 0);
                this_month.setDate(1);

                return {
                    clinic: clinic.name,
                    clinic_income: clinic.doctors.reduce((acc, doctor) => {
                        return acc + doctor.doctor_appointments.reduce((acc, appointment) => {
                            if (appointment.paidDate && appointment.paidDate >= this_month) {
                                return acc + (appointment.paymentAmount || 0)
                            }

                            return acc;
                        }, 0)
                    }, 0),
                    doctor_income: clinic.doctors.map((doctor) => {
                        return {
                            doctor: doctor.name,
                            income: doctor.doctor_appointments.reduce((acc, appointment) => {
                                if (appointment.paidDate && appointment.paidDate >= this_month) {
                                    return acc + (appointment.paymentAmount || 0)
                                }

                                return acc;
                            }, 0)
                        }
                    })
                }
            })
        }
    })
});
