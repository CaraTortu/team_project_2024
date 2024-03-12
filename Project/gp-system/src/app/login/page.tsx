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
            toast.error("Password cannot be empty and must contain a minimum of 8 characters.");
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
        router.push("/dashboard");
    };

    return (
        <div className="h-screen w-full flex justify-center items-center text-white bg-gray-950">
            <form onSubmit={handleLogin} className="flex flex-col items-center justify-center gap-2 bg-gray-900 p-6 rounded-lg w-1/3">
                <p className="text-2xl font-bold mb-2">Login</p>
                <div className="flex flex-col gap-2 w-full items-center">
                    <p className="w-[90%] text-start">Email:</p>
                    <input
                        type="email"
                        id="username"
                        name="username"
                        className="w-[90%] px-3 py-1 rounded-md text-black"
                        placeholder="john.doe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full items-center">
                    <p className="w-[90%] text-start">Password:</p>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-[90%] px-3 py-1 rounded-md text-black"
                        placeholder="P@ssw0rd1!"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-800 rounded-md duration-300 text-md hover:bg-blue-600 flex items-center gap-2">
                    <CiLogin className="h-6 w-6" />
                    Login
                </button>
                <div className="flex gap-2 mt-4">
                    <p>Don't have an account?</p>
                    <Link href="/register" className="text-blue-600 hover:text-blue-500 duration-300">Register here</Link>
                </div>
            </form>
        </div>
    );
}
