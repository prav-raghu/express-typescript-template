import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const envSchema = z.object({
    APP_PORT: z.string().transform(Number),
    NODE_ENV: z.enum(["development", "production", "test"]),
    DB_DRIVER: z.enum(["prisma", "mongoose"]),
    POSTGRES_URL: z.string().optional(),
    MONGO_URL: z.string().optional(),
    REDIS_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    ACCESS_TTL: z.string(),
    REFRESH_TTL: z.string(),
    BCRYPT_ROUNDS: z.string().transform(Number),
    EMAIL_PROVIDER: z.enum(["resend", "smtp", "console"]),
    SMS_PROVIDER: z.enum(["vonage", "console"]),
    OAUTH_GOOGLE_CLIENT_ID: z.string().optional(),
    OAUTH_GOOGLE_SECRET: z.string().optional(),
    OAUTH_GOOGLE_CALLBACK_URL: z.string().optional(),
    OAUTH_MS_CLIENT_ID: z.string().optional(),
    OAUTH_MS_SECRET: z.string().optional(),
    OAUTH_MS_TENANT_ID: z.string().optional(),
    OAUTH_MS_CALLBACK_URL: z.string().optional(),
    OAUTH_FB_CLIENT_ID: z.string().optional(),
    OAUTH_FB_SECRET: z.string().optional(),
    OAUTH_FB_CALLBACK_URL: z.string().optional(),
});

export class EnvConfig {
    private static instance: EnvConfig;
    public readonly values: z.infer<typeof envSchema>;

    private constructor() {
        this.values = envSchema.parse(process.env);
    }

    public static getInstance(): EnvConfig {
        if (!EnvConfig.instance) {
            EnvConfig.instance = new EnvConfig();
        }
        return EnvConfig.instance;
    }
}

export const env = EnvConfig.getInstance().values;
export type Env = typeof env;
