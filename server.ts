import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./backend/config/db";
import apiRoutes from "./backend/routes/api";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/feedback_db";

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(express.json());

  // Connect to MongoDB
  await connectDB(MONGODB_URI);

  // Health Check
  app.get("/api/health", (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({ 
      status: isConnected ? "connected" : "disconnected",
      database: "MongoDB",
      uri: process.env.MONGODB_URI ? "Configured" : "Using Default (Localhost)"
    });
  });

  // API Routes
  app.use("/api", apiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
