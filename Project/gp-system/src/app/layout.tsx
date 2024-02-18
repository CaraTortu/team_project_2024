import "~/styles/globals.css";

import { Roboto } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-sans",
});

export const metadata = {
    title: "GP System",
    description: "GP system",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`font-sans ${roboto.variable}`}>
                <TRPCReactProvider>{children}</TRPCReactProvider>
            </body>
        </html>
    );
}
