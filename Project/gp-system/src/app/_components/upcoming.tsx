"use client";
import React from "react";
import { Session } from "next-auth";
import { api } from "~/trpc/react";

interface UpcomingProps {
    session: Session;
}

const Upcoming: React.FC<UpcomingProps> = ({ session }) => {
    const appointments = api.appointment.getAppointments.useQuery();

    return (
        <section className="upcoming-appointments">
            <h2>Upcoming</h2>
            {appointments.data &&
                appointments.data.map((appointment) => (
                    <div
                        className="appointment-item"
                        key={appointment.appointmentDate.toISOString()}
                    >
                        <span className="appointment-date">
                            {appointment.appointmentDate.toDateString()}
                        </span>
                        <span className="appointment-name">
                            {appointment.doctorName}
                        </span>
                    </div>
                ))}
        </section>
    );
};

export { Upcoming };
