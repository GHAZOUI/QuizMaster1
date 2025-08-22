import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertQuizSessionSchema, insertLeaderboardEntrySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Quiz routes
  app.get("/api/questions/random", async (req, res) => {
    const { category = "Geography", limit = "10" } = req.query;
    try {
      const questions = await storage.getRandomQuestions(category as string, parseInt(limit as string));
      res.json(questions);
    } catch (error) {
      res.status(400).json({ message: "Error fetching questions" });
    }
  });

  app.get("/api/questions/categories", async (req, res) => {
    const categories = ["Geography", "History", "Science", "Arts", "Sports"];
    res.json(categories);
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

  app.put("/api/quiz-sessions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const session = await storage.updateQuizSession(req.params.id, updates);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.post("/api/quiz-sessions/:id/complete", async (req, res) => {
    try {
      const { score, correctAnswers } = req.body;
      const session = await storage.updateQuizSession(req.params.id, {
        score,
        correctAnswers,
        isCompleted: true,
        completedAt: new Date()
      });
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Update user stats
      const user = await storage.getUser(session.userId);
      if (user) {
        await storage.updateUser(user.id, {
          totalScore: (user.totalScore || 0) + score,
          quizzesCompleted: (user.quizzesCompleted || 0) + 1
        });

        // Create leaderboard entry
        await storage.createLeaderboardEntry({
          userId: session.userId,
          score,
          category: session.category
        });
      }

      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Error completing quiz" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    const { category, country, continent, date } = req.query;
    
    const filters: any = {};
    if (category) filters.category = category;
    if (country) filters.country = country;
    if (continent) filters.continent = continent;
    if (date) filters.date = new Date(date as string);

    try {
      const entries = await storage.getLeaderboard(filters);
      
      // Enrich with user data
      const enrichedEntries = await Promise.all(
        entries.map(async (entry) => {
          const user = await storage.getUser(entry.userId);
          return {
            ...entry,
            user: user ? {
              username: user.username,
              country: user.country,
              continent: user.continent
            } : null
          };
        })
      );
      
      res.json(enrichedEntries);
    } catch (error) {
      res.status(400).json({ message: "Error fetching leaderboard" });
    }
  });

  app.get("/api/users/:id/rank", async (req, res) => {
    const { category, date } = req.query;
    
    try {
      const rank = await storage.getUserRank(
        req.params.id, 
        category as string, 
        date ? new Date(date as string) : undefined
      );
      res.json({ rank });
    } catch (error) {
      res.status(400).json({ message: "Error fetching user rank" });
    }
  });

  // Geography data routes
  app.get("/api/continents", async (req, res) => {
    const continents = [
      "Europe",
      "North America", 
      "Asia",
      "Africa",
      "South America",
      "Oceania"
    ];
    res.json(continents);
  });

  app.get("/api/countries", async (req, res) => {
    const { continent } = req.query;
    
    const countriesByContinent: Record<string, string[]> = {
      "Europe": ["France", "Germany", "Spain", "Italy", "United Kingdom", "Netherlands", "Poland"],
      "North America": ["United States", "Canada", "Mexico"],
      "Asia": ["China", "Japan", "India", "South Korea", "Thailand"],
      "Africa": ["Nigeria", "South Africa", "Egypt", "Kenya"],
      "South America": ["Brazil", "Argentina", "Chile", "Peru"],
      "Oceania": ["Australia", "New Zealand", "Fiji"]
    };
    
    if (continent && countriesByContinent[continent as string]) {
      res.json(countriesByContinent[continent as string]);
    } else {
      const allCountries = Object.values(countriesByContinent).flat();
      res.json(allCountries);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
