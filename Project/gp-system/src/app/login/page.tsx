"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CiLogin } from "react-icons/ci";

export default function SignupPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!z.string().email().safeParse(email).success) {
            toast.error("Invalid email address.");
            return;
        }

        if (!z.string().min(8).safeParse(password).success) {
            toast.error(
                "Password cannot be empty and must contain a minimum of 8 characters.",
            );
            return;
        }

        const status = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        switch (status?.error) {
            case null:
            case undefined:
                break;
            case "CredentialsSignin":
                toast.error("Invalid email or password");
                return;
            default:
                toast.error("Unknown error. Please try again later.");
                return;
        }

        toast.success("Success! Redirecting you...");
        await new Promise((resolve) => setTimeout(resolve, 200));
        router.push("/dashboard/upcoming");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <CiLogin className="h-6 w-6" />
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="mt-2 flex justify-center gap-2 text-sm text-gray-600">
                        Don't have an account?
                        <Link
                            href="/register"
                            className="font-medium text-indigo-600 duration-300 hover:text-indigo-500"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
