"use client";
import React, { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ResgiterPage() {
    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const register = api.user.registerUser.useMutation();
    const router = useRouter();

    const handleRegistration = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if some field is empty
        const empty_check = (s: string) =>
            z.string().min(1).safeParse(s).success;
        const fields = [
            title,
            firstName,
            surname,
            email,
            password,
            confirmPassword,
        ];
        if (fields.map(empty_check).includes(false)) {
            toast.error("Please fill in all values.");
            return;
        }

        await register.mutateAsync({
            title,
            fname: firstName,
            lname: surname,
            email,
            password,
        });

        if (!register.data?.success && register.data?.reason) {
            toast.error(register.data?.reason);
            return;
        }

        toast.success("Success! User created. Redirecting you to login...");
        await new Promise((resolve) => setTimeout(resolve, 200));
        router.push("/login");
    };

    return (
        <div className="container">
            <div className="register-page">
                <h2>Register</h2>
                <form onSubmit={handleRegistration} className="register-form">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="first-name">First Name:</label>
                    <input
                        type="text"
                        id="first-name"
                        name="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label htmlFor="surname">Surname:</label>
                    <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Create Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="confirm-password">
                        Enter Password Again:
                    </label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
                <div className="login-link">
                    Already have an account?{" "}
                    <Link href="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
}
