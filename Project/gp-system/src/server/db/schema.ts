import { relations, sql } from "drizzle-orm";
import {
    boolean,
    date,
    index,
    integer,
    pgEnum,
    pgTableCreator,
    primaryKey,
    real,
    serial,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `gp-system_${name}`);

export const userTypeEnum = pgEnum("userType", ["doctor", "frontdesk", "user"]);
export const paymentStatus = pgEnum("paymentStatus", ["complete", "failed", "pending"]);

export const users = createTable("user", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
        mode: "date",
    }).default(sql`CURRENT_TIMESTAMP`),
    image: varchar("image", { length: 255 }),
    usertype: userTypeEnum("userType").default("user"),
    doctorId: varchar("doctorId", { length: 255 }).default(sql`NULL`)
});

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    appointments: many(appointment)
}));

export const accounts = createTable(
    "account",
    {
        userId: varchar("userId", { length: 255 })
            .notNull()
            .references(() => users.id),
        type: varchar("type", { length: 255 })
            .$type<AdapterAccount["type"]>()
            .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", {
            length: 255,
        }).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: text("id_token"),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
        userIdIdx: index("account_userId_idx").on(account.userId),
    }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
    "session",
    {
        sessionToken: varchar("sessionToken", { length: 255 })
            .notNull()
            .primaryKey(),
        userId: varchar("userId", { length: 255 })
            .notNull()
            .references(() => users.id),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (session) => ({
        userIdIdx: index("session_userId_idx").on(session.userId),
    }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    }),
);


export const appointment = createTable("appointment", {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 })
        .references(() => users.id)
        .notNull(),
    doctorId: varchar("doctorId", { length: 255 })
        .references(() => users.id)
        .notNull(),
    createdById: varchar("createdById", { length: 255 })
        .notNull()
        .references(() => users.id),
    appointmentDate: date("appointmentDate").notNull(),
    paymentAmount: real("paymentAmount"),
    paymentStatus: paymentStatus("paymentStatus").default("pending"),
    isCancelled: boolean("isCancelled").default(false),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});



