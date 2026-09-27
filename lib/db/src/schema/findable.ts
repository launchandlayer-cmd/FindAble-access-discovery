import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const savedPlacesTable = pgTable(
  "saved_places",
  {
    userId: varchar("user_id").notNull(),
    placeId: varchar("place_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.placeId] })],
);

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  placeId: varchar("place_id").notNull(),
  overall: integer("overall").notNull(),
  communication: integer("communication").notNull(),
  staffUnderstanding: integer("staff_understanding").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});