"use client";
import React, { useState } from "react";
import { type Session } from "next-auth";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { api } from "~/trpc/react";

export interface AppointmentProps {
    session?: Session | null;
}

const MakeAppointment: React.FC<AppointmentProps> = ({ session: _ }) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    let availableAppointments = null;

    if (date) availableAppointments = api.appointment.getAvailableAppointments.useQuery({ day: date })
    console.log(availableAppointments?.data?.data)

    return (
        <div className="flex flex-col items-center gap-2">
            <Calendar
                mode="single"
                required
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
            />
            <Button variant="outline">Book appointment</Button>
        </div>
    );
};

export { MakeAppointment };
