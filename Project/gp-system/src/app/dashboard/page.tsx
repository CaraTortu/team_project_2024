import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function DashboardPage() {
    const session = await getServerAuthSession();

    if (session?.user?.userType == "user") {
        redirect("/dashboard/upcoming");
    }

    if (session?.user?.userType == "doctor") {
        redirect("/dashboard/schedule");
    }

    redirect("/dashboard/stats");
}
