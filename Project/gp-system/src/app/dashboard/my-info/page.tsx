import { MyInfoPage } from "~/app/_components/myinfo";
import { getServerAuthSession } from "~/server/auth";

const Doctor = async () => {
    const session = await getServerAuthSession();

    return (
        <>
            <MyInfoPage session={session!} />
        </>
    );
};

export default Doctor;
