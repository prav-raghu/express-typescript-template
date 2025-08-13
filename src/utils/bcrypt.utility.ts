import bcrypt from "bcrypt";
import { env } from "../config/env";

export class BcryptUtil {
    public static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, env.BCRYPT_ROUNDS);
    }

    public static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
