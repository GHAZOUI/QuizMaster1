import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertQuizSessionSchema, insertLeaderboardEntrySchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple CORS middleware for mobile app
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Question routes
  app.get("/api/questions", async (req, res) => {
    const { category, limit } = req.query;
    const questions = category 
      ? await storage.getQuestionsByCategory(String(category))
      : await storage.getRandomQuestions("Geography", limit ? parseInt(String(limit)) : 10);
    res.json(questions);
  });

  app.get("/api/questions/random/:category", async (req, res) => {
    const { category } = req.params;
    const { limit } = req.query;
    const questions = await storage.getRandomQuestions(category, limit ? parseInt(String(limit)) : 10);
    res.json(questions);
  });

  // Quiz session routes
  app.post("/api/quiz-sessions", async (req, res) => {
    try {
      const sessionData = insertQuizSessionSchema.parse(req.body);
      const session = await storage.createQuizSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.get("/api/quiz-sessions/:id", async (req, res) => {
    const session = await storage.getQuizSession(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  });

  app.put("/api/quiz-sessions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const session = await storage.updateQuizSession(req.params.id, updates);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Failed to update session" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    const { category, continent, country, date } = req.query;
    const filters: any = {};
    if (category) filters.category = String(category);
    if (continent) filters.continent = String(continent);
    if (country) filters.country = String(country);
    if (date) filters.date = new Date(String(date));
    
    const entries = await storage.getLeaderboard(filters);
    res.json(entries);
  });

  app.post("/api/leaderboard", async (req, res) => {
    try {
      const entryData = insertLeaderboardEntrySchema.parse(req.body);
      const entry = await storage.createLeaderboardEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid leaderboard entry" });
    }
  });

  const server = createServer(app);
  return server;
}