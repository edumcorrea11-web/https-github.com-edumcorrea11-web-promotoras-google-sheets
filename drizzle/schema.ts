import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Reports table for storing visit reports from promoters
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  reportType: varchar("reportType", { length: 50 }).notNull(),
  promoter: varchar("promoter", { length: 255 }).notNull(),
  visitDate: varchar("visitDate", { length: 50 }).notNull(),
  network: varchar("network", { length: 255 }).notNull(),
  store: varchar("store", { length: 255 }).notNull(),
  leaderName: varchar("leaderName", { length: 255 }),
  leaderPhone: varchar("leaderPhone", { length: 50 }),
  productsInFreezer: varchar("productsInFreezer", { length: 50 }),
  freezerProducts: text("freezerProducts"),
  freezerOrganization: varchar("freezerOrganization", { length: 50 }),
  freezerProblems: text("freezerProblems"),
  productsToasted: varchar("productsToasted", { length: 50 }),
  toastedProducts: text("toastedProducts"),
  visualQuality: varchar("visualQuality", { length: 50 }),
  exposure: varchar("exposure", { length: 50 }),
  exposureProblems: text("exposureProblems"),
  generalObservations: text("generalObservations"),
  mainProblem: text("mainProblem"),
  stockDetails: text("stockDetails"),
  counterDetails: text("counterDetails"),
  actionTaken: text("actionTaken"),
  feedback: text("feedback"),
  report: text("report").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// TODO: Add your tables here