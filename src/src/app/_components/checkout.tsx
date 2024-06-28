"use client";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { env } from "~/env";

function Checkout({ clientSecret }: { clientSecret: string }) {
    const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PK);

    return (
        <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    );
}

export { Checkout };
