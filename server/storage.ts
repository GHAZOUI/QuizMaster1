import { 
  type User, 
  type InsertUser,
  type UpsertUser,
  type Question, 
  type InsertQuestion,
  type QuizSession,
  type InsertQuizSession,
  type LeaderboardEntry,
  type InsertLeaderboardEntry
} from "../shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { users, questions, quizSessions, leaderboardEntries } from "../shared/schema";
import { eq, and, desc, count, gte, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  updateUserCoins(userId: string, coinChange: number): Promise<User | undefined>;

  // Question operations
  getQuestionsByCategory(category: string): Promise<Question[]>;
  getRandomQuestions(category: string, limit: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  getQuestionCount(category: string): Promise<number>;
  fetchMoreQuestions(category: string): Promise<Question[]>;

  // Quiz session operations
  createQuizSession(session: InsertQuizSession): Promise<QuizSession>;
  updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession | undefined>;
  getQuizSession(id: string): Promise<QuizSession | undefined>;

  // Leaderboard operations
  createLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  getLeaderboard(filters: {
    category?: string;
    country?: string;
    continent?: string;
    date?: Date;
  }): Promise<LeaderboardEntry[]>;
  getUserRank(userId: string, category: string, date?: Date): Promise<number>;
}

// Function to fetch questions from external API
async function fetchQuestionsFromAPI(category: string, amount: number = 50): Promise<InsertQuestion[]> {
  try {
    // Using Open Trivia Database API with different difficulty levels
    const categoryMap: { [key: string]: number } = {
      'Geography': 22,
      'History': 23,
      'Science': 17,
      'Arts': 25,
      'Sports': 21
    };
    
    const categoryId = categoryMap[category] || 9;
    const difficulties = ['medium', 'hard'];
    
    const allQuestions: InsertQuestion[] = [];
    
    for (const difficulty of difficulties) {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${Math.ceil(amount/2)}&category=${categoryId}&difficulty=${difficulty}&type=multiple`
      );
      
      if (response.ok) {
        const data = await response.json();
        const questions = data.results.map((q: any) => ({
          text: q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"),
          answer: q.correct_answer.toUpperCase().replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&"),
          category: category,
          difficulty: difficulty === 'medium' ? 3 : 4,
          hint: `This answer has ${q.correct_answer.length} characters`
        }));
        allQuestions.push(...questions);
      }
    }
    
    return allQuestions.slice(0, amount);
  } catch (error) {
    console.error('Error fetching questions from API:', error);
    return [];
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if default user exists
      const existingUser = await db.select().from(users).where(eq(users.id, "user-1")).limit(1);
      
      if (existingUser.length === 0) {
        const defaultUser: UpsertUser = {
          id: "user-1",
          email: "alex.dupont@email.com",
          firstName: "Alex",
          lastName: "Dupont",
          continent: "Europe",
          country: "France",
          totalScore: 5420,
          quizzesCompleted: 23,
          coins: 8
        };
        await db.insert(users).values(defaultUser);
      }

      // Check if we need to seed initial questions for each category
      const categories = ['Geography', 'History', 'Science', 'Arts', 'Sports'];
      
      for (const category of categories) {
        const existingQuestions = await db.select({ count: count() })
          .from(questions)
          .where(eq(questions.category, category));
        
        if (existingQuestions[0].count < 10) {
          // Fetch and seed initial questions from API
          const newQuestions = await fetchQuestionsFromAPI(category, 50);
          if (newQuestions.length > 0) {
            const questionsWithIds = newQuestions.map(q => ({ ...q, id: randomUUID() }));
            await db.insert(questions).values(questionsWithIds);
            console.log(`Seeded ${questionsWithIds.length} questions for ${category}`);
          }
        }
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(insertUser).returning();
    return newUser;
  }

  async updateUserCoins(userId: string, coinChange: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ coins: sql`GREATEST(0, ${users.coins} + ${coinChange})` })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.category, category));
  }

  async getRandomQuestions(category: string, limit: number): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.category, category))
      .orderBy(sql`RANDOM()`)
      .limit(limit);
  }

  async getQuestionCount(category: string): Promise<number> {
    const result = await db.select({ count: count() })
      .from(questions)
      .where(eq(questions.category, category));
    return result[0].count;
  }

  async fetchMoreQuestions(category: string): Promise<Question[]> {
    // Fetch more questions from external API
    const newQuestions = await fetchQuestionsFromAPI(category, 50);
    if (newQuestions.length > 0) {
      const questionsWithIds = newQuestions.map(q => ({ ...q, id: randomUUID() }));
      const insertedQuestions = await db.insert(questions).values(questionsWithIds).returning();
      return insertedQuestions;
    }
    return [];
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(insertQuestion).returning();
    return newQuestion;
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const [newSession] = await db.insert(quizSessions).values(insertSession).returning();
    return newSession;
  }

  async updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession | undefined> {
    const [updatedSession] = await db
      .update(quizSessions)
      .set(updates)
      .where(eq(quizSessions.id, id))
      .returning();
    return updatedSession || undefined;
  }

  async getQuizSession(id: string): Promise<QuizSession | undefined> {
    const [session] = await db.select().from(quizSessions).where(eq(quizSessions.id, id));
    return session || undefined;
  }

  async createLeaderboardEntry(insertEntry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const [newEntry] = await db.insert(leaderboardEntries).values(insertEntry).returning();
    return newEntry;
  }

  async getLeaderboard(filters: {
    category?: string;
    country?: string;
    continent?: string;
    date?: Date;
  }): Promise<LeaderboardEntry[]> {
    let query = db
      .select({
        id: leaderboardEntries.id,
        userId: leaderboardEntries.userId,
        score: leaderboardEntries.score,
        category: leaderboardEntries.category,
        date: leaderboardEntries.date,
        rank: leaderboardEntries.rank,
        username: users.username,
        country: users.country,
        continent: users.continent
      })
      .from(leaderboardEntries)
      .innerJoin(users, eq(leaderboardEntries.userId, users.id));

    const conditions = [];
    if (filters.category) conditions.push(eq(leaderboardEntries.category, filters.category));
    if (filters.country) conditions.push(eq(users.country, filters.country));
    if (filters.continent) conditions.push(eq(users.continent, filters.continent));

    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(leaderboardEntries.score)).limit(100);
    }

    return await query.orderBy(desc(leaderboardEntries.score)).limit(100);
  }

  async getUserRank(userId: string, category: string, date?: Date): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(leaderboardEntries)
      .where(
        and(
          eq(leaderboardEntries.category, category),
          gte(leaderboardEntries.score, 
            sql`(SELECT score FROM ${leaderboardEntries} WHERE ${leaderboardEntries.userId} = ${userId} AND ${leaderboardEntries.category} = ${category} LIMIT 1)`
          )
        )
      );
    
    return result[0].count + 1;
  }
}

export const storage = new DatabaseStorage();