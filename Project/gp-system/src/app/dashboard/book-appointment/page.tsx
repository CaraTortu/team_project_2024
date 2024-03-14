"use client";
import React, { useState } from "react";
import { format, addDays, isBefore, isToday } from "date-fns";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

export default function BookAppointmentPage() {
    const clinic_selected = 2;

    const [selectedDate, setSelectedDate] = useState<Date>(
        new Date(),
    );

    const available_appointments =
        api.appointment.getAvailableAppointments.useQuery({
            day: selectedDate,
            clinic_id: clinic_selected,
        });
    
    const weekDays: Date[] = [];
    
    for (let i = 0; i < 7; i++) {
        weekDays.push(addDays(selectedDate, i-3));
    }

    const [selectedSlotId, setSelectedSlotId] = useState<{
        time: Date;
        doctor_id: string;
    } | null>(null);

    const make_booking = api.appointment.createAppointment.useMutation();

    // Navigation functions for week
    const goToPreviousWeek = () => {
        const days_previous = addDays(selectedDate, -7)
        setSelectedDate(days_previous < new Date() ? new Date() : days_previous);
    };

    const goToNextWeek = () => {
        setSelectedDate(addDays(selectedDate, 7));
    };

    // Function to confirm the booking
    const confirmBooking = () => {
        if (!selectedSlotId || !selectedDate) return;

        make_booking.mutate({
            doctorId: selectedSlotId.doctor_id,
            appointmentDate: selectedSlotId.time,
        });

        if (!make_booking.data?.success && make_booking.data?.reason) {
            toast.error(make_booking.data.reason);
            return;
        }

        // Here you would also typically send a confirmation to the backend.
        toast.success("Appointment booked successfully!");

        // Clear the selected slot and provide any further confirmation needed.
        setSelectedSlotId(null);
    };

    return (
        <div className="ml-64 flex-grow p-4">
            <h1 className="mb-4 text-xl font-bold">Book an Appointment</h1>
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={goToPreviousWeek}
                    className='rounded-lg px-4 py-2 bg-blue-200 hover:blue-300 disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:text-white'
                    disabled={addDays(selectedDate, -3) < new Date()} 
                >
                    Previous week
                </button>
                {weekDays.map((day) => (
                    <button
                        key={day.getTime()}
                        disabled={isBefore(day, new Date()) && !isToday(day)}
                        onClick={() => setSelectedDate(day)}
                        className={`mx-1 px-4 py-2 ${
                            isBefore(day, new Date()) && !isToday(day)
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
                <button
                    onClick={goToNextWeek}
                    className="rounded-lg bg-blue-200 px-4 py-2 hover:bg-blue-300"
                >
                    Next week
                </button>
            </div>
            <div className="flex gap-4">
                {available_appointments.status == "success" &&
                    available_appointments.data.data!.map((doctor) => (
                        <div className="flex flex-col gap-4">
                            {doctor.available_appointments.map((slot) => {
                                const slotClassName = getSlotClassName(slot);

                                function getSlotClassName(slot: Date): string {
                                    if (
                                        slot == selectedSlotId?.time &&
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
                                        key={slot.getTime().toString()}
                                        className={`flex gap-2 rounded-lg border p-2 text-left ${slotClassName}`}
                                        onClick={() =>
                                            setSelectedSlotId({
                                                time: slot,
                                                doctor_id: doctor.doctor_id,
                                            })
                                        }
                                    >
                                        {format(slot, "dd/MM/yyyy hh:mm")} -
                                        {doctor.doctor_name}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
            </div>
            {selectedSlotId && (
                <button
                    onClick={confirmBooking}
                    className="fixed bottom-0 left-1/2 mb-4 -translate-x-1/2 transform rounded-md bg-blue-500 px-6 py-2 text-white"
                    style={{ zIndex: 1000 }}
                >
                    Select This Appointment
                </button>
            )}
        </div>
    );
}
