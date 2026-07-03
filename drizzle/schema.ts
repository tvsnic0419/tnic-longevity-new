import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Waitlist for the health prognostication feature.
 */
export const waitlist = mysqlTable("waitlist", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Supplements table for future database-driven content.
 */
export const supplements = mysqlTable("supplements", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  tier: mysqlEnum("tier", ["A", "B", "C"]).notNull(),
  primaryTarget: varchar("primaryTarget", { length: 256 }).notNull(),
  pathways: json("pathways").$type<string[]>().notNull(),
  mechanism: text("mechanism").notNull(),
  evidence: text("evidence").notNull(),
  synergies: json("synergies").$type<string[]>().notNull(),
  dosingContext: text("dosingContext").notNull(),
  rank: int("rank").notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = typeof waitlist.$inferInsert;
export type SupplementRow = typeof supplements.$inferSelect;
export type InsertSupplement = typeof supplements.$inferInsert;
