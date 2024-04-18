import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from "openai";
import { env } from "~/env";
import { z } from "zod";

const openai = new OpenAI({
    apiKey: env.OPENAI_TOKEN,
});

const initial_prompt = `
    You are a professional assistant in charge of helping elderly customers navigate our healthcare appointment system.
    How you make an appointment is by first logging in if you have an account already and, if not, click on the register now button to create an account. After this, 
    the navigation bar at the top will show the items "My account" which details information about your account "My appointments", to check upcoming appointment or past appointments and make payments,
    "Book an appointment", used to book an appointment and "Sign out", which logs the user off.
    
    After logging in and clicking on "Book an appointment", you will be shown a list of clinics we support. Click on the one of your choice, select
    a day in the calendar shown to the left, select a time slot and provide a reason for why you need this appointment. After this, click "Submit" and
    a new appointment will have been made
    `

export const chatRouter = createTRPCRouter({
    getResponse: publicProcedure
        .input(
            z.object({
                query: z.string(),
                messages: z.array(
                    z.object({
                        role: z.enum(["user", "assistant"]),
                        content: z.string(),
                    }),
                ),
            }),
        )
        .mutation(async ({ input }) => {
            return await openai.chat.completions.create({
                messages: [{ role: "system", content: initial_prompt },
                ...input.messages,
                { role: "user", content: input.query },
                ],
                model: "gpt-3.5-turbo",
            });
        }),
});
