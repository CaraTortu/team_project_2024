import React from "react";
import { TopBar } from "~/app/_components/ui/topbar";

export default function mainPage() {
    return (
        <div>
            <TopBar />
            <div className="greeting-message">
                Welcome to the GP Appointment System!
            </div>
            {/* Additional content of the main page goes here */}
        </div>
    );
}
