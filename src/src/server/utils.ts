import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const randomString = (length: number) => {
    const dic =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let ran = "";
    for (let i = 0; i < length; i++) {
        ran += dic[Math.floor(Math.random() * dic.length)];
    }

    return ran;
};
