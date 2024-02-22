"use client";
import { unstable_noStore as noStore } from "next/cache";
import { api } from "~/trpc/react";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function Home() {
    noStore();

    const register_api = api.user.registerUser.useMutation();

    const [formState, setFormState] = useState({
        name: "",
        password: "",
        email: "",
    });

    const register = async () => {
        if (
            formState.name === "" ||
            formState.email === "" ||
            formState.password === ""
        ) {
            toast.error("Please fill in all fields");
        }

        const status = await register_api.mutateAsync(formState);

        if (!status.success) {
            toast.error(status.reason!);
        } else {
            toast.success("Account created!");
        }
    };

    return (
        <main className="from-gp-900 to-gp-600 flex min-h-screen flex-col items-center justify-center bg-gradient-to-b text-white">
            <form
                action={register}
                className="flex w-[90%] flex-col items-center gap-2 rounded-lg bg-white/80 p-4 text-gray-900 md:w-[60%] lg:w-[35%]"
            >
                <h1 className="mb-3 text-2xl font-light">Create Account</h1>
                <div className="items-left flex w-[70%] flex-col">
                    <p className="text-md font-bold text-gray-600">
                        Full Name:
                    </p>
                    <input
                        className="w-full rounded-lg px-4 py-1 text-center text-black shadow-black outline-none duration-200 focus:py-[0.35rem] focus:shadow-lg"
                        placeholder="John Doe"
                        type="text"
                        onKeyUp={(e) =>
                            setFormState({
                                ...formState,
                                name: e.currentTarget.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="items-left flex w-[70%] flex-col">
                    <p className="text-md font-bold text-gray-600">Email:</p>
                    <input
                        className="w-full rounded-lg px-4 py-1 text-center text-black shadow-black outline-none duration-200 focus:py-[0.35rem] focus:shadow-lg"
                        placeholder="john.doe@example.com"
                        type="email"
                        onKeyUp={(e) =>
                            setFormState({
                                ...formState,
                                email: e.currentTarget.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="items-left flex w-[70%] flex-col">
                    <p className="text-md font-bold text-gray-600">Password:</p>
                    <input
                        className="w-full rounded-lg px-4 py-1 text-center text-black shadow-black outline-none duration-200 focus:py-[0.35rem] focus:shadow-lg"
                        placeholder="MyS3cur3Pa55w0rd!"
                        type="password"
                        onKeyUp={(e) =>
                            setFormState({
                                ...formState,
                                password: e.currentTarget.value,
                            })
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-gp-500 hover:bg-gp-600 mt-6 rounded-xl px-2 py-1 text-white duration-300 hover:px-4"
                >
                    Register
                </button>
            </form>
        </main>
    );
}
