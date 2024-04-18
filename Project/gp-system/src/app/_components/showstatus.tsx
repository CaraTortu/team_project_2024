"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export function ShowStatus({ params }: { params: { checkoutid: string[] } }) {
    const status = api.payment.getCheckoutStatus.useQuery({
        checkoutId: params.checkoutid[1] ?? "",
    });

    const router = useRouter();

    return (
        <div className="flex flex-grow items-center justify-center px-4">
            <div className="z-10 w-full max-w-md space-y-8 rounded-xl border border-blue-200 p-10 shadow-lg">
                <div className="mb-4 text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Appointment Payment
                    </h2>
                </div>
                {status.isLoading && <div>Loading...</div>}
                {status.isSuccess &&
                    (status.data.success ? (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Success Icon */}
                                    <svg
                                        className="h-5 w-5 text-green-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        {/* \/ */}
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 00-1.414 0L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l6-6a1 1 0 000-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Your payment for the GP appointment was
                                        successful.
                                    </p>
                                    <p className="mt-2 text-sm text-green-700">
                                        A receipt has been sent to your email.
                                        Please check your inbox.
                                    </p>
                                    {status.data.appointment && (
                                        <ul className="mt-4 list-inside list-disc text-sm text-green-700">
                                            <ul>
                                                Booking ID:{" "}
                                                {status.data.appointment.id}
                                            </ul>
                                            <ul>
                                                Date:{" "}
                                                {status.data.appointment.appointmentDate.toISOString()}
                                            </ul>
                                            <ul>
                                                Doctor Name:{" "}
                                                {status.data.appointment
                                                    .doctorName ?? ""}
                                            </ul>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Error Icon */}
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        {/* (X) */}
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10c0 3.866-3.582 7-8 7-4.418 0-8-3.134-8-7s3.582-7 8-7c4.418 0 8 3.134 8 7zM4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="rounded-md bg-red-50 p-4">
                                    <h1 className="mb-4 text-2xl font-bold text-red-500">
                                        Payment Failed
                                    </h1>
                                    <p>
                                        There was a problem processing your
                                        payment for the GP appointment.
                                    </p>
                                    <p>
                                        Please attempt the payment again, or
                                        <button
                                            onClick={() =>
                                                router.push("/support")
                                            } // Redirect to support page
                                            className="ml-1 inline text-blue-600 hover:text-blue-800"
                                        >
                                            contact support
                                        </button>
                                        for further assistance.
                                    </p>
                                    <div className="mt-4">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    "/dashboard/upcoming",
                                                )
                                            }
                                            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                <div className="mt-6">
                    <button
                        onClick={() => router.push("/dashboard/upcoming")}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Back to Appointments
                    </button>
                </div>
            </div>
        </div>
    );
}
