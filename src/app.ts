import dotenv from "dotenv";
dotenv.config();

import express from "express";
import webRoutes from "./routes/web";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/v1/admin";
import { displayLogo, startServer } from "./utils/serverDisplay";
import { db } from "./lib/db";
import logger from "./utils/logger";
import { createSpinner } from "nanospinner";
import { validateEnv } from "./env";
import { PrismaClient } from "@prisma/client";
console.clear();
displayLogo();

const app = express();
const PORT = process.env.PORT || 3000;
const startTime = new Date();
const prisma = new PrismaClient();

validateEnv();

// Middleware
const middlewareSpinner = createSpinner("Setting up middleware...").start();
//!app.use(cors())
try {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  middlewareSpinner.success({ text: "Middleware setup completed" });
} catch (error) {
  middlewareSpinner.error({ text: "Error setting up middleware" });
  logger.error("Middleware error:", error);
}

// Routes
const routesSpinner = createSpinner("Setting up routes...").start();
try {
  app.use("/", webRoutes);
  app.use("/v1/admin", adminRouter);
  routesSpinner.success({ text: "Routes setup completed" });
} catch (error) {
  routesSpinner.error({ text: "Error setting up routes" });
  logger.error("Routes error:", error);
}

const server = app.listen(PORT, async () => {
  await startServer(PORT, startTime);
  console.log("🚀 Server started on port", PORT);
  console.log("📝 Environment:", process.env.NODE_ENV);
  console.log(
    "🔌 Database URL:",
    process.env.DATABASE_URL?.replace(/:[^:@]*@/, ":****@")
  );
});

export default app;
