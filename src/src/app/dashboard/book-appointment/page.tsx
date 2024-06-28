"use client";
import React, { Suspense, useState } from "react";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { Calendar } from "~/app/_components/calendar";

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
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    );
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");

    let availableAppointments =
        api.appointment.getAvailableAppointments.useQuery({
            day: selectedDate!,
            clinic_id: clinicSelected.id,
        }).data;

    const [selectedSlotId, setSelectedSlotId] = useState<{
        time: Date;
        doctor_id: string;
        doctor_name: string;
    } | null>(null);

    const [visitReason, setVisitReason] = useState<string>("");

    const make_booking = api.appointment.createAppointment.useMutation();

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

        toast.success("Appointment booked successfully!");

        setSelectedSlotId(null);

        availableAppointments = {
            success: availableAppointments.success,
            data: availableAppointments.data!.map((appointment) => {
                if (appointment.doctor_id != selectedSlotId.doctor_id)
                    return appointment;

                appointment.available_appointments =
                    appointment.available_appointments.map((item) => ({
                        ...item,
                        free: item.free
                            ? !(item.time == selectedSlotId.time)
                            : false,
                    }));
                return appointment;
            }),
        };
    };

    return (
        <div className="flex w-screen flex-grow flex-col items-center">
            <p className="text-2xl font-bold">
                Select an appointment for {clinicSelected.name}{" "}
                {selectedDoctor != "" ? "with Dr. " + selectedDoctor : ""}
            </p>
            <div className="relative w-[80%] flex-grow px-4 py-6">
                <div className="fixed bottom-0 top-14 z-40 m-auto flex aspect-square size-fit flex-col items-center justify-center rounded-xl border border-blue-600 bg-blue-200 py-2">
                    <Calendar
                        takenDays={[]}
                        selectedDay={selectedDate}
                        setSelectedDay={setSelectedDate}
                    />
                    <select
                        className="z-[41] mx-6 w-2/3 rounded-lg bg-white px-2 py-1"
                        onChange={(e) =>
                            setSelectedDoctor(e.currentTarget.value)
                        }
                        value={selectedDoctor}
                    >
                        <option value="" disabled>
                            Select a doctor
                        </option>
                        {availableAppointments?.data?.map((doctor) => (
                            <option value={doctor.doctor_name!}>
                                Dr. {doctor.doctor_name}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => setClinic(null)} className="mt-4 px-2 py-1 bg-blue-500 hover:bg-blue-400 duration-300 text-white rounded-xl">
                        Change Clinic
                    </button>
                </div>
                <div className="relative z-30 flex w-full gap-2 text-center duration-300">
                    {!availableAppointments?.data && (
                        <p className="w-full text-3xl">Loading...</p>
                    )}
                    {availableAppointments?.data?.length == 0 && (
                        <p className="w-full text-3xl">
                            No appointments available for this day!
                        </p>
                    )}
                    {availableAppointments?.data
                        ?.filter(
                            (doctor) => doctor.doctor_name == selectedDoctor,
                        )
                        .map((doctor) => (
                            <div
                                key={doctor.doctor_id}
                                className="flex w-full flex-col items-center gap-1"
                            >
                                {doctor.available_appointments.map((slot) => {
                                    const slotClassName =
                                        getSlotClassName(slot);

                                    function getSlotClassName(slot: {
                                        time: Date;
                                        free: boolean;
                                    }): string {
                                        if (!slot.free) {
                                            return "bg-red-200 cursor-not-allowed";
                                        }

                                        if (
                                            slot.time == selectedSlotId?.time &&
                                            doctor.doctor_id ==
                                            selectedSlotId?.doctor_id
                                        ) {
                                            return "bg-blue-300";
                                        }
                                        return "bg-green-400 bg-opacity-35 hover:bg-opacity-70";
                                    }

                                    return (
                                        <button
                                            key={slot.time.getTime().toString()}
                                            className={`flex w-[40%] justify-center gap-2 rounded-md border p-2 text-lg duration-300 ${slotClassName}`}
                                            onClick={() =>
                                                setSelectedSlotId({
                                                    time: slot.time,
                                                    doctor_id: doctor.doctor_id,
                                                    doctor_name:
                                                        doctor.doctor_name ??
                                                        "",
                                                })
                                            }
                                            disabled={!slot.free}
                                        >
                                            {format(slot.time, "HH:mm")}
                                            <p>-</p>
                                            {slot.free ? "Free" : "Taken"}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                </div>
                {selectedSlotId && (
                    <div className="fixed bottom-0 right-[10%] top-14 z-40 m-auto flex flex-col justify-center gap-2 p-4 text-black">
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
                                :{" "}
                                {format(
                                    selectedSlotId.time,
                                    "MMMM do yyyy HH:mm",
                                )}
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
