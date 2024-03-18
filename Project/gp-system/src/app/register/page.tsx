"use client";
import React, { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const register = api.user.registerUser.useMutation();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Check if some field is empty
        const empty_check = (s: string) =>
            z.string().min(1).safeParse(s).success;

        if (Object.values(formData).map(empty_check).includes(false)) {
            toast.error("Please fill in all values.");
            return;
        }

        if (!z.string().email().safeParse(formData.email).success) {
            toast.error("Please supply a valid email address");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const res = await register.mutateAsync({
            title: formData.title,
            fname: formData.firstName,
            lname: formData.surname,
            email: formData.email,
            password: formData.password,
        });

        if (!res.success && res.reason) {
            toast.error(res.reason);
            return;
        }

        toast.success("Success! User created. Redirecting you to login...");
        await new Promise((resolve) => setTimeout(resolve, 200));
        router.push("/login");
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register your account
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="title" className="sr-only">
                                Title
                            </label>
                            <select
                                id="title"
                                name="title"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                value={formData.title}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Select your title
                                </option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="first-name" className="sr-only">
                                First Name
                            </label>
                            <input
                                id="first-name"
                                name="firstName"
                                type="text"
                                className="relative block w-full appearance-none rounded-none border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="surname" className="sr-only">
                                Surname
                            </label>
                            <input
                                id="surname"
                                name="surname"
                                type="text"
                                className="relative block w-full appearance-none rounded-none border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Surname"
                                value={formData.surname}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                className="relative block w-full appearance-none rounded-none border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Create password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="relative block w-full appearance-none rounded-none border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="sr-only"
                            >
                                Enter password again
                            </label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Enter password again"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Register
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="mt-2 text-sm text-gray-600">
                            Already registered?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Log in now!
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
