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
import { db } from "./db";
import { users, questions, quizSessions, leaderboardEntries } from "@shared/schema";
import { eq, and, desc, count, gte, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
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

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if default user exists
      const existingUser = await db.select().from(users).where(eq(users.id, "user-1")).limit(1);
      
      if (existingUser.length === 0) {
        // Seed default user
        const defaultUser: InsertUser = {
          id: "user-1",
          username: "Alex Dupont",
          email: "alex.dupont@email.com",
          password: "hashed_password",
          continent: "Europe",
          country: "France",
          totalScore: 5420,
          quizzesCompleted: 23,
          coins: 8
        };
        await db.insert(users).values(defaultUser);
      }

    // Seed sample questions
    const sampleQuestions: InsertQuestion[] = [
      // Geography Questions
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
        text: "Which country has the most natural lakes?",
        answer: "CANADA",
        category: "Geography",
        difficulty: 3,
        hint: "North American country with 6 letters"
      },
      {
        text: "What is the longest river in the world?",
        answer: "NILE",
        category: "Geography",
        difficulty: 2,
        hint: "African river with 4 letters"
      },
      {
        text: "Which mountain range contains Mount Everest?",
        answer: "HIMALAYAS",
        category: "Geography",
        difficulty: 3,
        hint: "Asian mountain range with 9 letters"
      },
      {
        text: "What is the smallest country in the world?",
        answer: "VATICAN",
        category: "Geography",
        difficulty: 4,
        hint: "City-state in Rome with 7 letters"
      },
      {
        text: "Which desert is the largest in the world?",
        answer: "SAHARA",
        category: "Geography",
        difficulty: 2,
        hint: "African desert with 6 letters"
      },
      {
        text: "What is the capital of Japan?",
        answer: "TOKYO",
        category: "Geography",
        difficulty: 1,
        hint: "Asian capital with 5 letters"
      },

      // History Questions
      {
        text: "In which year did World War II end?",
        answer: "1945",
        category: "History",
        difficulty: 2,
        hint: "Four digit year in the 1940s"
      },
      {
        text: "Who was the first person to walk on the moon?",
        answer: "ARMSTRONG",
        category: "History",
        difficulty: 3,
        hint: "American astronaut, last name has 9 letters"
      },
      {
        text: "Which ancient wonder was located in Alexandria?",
        answer: "LIGHTHOUSE",
        category: "History",
        difficulty: 4,
        hint: "Maritime structure with 10 letters"
      },
      {
        text: "Who was the last pharaoh of Egypt?",
        answer: "CLEOPATRA",
        category: "History",
        difficulty: 3,
        hint: "Famous queen with 9 letters"
      },
      {
        text: "In which year did the Berlin Wall fall?",
        answer: "1989",
        category: "History",
        difficulty: 3,
        hint: "Four digit year in the 1980s"
      },
      {
        text: "Which empire was ruled by Julius Caesar?",
        answer: "ROMAN",
        category: "History",
        difficulty: 2,
        hint: "Ancient empire with 5 letters"
      },
      {
        text: "Who invented the printing press?",
        answer: "GUTENBERG",
        category: "History",
        difficulty: 4,
        hint: "German inventor with 9 letters"
      },

      // Science Questions
      {
        text: "What is the chemical symbol for gold?",
        answer: "AU",
        category: "Science",
        difficulty: 2,
        hint: "Two letters from Latin name"
      },
      {
        text: "What is the hardest natural substance?",
        answer: "DIAMOND",
        category: "Science",
        difficulty: 2,
        hint: "Precious stone with 7 letters"
      },
      {
        text: "How many bones are in an adult human body?",
        answer: "206",
        category: "Science",
        difficulty: 4,
        hint: "Three digit number over 200"
      },
      {
        text: "What gas makes up most of Earth's atmosphere?",
        answer: "NITROGEN",
        category: "Science",
        difficulty: 3,
        hint: "Chemical element with 8 letters"
      },
      {
        text: "Who developed the theory of relativity?",
        answer: "EINSTEIN",
        category: "Science",
        difficulty: 2,
        hint: "Famous physicist with 8 letters"
      },
      {
        text: "What is the smallest unit of matter?",
        answer: "ATOM",
        category: "Science",
        difficulty: 2,
        hint: "Basic particle with 4 letters"
      },
      {
        text: "What planet is closest to the Sun?",
        answer: "MERCURY",
        category: "Science",
        difficulty: 2,
        hint: "Planet named after Roman god with 7 letters"
      },

      // Arts Questions
      {
        text: "Who painted the Mona Lisa?",
        answer: "LEONARDO",
        category: "Arts",
        difficulty: 3,
        hint: "Famous Renaissance artist, first name has 8 letters"
      },
      {
        text: "Which artist cut off his own ear?",
        answer: "VANGOGH",
        category: "Arts",
        difficulty: 3,
        hint: "Dutch post-impressionist with 7 letters"
      },
      {
        text: "What is Michelangelo's most famous sculpture?",
        answer: "DAVID",
        category: "Arts",
        difficulty: 2,
        hint: "Biblical figure with 5 letters"
      },
      {
        text: "Who composed 'The Four Seasons'?",
        answer: "VIVALDI",
        category: "Arts",
        difficulty: 4,
        hint: "Italian composer with 7 letters"
      },
      {
        text: "Which museum houses the Mona Lisa?",
        answer: "LOUVRE",
        category: "Arts",
        difficulty: 3,
        hint: "Famous Paris museum with 6 letters"
      },
      {
        text: "Who wrote 'Romeo and Juliet'?",
        answer: "SHAKESPEARE",
        category: "Arts",
        difficulty: 2,
        hint: "English playwright with 11 letters"
      },
      {
        text: "What instrument did Mozart primarily compose for?",
        answer: "PIANO",
        category: "Arts",
        difficulty: 3,
        hint: "Keyboard instrument with 5 letters"
      },

      // Sports Questions
      {
        text: "How many players are on a soccer team?",
        answer: "ELEVEN",
        category: "Sports",
        difficulty: 2,
        hint: "Number spelled out with 6 letters"
      },
      {
        text: "In which sport is a shuttlecock used?",
        answer: "BADMINTON",
        category: "Sports",
        difficulty: 3,
        hint: "Racket sport with 9 letters"
      },
      {
        text: "What is the maximum score in ten-pin bowling?",
        answer: "300",
        category: "Sports",
        difficulty: 3,
        hint: "Three digit number"
      },
      {
        text: "Which country hosted the 2016 Summer Olympics?",
        answer: "BRAZIL",
        category: "Sports",
        difficulty: 2,
        hint: "South American country with 6 letters"
      },
      {
        text: "How many holes are there on a golf course?",
        answer: "EIGHTEEN",
        category: "Sports",
        difficulty: 2,
        hint: "Number spelled out with 8 letters"
      },
      {
        text: "What does NBA stand for?",
        answer: "BASKETBALL",
        category: "Sports",
        difficulty: 3,
        hint: "Sport played with orange ball and hoops, 10 letters"
      },
      {
        text: "In tennis, what does 'love' mean?",
        answer: "ZERO",
        category: "Sports",
        difficulty: 3,
        hint: "Score represented by 4 letters"
      }
    ];

    sampleQuestions.forEach(q => this.createQuestion(q));
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
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
      quizzesCompleted: 0,
      coins: 10 // Start with 10 coins
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCoins(userId: string, coinChange: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, coins: Math.max(0, (user.coins || 0) + coinChange) };
    this.users.set(userId, updatedUser);
    return updatedUser;
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
    const question: Question = { 
      ...insertQuestion, 
      id,
      hint: insertQuestion.hint || null 
    };
    this.questions.set(id, question);
    return question;
  }

  async createQuizSession(insertSession: InsertQuizSession): Promise<QuizSession> {
    const id = randomUUID();
    const session: QuizSession = { 
      ...insertSession, 
      id,
      completedAt: new Date(),
      isCompleted: false,
      score: insertSession.score || 0,
      correctAnswers: insertSession.correctAnswers || 0,
      totalQuestions: insertSession.totalQuestions || 0
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
