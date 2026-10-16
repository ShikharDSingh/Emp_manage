import "dotenv/config";
import { z } from "zod";

// Validate configuration once, when the app starts. Fail early if a secret is missing.
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must contain at least 32 characters"),
  JWT_ISSUER: z.string().default("employee-management-api"),
  JWT_AUDIENCE: z.string().default("employee-management-clients"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(7),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(30),
  AUDIT_RETENTION_DAYS: z.coerce.number().int().positive().default(365),
  COOKIE_SECURE: z.enum(["true", "false"]).default("false"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // Do not print environment values because they can contain secrets.
  console.error(
    "Invalid environment configuration:",
    parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
  );
  throw new Error(
    "Application configuration is invalid. Check your .env file.",
  );
}
export const env = {
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CORS_ORIGINS.split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  COOKIE_SECURE: parsed.data.COOKIE_SECURE === "true",
};
