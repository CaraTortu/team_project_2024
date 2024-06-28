import { getServerAuthSession } from "~/server/auth";
import { MainPage } from "./_components/mainsite";

export default async function Main() {
    const session = await getServerAuthSession();

    return <MainPage session={session} />;
}
