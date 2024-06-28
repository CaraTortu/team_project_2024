import React from "react";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { Checkout } from "~/app/_components/checkout";
import { ShowStatus } from "~/app/_components/showstatus";

async function CreateCheckout({
    params,
}: {
    params: { checkoutid: string[] };
}) {
    const res = await api.payment.createCheckoutSession.mutate({
        appointmentId: params.checkoutid[0] ?? "",
    });

    if (!res.success || !res.clientSecret) {
        redirect("/dashboard/upcoming");
    }

    return <Checkout clientSecret={res.clientSecret} />;
}

export default async function Page({
    params,
}: {
    params: { checkoutid: string[] };
}) {
    if (params.checkoutid.length == 1) {
        return <CreateCheckout params={params} />;
    }

    return <ShowStatus params={params} />;
}
