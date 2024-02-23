import { unstable_noStore as noStore } from "next/cache";
import { getServerAuthSession } from "~/server/auth";
import { MakeAppointment } from "~/app/_components/makeappointment";
import { NavBar } from "~/app/_components/navbar";

export default async function Home() {
    noStore();
    const session = await getServerAuthSession();

    return (
        <main className="from-gp-900 to-gp-600 flex min-h-screen flex-col bg-gradient-to-b text-white">
            <div className="flex flex-col items-center justify-center gap-4">
                <NavBar session={session} />
                {session && <MakeAppointment session={session} />}
            </div>
        </main>
    );
}
