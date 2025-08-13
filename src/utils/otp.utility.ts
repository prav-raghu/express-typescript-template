import crypto from "crypto";

export class OtpUtil {
    public static generateOtp(length = 6): string {
        return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, "0");
    }

    public static verifyOtp(input: string, stored: string): boolean {
        return input === stored;
    }
}
