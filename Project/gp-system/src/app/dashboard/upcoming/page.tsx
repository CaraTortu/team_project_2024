"use client";
import React from "react";
import { api } from "~/trpc/react";

export default function GetAppointmentPage() {
    const appointments = api.appointment.getAppointments.useQuery();

    // useState hook to manage appointments
    let upcoming_appointments = appointments.data?.map((appointment) => {
        return {
            id: appointment.id ?? "",
            title: appointment.title ?? "",
            doctor: appointment.doctorName ?? "",
            date: appointment.appointmentDate.toLocaleString() ?? "",
            details: appointment.details ?? "",
            isDetailVisible: false,
        };
    });

    // Function to toggle the details visibility
    const toggleDetails = (appointmentId: number) => {
        upcoming_appointments = upcoming_appointments?.map((appointment) =>
            appointment.id === appointmentId
                ? {
                      ...appointment,
                      isDetailVisible: !appointment.isDetailVisible,
                  }
                : appointment,
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-grow p-4">
                <h1 className="mb-4 text-xl font-bold">
                    Upcoming Appointments
                </h1>
                {upcoming_appointments &&
                    upcoming_appointments.map((appointment) => (
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
                                        {appointment.date}
                                    </p>
                                    {/* Toggle button */}
                                    <button
                                        onClick={() =>
                                            toggleDetails(appointment.id)
                                        }
                                        className="mt-2 text-blue-500 hover:text-blue-600"
                                    >
                                        {appointment.isDetailVisible
                                            ? "Hide Details"
                                            : "Show Details"}
                                    </button>
                                </div>
                            </div>
                            {/* Details section */}
                            {appointment.isDetailVisible && (
                                <div className="mt-2 text-gray-600">
                                    <p>Details: {appointment.details}</p>
                                    {/* Additional details can be added here */}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
