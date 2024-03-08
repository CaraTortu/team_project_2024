"use client";
import React from "react";
import { signOut } from "next-auth/react";
import "~/styles/temp.css";
import { Session } from "next-auth";
import { api } from "~/trpc/react";

interface UpcomingProps {
    session: Session;
}

const Upcoming: React.FC<UpcomingProps> = ({ session }) => {
    const appointments = api.appointment.getAppointments.useQuery()
        
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
                    <div className="appointment-item">
                        <span className="appointment-date">
                            24/02/2024, 10:30 AM
                        </span>
                        <span className="appointment-name">Blood Test</span>
                    </div>
                    <div className="appointment-item">
                        <span className="appointment-date">
                            18/02/2024, 3:15 PM
                        </span>
                        <span className="appointment-name">Breast X-ray</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export { Upcoming };
