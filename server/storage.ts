import { 
  type User, 
  type InsertUser, 
  type Question, 
  type InsertQuestion,
  type QuizSession,
  type InsertQuizSession,
  type LeaderboardEntry,
  type InsertLeaderboardEntry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Question operations
  getQuestionsByCategory(category: string): Promise<Question[]>;
  getRandomQuestions(category: string, limit: number): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questions: Map<string, Question>;
  private quizSessions: Map<string, QuizSession>;
  private leaderboardEntries: Map<string, LeaderboardEntry>;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.quizSessions = new Map();
    this.leaderboardEntries = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed sample questions
    const sampleQuestions: InsertQuestion[] = [
      {
        text: "What is the capital city of Australia?",
        answer: "CANBERRA",
        category: "Geography",
        difficulty: 3,
        hint: "This city has 8 letters"
      },
      {
        text: "What is the largest ocean on Earth?",
        answer: "PACIFIC",
        category: "Geography",
        difficulty: 2,
        hint: "This ocean has 7 letters"
      },
      {
        text: "Who painted the Mona Lisa?",
        answer: "LEONARDO",
        category: "Arts",
        difficulty: 3,
        hint: "Famous Renaissance artist, first name has 8 letters"
      },
      {
        text: "What is the chemical symbol for gold?",
        answer: "AU",
        category: "Science",
        difficulty: 2,
        hint: "Two letters from Latin name"
      },
      {
        text: "In which year did World War II end?",
        answer: "1945",
        category: "History",
        difficulty: 2,
        hint: "Four digit year in the 1940s"
      }
    ];

    sampleQuestions.forEach(q => this.createQuestion(q));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      totalScore: 0,
      quizzesCompleted: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getQuestionsByCategory(category: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      q => q.category === category
    );
  }

  async getRandomQuestions(category: string, limit: number): Promise<Question[]> {
    const categoryQuestions = await this.getQuestionsByCategory(category);
    const shuffled = categoryQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = randomUUID();
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = randomUUID();
    const session: QuizSession = { 
      ...insertSession, 
      id,
      completedAt: new Date(),
      isCompleted: false
    };
    this.quizSessions.set(id, session);
    return session;
  }

  async updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<QuizSession | undefined> {
    const session = this.quizSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.quizSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getQuizSession(id: string): Promise<QuizSession | undefined> {
    return this.quizSessions.get(id);
  }

  async createLeaderboardEntry(insertEntry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const id = randomUUID();
    const entry: LeaderboardEntry = { 
      ...insertEntry, 
      id,
      date: new Date(),
      rank: 0
    };
    this.leaderboardEntries.set(id, entry);
    
    // Recalculate ranks for this category
    await this.recalculateRanks(insertEntry.category);
    
    return this.leaderboardEntries.get(id)!;
  }

  private async recalculateRanks(category: string): Promise<void> {
    const entries = Array.from(this.leaderboardEntries.values())
      .filter(e => e.category === category)
      .sort((a, b) => b.score - a.score);
    
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
      this.leaderboardEntries.set(entry.id, entry);
    });
  }

  async getLeaderboard(filters: {
    category?: string;
    country?: string;
    continent?: string;
    date?: Date;
  }): Promise<LeaderboardEntry[]> {
    let entries = Array.from(this.leaderboardEntries.values());
    
    if (filters.category) {
      entries = entries.filter(e => e.category === filters.category);
    }
    
    if (filters.date) {
      const targetDate = filters.date.toDateString();
      entries = entries.filter(e => e.date?.toDateString() === targetDate);
    }
    
    if (filters.country || filters.continent) {
      const users = Array.from(this.users.values());
      entries = entries.filter(entry => {
        const user = users.find(u => u.id === entry.userId);
        if (!user) return false;
        
        if (filters.country && user.country !== filters.country) return false;
        if (filters.continent && user.continent !== filters.continent) return false;
        
        return true;
      });
    }
    
    return entries.sort((a, b) => (a.rank || 0) - (b.rank || 0));
  }

  async getUserRank(userId: string, category: string, date?: Date): Promise<number> {
    const filters = { category, date };
    const leaderboard = await this.getLeaderboard(filters);
    const entry = leaderboard.find(e => e.userId === userId);
    return entry?.rank || 0;
  }
}

export const storage = new MemStorage();
