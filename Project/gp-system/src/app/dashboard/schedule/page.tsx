"use client";
import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

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

    const patientHistory = api.appointment.getPatientPastAppointments.useQuery({
        patientId: appointmentSelected?.patientId,
    });

    // Date helpers
    const goToPreviousDay = () => {
        setCurrentDate(addDays(currentDate, -1));
    };
    const goToNextDay = () => {
        setCurrentDate(addDays(currentDate, 1));
    };

    const updateValues = async () => {
        const result = await setNotes.mutateAsync({
            diagnoses: appointmentSelected?.diagnoses ?? "",
            notes: appointmentSelected?.notes ?? "",
            userID: appointmentSelected?.patientId!,
            day: appointmentSelected?.appointmentDate!,
        });

        if (result.success) {
            toast.success("Data saved successfully");
        } else {
            toast.error(result.reason ?? "Something went wrong");
        }
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
                                        Patient ID:{" "}
                                        {appointment.patientId!.length < 20
                                            ? appointment.patientId
                                            : appointment.patientId?.substring(
                                                  0,
                                                  20,
                                              ) + "..."}
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
                <div className="container mx-auto p-4">
                    <h1 className="mb-6 font-serif text-xl font-semibold text-gray-700">
                        Appointment Details{" "}
                        <span className="font-bold text-black">-</span>{" "}
                        {appointmentSelected.patientName}
                    </h1>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            appointments.refetch();
                            updateValues();
                        }}
                        className="mb-4"
                    >
                        <div className="mb-4">
                            <label
                                htmlFor="notes"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Notes:
                            </label>
                            <textarea
                                id="notes"
                                rows={5}
                                className="mt-1 block w-full resize-none rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm" // Increased padding here
                                value={appointmentSelected.notes ?? ""}
                                onChange={(e) =>
                                    setAppointmentSelected({
                                        ...appointmentSelected,
                                        notes: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="diagnosis"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Diagnosis:
                            </label>
                            <input
                                id="diagnosis"
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm sm:text-sm" // Increased padding here
                                value={appointmentSelected.diagnoses ?? ""}
                                onChange={(e) =>
                                    setAppointmentSelected({
                                        ...appointmentSelected,
                                        diagnoses: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                            >
                                Save Appointment Details
                            </button>
                            <button
                                onClick={() => {
                                    updateValues();
                                    appointments.refetch();
                                    setAppointmentSelected(undefined);
                                }}
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                            >
                                Go back
                            </button>
                        </div>
                    </form>

                    <div>
                        <h2 className="mb-4 text-xl font-semibold">
                            Past Appointment History
                        </h2>
                        {patientHistory &&
                        patientHistory.data &&
                        patientHistory.data.length > 0 ? (
                            patientHistory.data.map((entry) => (
                                <div
                                    key={entry.date.getTime()}
                                    className="mb-3 rounded-lg bg-gray-100 p-4"
                                >
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {entry.date.toDateString()}
                                    </p>
                                    <p>
                                        <strong>Notes:</strong> {entry.notes}
                                    </p>
                                    <p>
                                        <strong>Diagnosis:</strong>{" "}
                                        {entry.diagnoses}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No past appointments found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboardPage;
