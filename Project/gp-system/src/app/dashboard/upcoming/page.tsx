"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export default function GetAppointmentPage() {
    const appointments = api.appointment.getAppointments.useQuery();
    const cancel_appointment = api.appointment.cancelAppointment.useMutation();

    // useState hook to manage appointments
    const [upcomingAppointments, setUpcomingAppointments] = useState(
        appointments.data?.map((appointment) => {
            return {
                id: appointment.id,
                title: appointment.title,
                doctor: appointment.doctorName,
                date: appointment.appointmentDate,
                details: appointment.details,
            };
        }),
    );

    const cancelAppointment = async (appointmentDate: Date) => {
        const res = await cancel_appointment.mutateAsync({
            appointDate: appointmentDate,
        });
        if (res.success) {
            toast.success("Appointment cancelled.");
            setUpcomingAppointments(
                upcomingAppointments?.filter(
                    (app) => app.date != appointmentDate,
                ),
            );
            return;
        } else if (res.reason) {
            toast.error(res.reason);
            return;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-grow p-4">
                <h1 className="mb-4 text-xl font-bold">
                    Upcoming Appointments
                </h1>
                {upcomingAppointments &&
                    upcomingAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="mb-4 rounded-lg bg-white p-4 shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        {appointment.title}
                                    </h2>
                                    <p className="text-gray-600">
                                        With {appointment.doctor}
                                    </p>
                                    <p className="text-gray-600">
                                        {appointment.date.toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() =>
                                            cancelAppointment(appointment.date)
                                        }
                                        className="mt-2 text-blue-500 hover:text-blue-600"
                                    >
                                        Cancel appointment
                                    </button>
                                </div>
                            </div>
                            {/* Details section */}
                            <div className="mt-2 text-gray-600">
                                <p>Details: {appointment.details}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
