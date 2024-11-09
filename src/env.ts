import { z } from "zod";
import logger from "./utils/logger";

const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number().min(1),
  FORNTEND_APP_URL: z.string().url(),

  JWT_ACCESS_TOKEN_SECRET: z.string().min(2),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(2),

  DATABASE_URL: z.string().min(1),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().min(1),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM_EMAIL: z.string().email(),
  SMTP_FROM_NAME: z.string().min(1),
});

export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join("."));
      logger.error("Invalid environment variables:", missingVars.join(", "));
      process.exit(1);
    }
    logger.error("Error validating environment variables:", error);
    process.exit(1);
  }
}

export const env = validateEnv();
