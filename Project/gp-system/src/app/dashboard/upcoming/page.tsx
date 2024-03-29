"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export default function GetAppointmentPage() {
    const [pastOrFuture, setPastOrFuture] = useState("future");
    let upcomingAppointments = api.appointment.getAppointments.useQuery({
        pastOrFuture,
    });
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
        <div className="w-full flex-col">
            <div className="flex items-center gap-2 px-4 pb-4 text-xl font-bold">
                <select
                    value={pastOrFuture}
                    onChange={(e) => setPastOrFuture(e.target.value)}
                    className="relative rounded-lg border-2 border-blue-400 bg-slate-100 px-2 py-1 text-center duration-300 focus:outline-none focus:ring-0"
                >
                    <option value="future">Upcoming</option>
                    <option value="past">Previous</option>
                </select>
                <p>appointments</p>
            </div>
            <div className="grid flex-grow grid-cols-3 gap-2 px-4">
                {upcomingAppointments.isLoading && (
                    <p className="col-end-3 mt-12 text-center text-2xl font-semibold text-gray-600">
                        Loading appointments...
                    </p>
                )}
                {upcomingAppointments.isSuccess &&
                    upcomingAppointments.data.length == 0 && (
                        <p className="col-end-3 mt-12 text-center text-2xl font-semibold text-gray-600">
                            You have no{" "}
                            {pastOrFuture == "future" ? "upcoming" : "past"}{" "}
                            appointments
                        </p>
                    )}
                {upcomingAppointments.isSuccess &&
                    upcomingAppointments.data!.map((appointment) => (
                        <div
                            key={appointment.id}
                            className="mb-4 flex justify-between gap-2 rounded-lg bg-slate-200 p-4 shadow-xl"
                        >
                            <div className="flex items-center justify-between break-words">
                                <div>
                                    <p className="text-xl font-bold text-black">
                                        {appointment.doctorName}
                                    </p>
                                    <p className="font-bold text-gray-600">
                                        {appointment.appointmentDate.toLocaleString()}
                                    </p>
                                    <p className="mt-2 text-gray-600">
                                        <span className="font-bold text-gray-800">
                                            Payment
                                        </span>
                                        : {appointment.paymentAmount}€
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-bold text-gray-800">
                                            Payment status
                                        </span>
                                        : {appointment.paymentStatus}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-bold text-gray-800">
                                            Reason for appointment
                                        </span>
                                        : {appointment.details}
                                    </p>
                                    {pastOrFuture == "past" && (<p className="text-gray-600">
                                        <span className="font-bold text-gray-800">
                                            Notes
                                        </span>
                                        : {appointment.notes}
                                    </p>)}
                                    {pastOrFuture == "past" && (<p className="text-gray-600">
                                        <span className="font-bold text-gray-800">
                                            Diagnoses
                                        </span>
                                        : {appointment.diagnoses}
                                    </p>)}
                                </div>
                            </div>
                            <div className="flex min-w-32 flex-col items-center justify-center space-y-2">
                                {pastOrFuture == "future" && (
                                    <button
                                        onClick={() =>
                                            cancelAppointment(
                                                appointment.appointmentDate,
                                            )
                                        }
                                        className="mt-2 w-full rounded-lg bg-blue-400 px-4 py-1 text-white duration-300 hover:bg-blue-500 hover:shadow-xl"
                                    >
                                        Cancel
                                    </button>
                                )}
                                {appointment.paymentStatus != "complete" && (
                                    <button
                                        onClick={() =>
                                            toast.success(
                                                "Redirecting you to payment...",
                                            )
                                        }
                                        className="mt-2 w-full rounded-lg bg-blue-400 px-4 py-1 text-white duration-300 hover:bg-blue-500 hover:shadow-xl"
                                    >
                                        Pay now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
