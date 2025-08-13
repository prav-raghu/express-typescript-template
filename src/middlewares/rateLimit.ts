import { Request, Response, NextFunction } from "express";

interface RateLimiterOptions {
    windowMs: number;
    max: number;
    message: string;
}

export class AuthRateLimiter {
    private readonly windowMs: number;
    private readonly max: number;
    private readonly message: string;
    private readonly ipStore: Map<string, { count: number; resetTime: number }>;

    constructor(options: RateLimiterOptions) {
        this.windowMs = options.windowMs;
        this.max = options.max;
        this.message = options.message;
        this.ipStore = new Map();
    }

    public middleware(req: Request, res: Response, next: NextFunction): void {
        const ip = req.ip;
        const now = Date.now();
        let record = this.ipStore.get(ip!);
        if (!record || now > record.resetTime) {
            record = { count: 1, resetTime: now + this.windowMs };
            this.ipStore.set(ip!, record);
        } else {
            record.count += 1;
        }
        if (record.count > this.max) {
            res.status(429).send(this.message);
        } else {
            next();
        }
    }
}

export const authRateLimiter = new AuthRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many requests, please try again later.",
}).middleware;
