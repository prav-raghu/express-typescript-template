import jwt from "jsonwebtoken";
import { env } from "../config/env";

export class JwtUtil {
    public static signAccessToken(payload: object) {
        return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: Number(env.ACCESS_TTL) });
    }

    public static signRefreshToken(payload: object) {
        return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: Number(env.REFRESH_TTL) });
    }

    public static verifyAccessToken(token: string) {
        return jwt.verify(token, env.JWT_ACCESS_SECRET);
    }

    public static verifyRefreshToken(token: string) {
        return jwt.verify(token, env.JWT_REFRESH_SECRET);
    }
}
