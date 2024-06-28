"use client";

import { type Session } from "next-auth";
import React from "react";

const MyInfoPage: React.FC<{ session: Session }> = ({ session }) => {
    const userInfo = {
        fullName: session.user?.name,
        email: session.user?.email,
        employeeNumber: session.user?.id,
    };

    return (
        <div className="flex-1 p-10">
            <div className="container mx-auto rounded bg-white shadow">
                <div className="p-6">
                    {/* 's Basic Information */}
                    <section className="mb-6">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">
                            My Information
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1 rounded bg-gray-100 p-2">
                                {userInfo.fullName}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1 rounded bg-gray-100 p-2">
                                {userInfo.email}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                User ID
                            </label>
                            <div className="mt-1 overflow-hidden rounded bg-gray-100 p-2">
                                {userInfo.employeeNumber!.length < 20
                                    ? userInfo.employeeNumber
                                    : userInfo.employeeNumber?.substring(
                                          0,
                                          20,
                                      ) + "..."}
                            </div>
                        </div>
                        <div className="mb-4">
                            <button className="text-blue-600 hover:text-blue-700">
                                Change password
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export { MyInfoPage };
