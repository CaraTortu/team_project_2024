"use client";
import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { api } from "~/trpc/react";

const DoctorDashboardPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const appointments = api.appointment.getDoctorAppointments.useQuery({
        day: currentDate,
    });

    const goToPreviousDay = () => {
        setCurrentDate((prevDate) => addDays(prevDate, -1));
    };

    const goToNextDay = () => {
        setCurrentDate((prevDate) => addDays(prevDate, 1));
    };

    return (
        <div className="flex">
            <div className="flex-grow p-4 ">
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
                    <button onClick={goToNextDay} className="px-4 py-2 text-xl">
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
                                onClick={() => console.log("return details")}
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
        </div>
    );
};

export default DoctorDashboardPage;
