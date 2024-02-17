import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
    User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { DefaultJWT, JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "~/env";
import { db } from "~/server/db";
import { createTable, users } from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        token?: JWT
    }

    interface User {
        id?: string,
        name?: string,
        email?: string,
        userType?: string,
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT extends DefaultJWT {
        userType?: string
    }
}
            
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    }, 
    callbacks: {
        session: async ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
                userType: token.userType,
            }
        }),
        jwt: async ({ token }) => {
            token.userType = (await db.select({userType: users.userType})
                    .from(users)
                    .where(eq(users.id, token.sub ?? ""))
                    .execute())[0]?.userType ?? "";
    
            return token
        }
    },
    adapter: DrizzleAdapter(db, createTable) as Adapter,
    providers: [
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
        /**
         * ...add more providers here.
         */
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = () => getServerSession(authOptions);
