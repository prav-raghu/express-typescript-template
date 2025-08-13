import { z } from "zod";

export class RegisterRequestDTO {
    public static readonly schema = z.object({
        email: z.email(),
        password: z.string().min(8),
    });
    public static readonly type = RegisterRequestDTO.schema;
}
export type AuthRegisterRequest = z.infer<typeof RegisterRequestDTO.schema>;

export class LoginRequestDTO {
    public static readonly schema = z.object({
        email: z.email(),
        password: z.string(),
    });
    public static readonly type = LoginRequestDTO.schema;
}
export type AuthLoginRequest = z.infer<typeof LoginRequestDTO.schema>;

export class RefreshRequestDTO {
    public static readonly schema = z.object({
        refreshToken: z.string(),
    });
    public static readonly type = RefreshRequestDTO.schema;
}
export type AuthRefreshRequest = z.infer<typeof RefreshRequestDTO.schema>;

export class ForgotPasswordRequestDTO {
    public static readonly schema = z.object({
        email: z.email(),
    });
    public static readonly type = ForgotPasswordRequestDTO.schema;
}
export type AuthForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestDTO.schema>;

export class VerifyOtpRequestDTO {
    public static readonly schema = z.object({
        email: z.email(),
        otp: z.string().length(6),
        purpose: z.enum(["password_reset", "email_verify"]),
    });
    public static readonly type = VerifyOtpRequestDTO.schema;
}
export type AuthVerifyOtpRequest = z.infer<typeof VerifyOtpRequestDTO.schema>;

export class ResetPasswordRequestDTO {
    public static readonly schema = z.object({
        email: z.email(),
        otp: z.string().length(6),
        newPassword: z.string().min(8),
    });
    public static readonly type = ResetPasswordRequestDTO.schema;
}
export type AuthResetPasswordRequest = z.infer<typeof ResetPasswordRequestDTO.schema>;
