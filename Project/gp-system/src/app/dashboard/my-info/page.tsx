import { DoctorMyInfoPage } from "~/app/_components/myinfo";
import { getServerAuthSession } from "~/server/auth";

const Doctor = async () => {
    const session = await getServerAuthSession();

    return (
        <>
        <DoctorMyInfoPage session={session!} />
        </>
    )
};

export default Doctor;

