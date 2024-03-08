import { getServerSession } from "next-auth";
import { Upcoming } from "~/app/_components/upcoming";

export default async function UpcomingPage() {
    const session = await getServerSession()

    return (
        <>
            <Upcoming session={session!} />
        </>
    );
}
