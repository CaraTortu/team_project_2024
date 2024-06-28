import { subDays } from "date-fns";
import React, { type Dispatch, type SetStateAction } from "react";

import { type DayOfWeek, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export const Calendar = ({
    takenDays,
    selectedDay,
    setSelectedDay,
}: {
    takenDays: (Date | { from: Date; to: Date } | DayOfWeek)[];
    selectedDay: Date | undefined;
    setSelectedDay: Dispatch<SetStateAction<Date | undefined>>;
}) => {
    return (
        <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            disabled={[
                ...takenDays,
                {
                    from: new Date(0),
                    to: subDays(new Date(), 1),
                },
                { dayOfWeek: [0, 6] },
            ]}
            showOutsideDays={true}
            weekStartsOn={1}
            required
        />
    );
};
