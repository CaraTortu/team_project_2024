import React from "react";
import { Sidebar } from "~/app/_components/ui/sidebar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">{children}</main>
        </div>
    );
}
