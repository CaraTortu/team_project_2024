"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const Sidebar: React.FC = () => {
    const pathNames = usePathname().split("/");
    const pathName = pathNames[pathNames.length - 1];

    return (
        <aside className="sidebar">
            <div className="logo-container">
                {/* Logo or image can go here */}
            </div>
            <nav className="navigation">
                <ul>
                    <li>
                        <Link
                            href="/dashboard/my-info"
                            className={pathName == "my-info" ? "active" : ""}
                        >
                            My Info
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/upcoming"
                            className={pathName == "upcoming" ? "active" : ""}
                        >
                            Upcoming Appointments
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/book-appointment"
                            className={
                                pathName == "book-appointment" ? "active" : ""
                            }
                        >
                            Book an Appointment
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/billing"
                            className={pathName == "billing" ? "active" : ""}
                        >
                            Billing & Payments
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/support"
                            className={pathName == "support" ? "active" : ""}
                        >
                            Help/Support
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/"
                            onClick={() =>
                                signOut({ redirect: true, callbackUrl: "/" })
                            }
                        >
                            Sign Out
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export { Sidebar };
