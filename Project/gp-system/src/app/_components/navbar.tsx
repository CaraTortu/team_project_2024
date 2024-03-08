"use client";
import React from "react";
import { type Session } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export interface AppointmentProps {
    session?: Session | null;
}

const NavBar: React.FC<AppointmentProps> = ({ session }) => {
    const router = useRouter();

    return (
        <>
            <div className="mr-4 mt-2 flex w-full flex-row justify-end gap-2">
                <Button
                    onClick={() =>
                        router.push(session ? "/api/auth/signout" : "/login")
                    }
                    variant="outline"
                >
                    {session ? "Sign out" : "Sign in"}
                </Button>

                {!session && (
                    <Button
                        onClick={() => router.push("/register")}
                        variant="secondary"
                    >
                        Create account
                    </Button>
                )}
            </div>
            <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
            </p>
        </>
    );
};

export { NavBar };
