import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { TopBar } from "../_components/ui/topbar";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <TopBar session={await getServerAuthSession()} />
            <main className="flex h-full min-h-screen flex-col pt-20">
                {children}
            </main>
        </div>
    );
}
