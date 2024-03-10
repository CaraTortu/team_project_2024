"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { api } from "~/trpc/react";

interface UpcomingProps {
    session: Session;
}

const Upcoming: React.FC<UpcomingProps> = ({ session }) => {
    const appointments = api.appointment.getAppointments.useQuery();

    console.log(appointments.data);

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="logo-container">
                    {/* Logo or image can go here */}
                </div>
                <nav className="navigation">
                    <ul>
                        <li>My Info</li>
                        <li className="active">Upcoming Appointments</li>
                        <li>Book an Appointment</li>
                        <li>Billing & Payments</li>
                        <li>Help/Support</li>
                        <li
                            onClick={() =>
                                signOut({ redirect: true, callbackUrl: "/" })
                            }
                        >
                            Sign Out
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
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
            </main>
        </div>
    );
};

export { Upcoming };
