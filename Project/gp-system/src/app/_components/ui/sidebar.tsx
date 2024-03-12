"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { MdPayment, MdOutlineUpcoming } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { PiSignOut } from "react-icons/pi";

const Sidebar: React.FC = () => {
    const pathNames = usePathname().split("/");
    const pathName = pathNames[pathNames.length - 1];

    const unactive_class =
        "block py-2 px-4 hover:bg-blue-700 duration-300 flex gap-2 items-center";
    const active_class = unactive_class.replace(
        "hover:bg-blue-700",
        "bg-blue-700",
    );

    return (
        <div className="fixed left-0 top-0 z-10 flex h-full w-64 flex-col overflow-auto bg-blue-800 text-white">
            <div className="flex h-full w-64 flex-col items-center bg-blue-800 text-white">
                <div className="px-4 py-6">
                    <img
                        src="/logo.png"
                        alt="GP Appointment System Logo"
                        className="h-32 w-32 rounded-full"
                    />
                </div>
                <nav className="w-full flex-grow">
                    <ul>
                        <li>
                            <Link
                                href="/dashboard/my-info"
                                className={
                                    pathName == "my-info"
                                        ? active_class
                                        : unactive_class
                                }
                            >
                                <CgProfile className="h-6 w-6" />
                                My Info
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/upcoming"
                                className={
                                    pathName == "upcoming"
                                        ? active_class
                                        : unactive_class
                                }
                            >
                                <MdOutlineUpcoming className="h-6 w-6" />
                                Upcoming Appointments
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/book-appointment"
                                className={
                                    pathName == "book-appointment"
                                        ? active_class
                                        : unactive_class
                                }
                            >
                                <TbReportMedical className="h-6 w-6" />
                                Book an Appointment
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/billing"
                                className={
                                    pathName == "billing"
                                        ? active_class
                                        : unactive_class
                                }
                            >
                                <MdPayment className="h-6 w-6" />
                                Billing & Payments
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/dashboard/support"
                                className={
                                    pathName == "support"
                                        ? active_class
                                        : unactive_class
                                }
                            >
                                <IoIosHelpCircleOutline className="h-6 w-6" />
                                Help/Support
                            </Link>
                        </li>
                    </ul>
                </nav>
                <Link
                    href="/"
                    className="mb-2 flex justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 duration-300 hover:bg-blue-700"
                    onClick={() =>
                        signOut({
                            redirect: true,
                            callbackUrl: "/",
                        })
                    }
                >
                    <PiSignOut className="h-6 w-6" />
                    Sign Out
                </Link>
            </div>
        </div>
    );
};

export { Sidebar };
