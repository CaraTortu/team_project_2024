import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
    noStore();
    const session = await getServerAuthSession();

    if (session) console.log(await api.appointment.getAppointments.query());
    if (session)
        console.log(
            await api.appointment.createAppointment.mutate({
                appointmentDate: new Date(),
            }),
        );

    return (
        <main className="flex min-h-screen flex-col bg-gradient-to-b from-gp-900 to-gp-600 text-white">
            <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-center text-2xl text-white">
                    {session && <span>Logged in as {session.user?.name}</span>}
                </p>
                <Link
                    href={session ? "/api/auth/signout" : "/api/auth/signin"}
                    className="rounded-full bg-white/10 px-10 py-3 font-bold no-underline transition hover:bg-white/20"
                >
                    {session ? "Sign out" : "Sign in"}
                </Link>

                <Link
                    href="/register"
                    className="rounded-full bg-white/10 px-10 py-3 font-bold no-underline transition hover:bg-white/20"
                >
                    Create account
                </Link>
            </div>
        </main>
    );
}
