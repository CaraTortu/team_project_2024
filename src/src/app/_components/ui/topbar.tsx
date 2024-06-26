"use client";
import React from "react";
import Link from "next/link";
import { CiLogin } from "react-icons/ci";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";

const TopBar: React.FC<{ session: Session | null }> = ({ session }) => {
    return (
        <div className="fixed top-0 z-50 flex h-16 w-full items-center border-b border-blue-600 bg-blue-100 bg-opacity-60 px-4 text-white backdrop-blur">
            <img
                src="/logo.png"
                className="ml-4 h-12 w-12 rounded-full shadow-lg"
            ></img>
            <p className="ml-2 text-lg font-semibold text-black">
                ClinicsUnited
            </p>
            <div className="ml-8 flex h-full items-center font-bold text-white">
                {session && session.user?.userType == "doctor" && (
                    <div className="text-md flex gap-x-8 text-blue-400 text-opacity-80">
                        <Link
                            href="/dashboard/my-info"
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            My account
                        </Link>
                        <Link
                            href="/dashboard/schedule"
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            Schedule
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            Sign out
                        </button>
                    </div>
                )}

                {session && session.user?.userType == "user" && (
                    <div className="text-md flex gap-x-8 text-blue-400 text-opacity-80">
                        <Link
                            href="/dashboard/my-info"
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            My account
                        </Link>
                        <Link
                            href="/dashboard/upcoming"
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            My appointments
                        </Link>
                        <Link
                            href="/dashboard/book-appointment"
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            Book an appointment
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            Sign out
                        </button>
                    </div>
                )}
                {session && session.user?.userType == "admin" && (
                    <div className="text-md flex gap-x-8 text-blue-400 text-opacity-80">
                        <Link
                            href="/dashboard/my-info"
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            My account
                        </Link>
                        <Link
                            href="/dashboard/stats"
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            Finances
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="rounded-md bg-opacity-75 px-2 py-1 shadow-none duration-300 hover:bg-blue-400 hover:text-white hover:shadow-lg"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
            <div className="flex flex-grow justify-end">
                {!session && (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 rounded-md bg-blue-700 px-3 py-2 shadow-lg duration-300 hover:bg-blue-800"
                    >
                        <CiLogin className="h-6 w-6" />
                        <p>Login/Register</p>
                    </Link>
                )}
                {session?.user && (
                    <div className="mr-4 flex items-center gap-2 font-sans text-black">
                        Welcome
                        <span className="text-lg font-bold">
                            {session.user.name}
                        </span>
                        !
                    </div>
                )}
            </div>
        </div>
    );
};

export { TopBar };
