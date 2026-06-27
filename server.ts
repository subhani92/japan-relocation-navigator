import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { relocationRoutes } from "./src/routes/relocation.routes.js";
import { uploadRoutes } from "./src/routes/upload.routes.js";
import { reportRoutes } from "./src/routes/report.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded parsers
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Static serving for uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // API Routes
  app.use("/api/relocation", relocationRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/report", reportRoutes);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Japan Relocation Coordinator", time: new Date().toISOString() });
  });

  // Error handling middleware (must be registered after routes, but before static frontend handlers)
  app.use(errorHandler);

  // Vite integration / Static frontend serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with static file assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(`🚀 Japan Relocation Navigator is running at http://localhost:${PORT}`);
    console.log(`=============================================================`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start the Express server:", err);
});
