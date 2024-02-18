import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
    type DefaultUser,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { type DefaultJWT, type JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { z } from "zod";

import { env } from "~/env";
import { db } from "~/server/db";
import { createTable, users } from "~/server/db/schema";
import bcrypt from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        token?: JWT;
    }

    interface User extends DefaultUser {
        userType?: string;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        userType?: string;
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session: async ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
                userType: token.userType,
            },
        }),
        jwt: async ({ token }) => {
            if (!token.sub) {
                console.error(`ERROR: Token.sub does not exist.`);
                return {};
            }

            const query = await db.query.users.findFirst({
                columns: {
                    userType: true,
                },
                where: eq(users.id, token.sub),
            });

            token.userType = query?.userType;
            return token;
        },
    },
    adapter: DrizzleAdapter(db, createTable) as Adapter,
    providers: [
        DiscordProvider({
            id: "discord",
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
        Credentials({
            id: "credentials",
            name: "Username and Password",

            credentials: {
                email: {
                    label: "email",
                    type: "email",
                    placeholder: "john.doe@example.com",
                },
                password: { label: "Password", type: "pasword" },
            },

            authorize: async (credentials, _req) => {
                const parsedCreds = z
                    .object({ email: z.string().email(), password: z.string() })
                    .safeParse(credentials);

                if (!parsedCreds.success) {
                    return null;
                }

                const databaseCredentials = await db.query.users.findFirst({
                    where: eq(users.email, parsedCreds.data.email),
                });

                if (
                    !databaseCredentials?.password ||
                    !bcrypt.compareSync(
                        parsedCreds.data.password,
                        databaseCredentials.password,
                    )
                ) {
                    return null;
                }

                return {
                    id: databaseCredentials.id,
                    name: databaseCredentials.name,
                    email: databaseCredentials.email,
                    userType: databaseCredentials.userType,
                    image: databaseCredentials.image,
                };
            },
        }),
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = () => getServerSession(authOptions);
