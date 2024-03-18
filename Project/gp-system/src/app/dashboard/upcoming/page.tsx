"use client";
import React from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export default function GetAppointmentPage() {
    let upcomingAppointments = api.appointment.getAppointments.useQuery();
    const cancel_appointment = api.appointment.cancelAppointment.useMutation();

    const cancelAppointment = async (appointmentDate: Date) => {
        const res = await cancel_appointment.mutateAsync({
            appointDate: appointmentDate,
        });
        if (res.success) {
            toast.success("Appointment cancelled.");

            upcomingAppointments.refetch();
            return;
        } else if (res.reason) {
            toast.error(res.reason);
            return;
        }
    };

    return (
        <div className="flex h-screen w-full bg-gray-100">
            <div className="flex-grow p-4">
                <h1 className="mb-8 text-xl font-bold">
                    Upcoming Appointments
                </h1>
                {upcomingAppointments.isLoading && (
                    <div>Loading appointments...</div>
                )}
                {upcomingAppointments.isSuccess &&
                    upcomingAppointments.data!.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="mb-4 rounded-lg bg-white p-4 shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        {appointment.title}
                                    </h2>
                                    <p className="text-xl font-bold text-gray-600">
                                        {appointment.doctorName}
                                    </p>
                                    <p className="text-gray-600">
                                        {appointment.appointmentDate.toLocaleString()}
                                    </p>
                                    <button
                                        onClick={() =>
                                            cancelAppointment(
                                                appointment.appointmentDate,
                                            )
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
