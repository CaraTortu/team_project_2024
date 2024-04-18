"use client";
import React, { Suspense, useState } from "react";
import { format, addDays, isBefore, isToday } from "date-fns";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const ClinicSelector = dynamic(
    () => import("~/app/_components/clinicselector"),
    { ssr: false },
);

interface ClinicFormat {
    id: number;
    name: string;
    address: string;
}

const BookAppointment: React.FC<{
    clinicSelected: ClinicFormat;
    setClinic: React.Dispatch<React.SetStateAction<ClinicFormat | null>>;
}> = ({ clinicSelected, setClinic }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    let availableAppointments =
        api.appointment.getAvailableAppointments.useQuery({
            day: selectedDate,
            clinic_id: clinicSelected.id,
        }).data;

    const weekDays: Date[] = [];

    for (let i = 0; i < 7; i++) {
        weekDays.push(addDays(selectedDate, i - 3));
    }

    const [selectedSlotId, setSelectedSlotId] = useState<{
        time: Date;
        doctor_id: string;
        doctor_name: string;
    } | null>(null);

    const [visitReason, setVisitReason] = useState<string>("");

    const make_booking = api.appointment.createAppointment.useMutation();

    // Navigation functions for week
    const goToPreviousWeek = () => {
        setSelectedDate(
            addDays(selectedDate, -7) < new Date()
                ? new Date()
                : addDays(selectedDate, -7),
        );
        setSelectedSlotId(null);
    };

    const goToNextWeek = () => {
        setSelectedDate(addDays(selectedDate, 7));
        setSelectedSlotId(null);
    };

    // Function to confirm the booking
    const confirmBooking = async () => {
        if (!selectedSlotId || !selectedDate || !availableAppointments) return;

        if (!visitReason) {
            toast.error("You need to supply a reason for your visit");
            return;
        }

        const res = await make_booking.mutateAsync({
            doctorId: selectedSlotId.doctor_id,
            appointmentDate: selectedSlotId.time,
            details: visitReason,
        });

        if (!res.success && res.reason) {
            toast.error(res.reason);
            return;
        }

        // Here you would also typically send a confirmation to the backend.
        toast.success("Appointment booked successfully!");

        // Clear the selected slot and provide any further confirmation needed.
        setSelectedSlotId(null);

        availableAppointments = {
            success: availableAppointments.success,
            data: availableAppointments.data!.map((appointment) => {
                if (appointment.doctor_id == selectedSlotId.doctor_id) {
                    appointment.available_appointments =
                        appointment.available_appointments.map((item) => ({
                            ...item,
                            free:
                                item.time == selectedSlotId.time
                                    ? false
                                    : item.free,
                        }));
                }

                return appointment;
            }),
        };
    };

    return (
        <div className="flex flex-grow flex-col px-4">
            <div className="mb-8 flex items-center justify-between gap-2">
                <button
                    onClick={goToPreviousWeek}
                    className="px-4 py-2 text-xl disabled:opacity-0"
                    disabled={addDays(selectedDate, -3) <= new Date()}
                >
                    &larr;
                </button>
                {weekDays.map((day) => (
                    <button
                        key={day.getTime()}
                        disabled={
                            (isBefore(day, new Date()) && !isToday(day)) ||
                            [0, 6].includes(day.getDay())
                        }
                        onClick={() => {
                            setSelectedDate(day);
                            setSelectedSlotId(null);
                        }}
                        className={`rounded-lg px-4 py-2 duration-300 ${
                            (isBefore(day, new Date()) && !isToday(day)) ||
                            [0, 6].includes(day.getDay())
                                ? "cursor-not-allowed bg-gray-300"
                                : selectedDate.toDateString() ===
                                    day.toDateString()
                                  ? "bg-blue-500 text-white"
                                  : "bg-blue-200 hover:bg-blue-300"
                        }`}
                    >
                        {format(day, "EEE dd MMM")}
                    </button>
                ))}
                <button onClick={goToNextWeek} className="px-4 py-2 text-xl">
                    &rarr;
                </button>
            </div>
            <div className="flex flex-row justify-center gap-2 duration-300">
                {availableAppointments?.data?.length && (
                    <div className="flex items-center">
                        <button
                            onClick={() => setClinic(null)}
                            className="rounded-lg border-2 border-blue-400 bg-white px-2 py-1 text-blue-400 duration-300 hover:bg-blue-500 hover:text-white"
                        >
                            {"<- "}Select another clinic
                        </button>
                    </div>
                )}

                {availableAppointments?.data?.length == 0 && (
                    <p className="mt-24 w-full text-center text-3xl">
                        No appointments available for this day!
                    </p>
                )}
                {availableAppointments?.data?.map((doctor) => (
                    <div
                        key={doctor.doctor_id}
                        className="flex max-w-fit flex-grow flex-col gap-2"
                    >
                        {doctor.available_appointments.map((slot) => {
                            const slotClassName = getSlotClassName(slot);

                            function getSlotClassName(slot: {
                                time: Date;
                                free: boolean;
                            }): string {
                                if (!slot.free) {
                                    return "disabled:bg-red-200 cursor-not-allowed";
                                }

                                if (
                                    slot.time == selectedSlotId?.time &&
                                    doctor.doctor_id ==
                                        selectedSlotId?.doctor_id
                                ) {
                                    return "bg-blue-300";
                                } else {
                                    return "bg-green-400 bg-opacity-35 hover:bg-opacity-70";
                                }
                            }

                            return (
                                <button
                                    key={slot.time.getTime().toString()}
                                    className={`flex gap-2 rounded-lg border p-2 text-left text-sm duration-300 ${slotClassName}`}
                                    onClick={() =>
                                        setSelectedSlotId({
                                            time: slot.time,
                                            doctor_id: doctor.doctor_id,
                                            doctor_name:
                                                doctor.doctor_name ?? "",
                                        })
                                    }
                                    disabled={!slot.free}
                                >
                                    {format(slot.time, "hh:mm")}
                                    <p>-</p>
                                    {doctor.doctor_name}
                                </button>
                            );
                        })}
                    </div>
                ))}
                {selectedSlotId && (
                    <div className="flex flex-col justify-center gap-2 p-4 pl-12 text-black">
                        <p className="text-2xl font-bold">
                            Appointment information
                        </p>
                        <div className="text-md font-semibold text-gray-600">
                            <p>
                                <span className="font-bold text-gray-700">
                                    Clinic name
                                </span>
                                : {clinicSelected.name}
                            </p>
                            <p>
                                <span className="font-bold text-gray-700">
                                    Clinic address
                                </span>
                                : {clinicSelected.address}
                            </p>
                            <p>
                                <span className="font-bold text-gray-700">
                                    Doctor
                                </span>
                                : {selectedSlotId.doctor_name}
                            </p>
                            <p>
                                <span className="font-bold text-gray-700">
                                    Date
                                </span>
                                : {selectedSlotId.time.toUTCString()}
                            </p>
                        </div>
                        <div className="mt-12 flex flex-col gap-2">
                            <p className="font-semibold text-gray-800">
                                Reason for visit:
                            </p>
                            <textarea
                                className="text-md h-32 resize-none rounded-lg bg-blue-200 bg-opacity-50 px-3 py-2 shadow-xl placeholder:italic"
                                placeholder="Describe the issue here"
                                content={visitReason}
                                onChange={(e) => setVisitReason(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={confirmBooking}
                            className="mt-4 rounded-md bg-blue-500 px-6 py-2 text-white"
                            style={{ zIndex: 1000 }}
                        >
                            Select This Appointment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function BookPage() {
    const [clinic, setClinic] = useState<ClinicFormat | null>(null);

    return (
        <>
            {!clinic && (
                <Suspense fallback={<></>}>
                    <ClinicSelector setClinic={setClinic} />
                </Suspense>
            )}
            {clinic && (
                <BookAppointment
                    clinicSelected={clinic}
                    setClinic={setClinic}
                />
            )}
        </>
    );
}
