import bcrypt from "bcrypt";
import { z } from "zod";
import {
    RegisterRequestDTO,
    LoginRequestDTO,
    RefreshRequestDTO,
    ForgotPasswordRequestDTO,
    VerifyOtpRequestDTO,
    ResetPasswordRequestDTO,
} from "../dtos/auth.request.dto";
import { AuthResponse } from "../dtos/auth.response.dto";
import { JwtUtil } from "../utils/jwt.utility";
import { EmailProvider } from "../providers/email.provider";
import { SmsProvider } from "../providers/sms.provider";
import { PrismaClient } from "@prisma/client";

export class AuthService {
    constructor(private readonly prisma: PrismaClient) {}

    public async register(data: z.infer<typeof RegisterRequestDTO.schema>): Promise<AuthResponse> {
        const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (existing) throw new Error("this.prisma.user already exists");
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: { email: data.email, password: hashed, verified: false },
        });
        const accessToken = JwtUtil.signAccessToken({ userId: user.id });
        const refreshToken = JwtUtil.signRefreshToken({ userId: user.id });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, verified: user.verified } };
    }

    public async login(data: z.infer<typeof LoginRequestDTO.schema>): Promise<AuthResponse> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user?.password) throw new Error("Invalid credentials");
        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) throw new Error("Invalid credentials");
        const accessToken = JwtUtil.signAccessToken({ userId: user.id });
        const refreshToken = JwtUtil.signRefreshToken({ userId: user.id });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, verified: user.verified } };
    }

    public async refresh(data: z.infer<typeof RefreshRequestDTO.schema>): Promise<AuthResponse> {
        const payload = JwtUtil.verifyRefreshToken(data.refreshToken) as { userId: string };
        const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) throw new Error("this.prisma.user not found");
        const accessToken = JwtUtil.signAccessToken({ userId: user.id });
        const refreshToken = JwtUtil.signRefreshToken({ userId: user.id });
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, verified: user.verified } };
    }

    public async forgotPassword(data: z.infer<typeof ForgotPasswordRequestDTO.schema>): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new Error("this.prisma.user not found");
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.user.update({ where: { email: data.email }, data: { otp } });
        await new EmailProvider().sendMail(data.email, "Your OTP Code", "otp", { name: user.name ?? user.email, otp });
    }

    public async verifyOtp(data: z.infer<typeof VerifyOtpRequestDTO.schema>): Promise<{ success: boolean }> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user || user.otp !== data.otp) return { success: false };
        await this.prisma.user.update({ where: { email: data.email }, data: { otp: null, verified: true } });
        if (user.mfaEnabled && user.phoneNumber) {
            await new SmsProvider().sendSms(user.phoneNumber, `Your OTP code is: ${data.otp}`);
        }
        return { success: true };
    }

    public async resetPassword(data: z.infer<typeof ResetPasswordRequestDTO.schema>): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { email: data.email } });
        if (!user?.verified) throw new Error("this.prisma.user not verified");
        const hashed = await bcrypt.hash(data.newPassword, 10);
        await this.prisma.user.update({ where: { email: data.email }, data: { password: hashed } });
        await new EmailProvider().sendMail(data.email, "Password Reset Successful", "reset-password", { name: user.name ?? user.email });
    }

    public async me(userId: string): Promise<{ id: string; email: string; verified: boolean }> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("this.prisma.user not found");
        return { id: user.id, email: user.email, verified: user.verified };
    }

    public async findOrCreateOAuthUser(email: string, name?: string): Promise<{ id: string; email: string; verified: boolean }> {
        let user = await this.prisma.user.findUnique({ where: { email } });
        user ??= await this.prisma.user.create({ data: { email, name, verified: true } });
        return { id: user.id, email: user.email, verified: user.verified };
    }
}
