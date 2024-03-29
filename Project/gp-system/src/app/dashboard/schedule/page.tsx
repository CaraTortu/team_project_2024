"use client";
import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { api } from "~/trpc/react";

const DoctorDashboardPage: React.FC = () => {
    // Get appointment by date
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const appointments = api.appointment.getDoctorAppointments.useQuery({
        day: currentDate,
    });
    const setNotes = api.appointment.updateNotes.useMutation();

    // Selected appointment
    const Appointment = appointments.data?.at(0);
    const [appointmentSelected, setAppointmentSelected] =
        useState<typeof Appointment>(undefined);

    // Date helpers
    const goToPreviousDay = () => {
        setCurrentDate(addDays(currentDate, -1));
    };
    const goToNextDay = () => {
        setCurrentDate(addDays(currentDate, 1));
    };

    const updateValues = async () => {
        await setNotes.mutateAsync({
            diagnoses: appointmentSelected?.diagnoses ?? "",
            notes: appointmentSelected?.notes ?? "",
            userID: appointmentSelected?.patientId as string,
            day: appointmentSelected?.appointmentDate as Date,
        });
    };

    return (
        <div className="flex">
            {!appointmentSelected && (
                <div className="flex-grow p-4">
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                        <button
                            onClick={goToPreviousDay}
                            className="px-4 py-2 text-xl"
                        >
                            &larr;
                        </button>
                        <h2 className="text-lg font-semibold">
                            {format(currentDate, "eeee, MMMM do yyyy")}
                        </h2>
                        <button
                            onClick={goToNextDay}
                            className="px-4 py-2 text-xl"
                        >
                            &rarr;
                        </button>
                    </div>
                    <div className="p-4">
                        {appointments.isLoading && <p>Loading...</p>}

                        {appointments.isSuccess &&
                            appointments.data.length > 0 &&
                            appointments.data.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="my-2 flex flex-col rounded-lg bg-gray-100 p-2 hover:cursor-pointer"
                                    onClick={() =>
                                        setAppointmentSelected(appointment)
                                    }
                                >
                                    <span className="font-bolg text-lg">
                                        {appointment.appointmentDate.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Patient Name: {appointment.patientName}
                                    </span>

                                    <span className="text-sm text-gray-600">
                                        Patient ID: {appointment.patientId}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Problem: {appointment.details}
                                    </span>
                                </div>
                            ))}
                        {appointments.isSuccess &&
                            appointments.data.length == 0 && (
                                <div className="text-center text-gray-500">
                                    No appointments for this day.
                                </div>
                            )}
                    </div>
                </div>
            )}
            {appointmentSelected && (
                <div className="flex flex-grow gap-4 p-4">
                    <div className="flex flex-col gap-2">
                        <p>Notes:</p>
                        <textarea
                            value={appointmentSelected.notes ?? ""}
                            onChange={(e) =>
                                setAppointmentSelected({
                                    ...appointmentSelected,
                                    notes: e.target.value,
                                })
                            }
                        ></textarea>
                        <p>Diagnosis:</p>
                        <textarea
                            value={appointmentSelected.diagnoses ?? ""}
                            onChange={(e) =>
                                setAppointmentSelected({
                                    ...appointmentSelected,
                                    diagnoses: e.target.value,
                                })
                            }
                        ></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={updateValues}>update values</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboardPage;
