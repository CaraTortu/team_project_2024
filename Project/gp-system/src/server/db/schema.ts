import { relations, sql } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    json,
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

export const userTypeEnum = pgEnum("userType", ["doctor", "admin", "user"]);
export const paymentStatus = pgEnum("paymentStatus", [
    "complete",
    "failed",
    "pending",
]);

export const users = createTable("user", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    title: varchar("title", { length: 32 }),
    firstName: varchar("firstName", { length: 64 }),
    lastName: varchar("lastName", { length: 64 }),
    name: varchar("fullName", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
        mode: "date",
    }).default(sql`CURRENT_TIMESTAMP`),
    password: varchar("password", { length: 255 }),
    image: varchar("image", { length: 255 }),
    userType: userTypeEnum("userType").default("user").notNull(),
    clinic_id: integer("clinicId"),
});

export const usersRelations = relations(users, ({ many, one }) => ({
    accounts: many(accounts, { relationName: "accounts" }),
    user_appointments: many(appointment, { relationName: "user" }),
    doctor_appointments: many(appointment, { relationName: "doctor" }),
    clinic_member: one(clinic, {
        fields: [users.clinic_id],
        references: [clinic.id],
        relationName: "doctors",
    }),
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
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
        relationName: "accounts",
    }),
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

export const appointment = createTable(
    "appointment",
    {
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
        appointmentDate: timestamp("appointmentDate", {
            mode: "date",
        }).notNull(),
        details: varchar("details", { length: 512 }),
        paymentAmount: real("paymentAmount"),
        paymentStatus: paymentStatus("paymentStatus").default("pending"),
        paidDate: timestamp("paidDate"),
        checkoutSession: json("checkoutSession"),
        isCancelled: boolean("isCancelled").default(false),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        diagnoses: varchar("diagnoses", { length: 2048 }).default(""),
        notes: varchar("doctorNotes", { length: 16384 }).default(""),
        clinicId: integer("clinicId")
            .references(() => clinic.id)
            .notNull(),
    },
    (appointment) => ({
        userIdIdx: index("appointment_userId_idx").on(appointment.userId),
        doctorIdIdx: index("appointment_doctorId_idx").on(appointment.doctorId),
        clinicIdIdx: index("appointment_clinicId_idx").on(clinic.id),
    }),
);

export const appointmentRelations = relations(appointment, ({ one }) => ({
    user: one(users, {
        relationName: "user",
        fields: [appointment.userId],
        references: [users.id],
    }),
    doctor: one(users, {
        relationName: "doctor",
        fields: [appointment.doctorId],
        references: [users.id],
    }),
    clinic: one(clinic, {
        relationName: "clinic",
        fields: [appointment.clinicId],
        references: [clinic.id],
    }),
}));

export const clinic = createTable("clinic", {
    id: serial("id").primaryKey(),
    address: varchar("address", { length: 1024 }).notNull(),
    latitude: varchar("latitude", { length: 32 }),
    longitude: varchar("longitude", { length: 32 }),
    name: varchar("name").notNull(),
    openingTime: timestamp("openingTime"),
    closingTime: timestamp("closingTime"),
});

export const clinicRelations = relations(clinic, ({ many }) => ({
    doctors: many(users, { relationName: "doctors" }),
    appointments: many(appointment, { relationName: "clinic" }),
}));
