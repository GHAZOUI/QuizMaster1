import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  continent: text("continent"),
  country: text("country"),
  totalScore: integer("total_score").default(0),
  quizzesCompleted: integer("quizzes_completed").default(0),
  coins: integer("coins").default(0),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  difficulty: integer("difficulty").notNull(), // 1-5
  hint: text("hint"),
});

export const quizSessions = pgTable("quiz_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  score: integer("score").default(0),
  correctAnswers: integer("correct_answers").default(0),
  totalQuestions: integer("total_questions").default(0),
  category: text("category").notNull(),
  completedAt: timestamp("completed_at").default(sql`NOW()`),
  isCompleted: boolean("is_completed").default(false),
});

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  score: integer("score").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").default(sql`NOW()`),
  rank: integer("rank"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalScore: true,
  quizzesCompleted: true,
  coins: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).omit({
  id: true,
  completedAt: true,
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).omit({
  id: true,
  date: true,
  rank: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type QuizSession = typeof quizSessions.$inferSelect;
export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
