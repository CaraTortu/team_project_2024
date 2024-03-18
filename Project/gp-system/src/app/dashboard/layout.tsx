import React from "react";
import { Sidebar } from "~/app/_components/ui/sidebar";
import { getServerAuthSession } from "~/server/auth";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Sidebar session={await getServerAuthSession()} />
            <main className="ml-64">{children}</main>
        </div>
    );
}
