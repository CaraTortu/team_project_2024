"use client";
import React from "react";
import Link from "next/link";
import { CiLogin } from "react-icons/ci";

const TopBar: React.FC = () => {
    return (
        <div className="w-full h-16 flex items-center px-4 bg-gray-800 text-white">
            <p className="font-bold font-serif text-2xl">GP System</p>
            <div className="flex flex-grow justify-end">
                <Link href="/login" className="bg-gray-700 px-3 py-2 rounded-md shadow-lg hover:bg-gray-900 duration-300 flex items-center gap-2">
                    <CiLogin className="h-6 w-6" />
                    <p>Login/Register</p>
                </Link>
            </div>
        </div>
    );
};

export { TopBar };
