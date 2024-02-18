import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    content: ["./src/**/*.tsx"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
            },

            colors: {
                gp: {
                    900: "#03045e",
                    800: "#023e8a",
                    700: "#0077b6",
                    600: "#0096c7",
                    500: "#00b4d8",
                    400: "#48cae4",
                    300: "#90e0ef",
                    200: "#ade8f4",
                    100: "#caf0f8",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
