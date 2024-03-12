"use client";
import React from "react";
import Link from "next/link";
import { CiLogin } from "react-icons/ci";

const TopBar: React.FC = () => {
    return (
        <div className="flex h-16 w-full items-center bg-blue-600 px-4 text-white">
            <p className="font-serif text-2xl font-bold">GP System</p>
            <div className="flex flex-grow justify-end">
                <Link
                    href="/login"
                    className="flex items-center gap-2 rounded-md bg-blue-700 px-3 py-2 shadow-lg duration-300 hover:bg-blue-800"
                >
                    <CiLogin className="h-6 w-6" />
                    <p>Login/Register</p>
                </Link>
            </div>
        </div>
    );
};

export { TopBar };
