import Redis from "ioredis";

export class RedisProvider {
    private static instance: RedisProvider;
    private client: Redis;

    private constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
        });
    }

    public static getInstance(): RedisProvider {
        if (!RedisProvider.instance) {
            RedisProvider.instance = new RedisProvider();
        }
        return RedisProvider.instance;
    }

    public async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
        } else {
            await this.client.set(key, JSON.stringify(value));
        }
    }

    public async get<T = unknown>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    public async del(key: string): Promise<number> {
        return await this.client.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        return (await this.client.exists(key)) === 1;
    }

    public async disconnect(): Promise<void> {
        await this.client.quit();
    }
}
