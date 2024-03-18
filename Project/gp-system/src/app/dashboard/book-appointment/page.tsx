"use client";
import React, { useState } from "react";
import { format, addDays, isBefore, isToday } from "date-fns";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

export default function BookAppointmentPage() {
    const clinic_selected = 3;

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    let availableAppointments =
        api.appointment.getAvailableAppointments.useQuery({
            day: selectedDate,
            clinic_id: clinic_selected,
        }).data;

    const weekDays: Date[] = [];

    for (let i = 0; i < 7; i++) {
        weekDays.push(addDays(selectedDate, i - 3));
    }

    const [selectedSlotId, setSelectedSlotId] = useState<{
        time: Date;
        doctor_id: string;
    } | null>(null);

    const make_booking = api.appointment.createAppointment.useMutation();

    // Navigation functions for week
    const goToPreviousWeek = () => {
        setSelectedDate(
            addDays(selectedDate, -7) < new Date()
                ? new Date()
                : addDays(selectedDate, -7),
        );
    };

    const goToNextWeek = () => {
        setSelectedDate(addDays(selectedDate, 7));
    };

    // Function to confirm the booking
    const confirmBooking = async () => {
        if (!selectedSlotId || !selectedDate || !availableAppointments) return;

        const res = await make_booking.mutateAsync({
            doctorId: selectedSlotId.doctor_id,
            appointmentDate: selectedSlotId.time,
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
        <div className="flex h-[100vh] flex-grow flex-col p-4">
            <h1 className="mb-4 text-xl font-bold">Book an Appointment</h1>
            <div className="mb-4 flex items-center justify-between gap-2">
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
                        onClick={() => setSelectedDate(day)}
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
            <div className="flex justify-center gap-6">
                {availableAppointments?.data?.length == 0 && (
                    <p className="mt-24 w-full text-center text-3xl">
                        No appointments available for this day!
                    </p>
                )}
                {availableAppointments?.data?.map((doctor) => (
                    <div key={doctor.doctor_id} className="flex flex-col gap-2">
                        {doctor.available_appointments.map((slot) => {
                            const slotClassName = getSlotClassName(slot);

                            function getSlotClassName(slot: {
                                time: Date;
                                free: boolean;
                            }): string {
                                if (!slot.free) {
                                    return "disabled:bg-red-300 cursor-not-allowed";
                                }

                                if (
                                    slot.time == selectedSlotId?.time &&
                                    doctor.doctor_id ==
                                        selectedSlotId?.doctor_id
                                ) {
                                    return "bg-blue-300";
                                } else {
                                    return "bg-green-200 hover:bg-green-300";
                                }
                            }

                            return (
                                <button
                                    key={slot.time.getTime().toString()}
                                    className={`flex gap-2 rounded-lg border p-2 text-left duration-300 ${slotClassName}`}
                                    onClick={() =>
                                        setSelectedSlotId({
                                            time: slot.time,
                                            doctor_id: doctor.doctor_id,
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
            </div>
            <div className="flex w-full flex-grow items-end justify-center">
                {selectedSlotId && (
                    <button
                        onClick={confirmBooking}
                        className="mt-4 rounded-md bg-blue-500 px-6 py-2 text-white"
                        style={{ zIndex: 1000 }}
                    >
                        Select This Appointment
                    </button>
                )}
            </div>
        </div>
    );
}
