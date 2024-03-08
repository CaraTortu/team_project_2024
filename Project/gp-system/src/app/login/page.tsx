"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import "~/styles/temp.css";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

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

        if (!z.string().min(1).safeParse(password).success) {
            toast.error("Password cannot be empty.");
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
        <div className="login-page">
            <form onSubmit={handleLogin} className="login-form">
                <label htmlFor="username">Email:</label>
                <input
                    type="email"
                    id="username"
                    name="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
            <div className="register-link">
                Don't have an account?{" "}
                <Link href="/register">Register here</Link>
            </div>
        </div>
    );
}
