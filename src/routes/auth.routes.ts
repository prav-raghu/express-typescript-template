import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ValidateMiddleware } from "../middlewares/validate";
import {
    RegisterRequestDTO,
    LoginRequestDTO,
    RefreshRequestDTO,
    ForgotPasswordRequestDTO,
    VerifyOtpRequestDTO,
    ResetPasswordRequestDTO,
} from "../dtos/auth.request.dto";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
    private readonly router: Router;
    private readonly authController: AuthController;

    constructor() {
        this.router = Router();
        this.authController = new AuthController();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.post(
            "/register",
            ValidateMiddleware.validate(RegisterRequestDTO.schema),
            this.authController.register.bind(this.authController),
        );
        this.router.post(
            "/login",
            ValidateMiddleware.validate(LoginRequestDTO.schema),
            this.authController.login.bind(this.authController),
        );
        this.router.post(
            "/refresh",
            ValidateMiddleware.validate(RefreshRequestDTO.schema),
            this.authController.refresh.bind(this.authController),
        );
        this.router.post(
            "/forgot-password",
            ValidateMiddleware.validate(ForgotPasswordRequestDTO.schema),
            this.authController.forgotPassword.bind(this.authController),
        );
        this.router.post(
            "/verify-otp",
            ValidateMiddleware.validate(VerifyOtpRequestDTO.schema),
            this.authController.verifyOtp.bind(this.authController),
        );
        this.router.post(
            "/reset-password",
            ValidateMiddleware.validate(ResetPasswordRequestDTO.schema),
            this.authController.resetPassword.bind(this.authController),
        );
        this.router.get("/me", AuthMiddleware.authenticate(), async (request, result) => {
            await this.authController.me(request, result);
        });
        this.router.get("/oauth/:provider", this.authController.oauthStart.bind(this.authController));
        this.router.get("/oauth/:provider/callback", this.authController.oauthCallback.bind(this.authController));
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const authRoutes = new AuthRoutes().getRouter();
