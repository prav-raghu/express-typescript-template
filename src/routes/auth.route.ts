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
        /**
         * @swagger
         * /auth/register:
         *   post:
         *     summary: Register a new user
         *     tags:
         *       - Auth
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RegisterRequestDTO'
         *     responses:
         *       200:
         *         description: Registration successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 user:
         *                   type: object
         *                 token:
         *                   type: string
         */
        this.router.post(
            "/register",
            ValidateMiddleware.validate(RegisterRequestDTO.schema),
            this.authController.register.bind(this.authController),
        );
        /**
         * @swagger
         * /auth/login:
         *   post:
         *     summary: Login a user
         *     tags:
         *       - Auth
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/LoginRequestDTO'
         *     responses:
         *       200:
         *         description: Login successful
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 user:
         *                   type: object
         *                 token:
         *                   type: string
         */
        this.router.post(
            "/login",
            ValidateMiddleware.validate(LoginRequestDTO.schema),
            this.authController.login.bind(this.authController),
        );
        /**
         * @swagger
         * /auth/refresh:
         *   post:
         *     summary: Refresh authentication token
         *     tags:
         *       - Auth
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RefreshRequestDTO'
         *     responses:
         *       200:
         *         description: Token refreshed
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 token:
         *                   type: string
         */
        this.router.post(
            "/refresh",
            ValidateMiddleware.validate(RefreshRequestDTO.schema),
            this.authController.refresh.bind(this.authController),
        );
        /**
         * @swagger
         * /auth/forgot-password:
         *   post:
         *     summary: Request password reset
         *     tags:
         *       - Auth
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ForgotPasswordRequestDTO'
         *     responses:
         *       204:
         *         description: Password reset email sent
         */
        this.router.post(
            "/forgot-password",
            ValidateMiddleware.validate(ForgotPasswordRequestDTO.schema),
            this.authController.forgotPassword.bind(this.authController),
        );
        /**
         * @swagger
         * /auth/verify-otp:
         *   post:
         *     summary: Verify OTP for password reset
         *     tags:
         *       - Auth
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/VerifyOtpRequestDTO'
         *     responses:
         *       200:
         *         description: OTP verified
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 success:
         *                   type: boolean
         */
        this.router.post(
            "/verify-otp",
            ValidateMiddleware.validate(VerifyOtpRequestDTO.schema),
            this.authController.verifyOtp.bind(this.authController),
        );
        /**
         * @swagger
         * /auth/reset-password:
         *   post:
         *     summary: Reset password
         *     tags:
         *       - Auth
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ResetPasswordRequestDTO'
         *     responses:
         *       204:
         *         description: Password reset successful
         */
        this.router.post(
            "/reset-password",
            ValidateMiddleware.validate(ResetPasswordRequestDTO.schema),
            this.authController.resetPassword.bind(this.authController),
        );
        /**
         * @swagger
         * /auth/me:
         *   get:
         *     summary: Get current authenticated user
         *     tags:
         *       - Auth
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: Current user info
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 user:
         *                   type: object
         *       401:
         *         description: Unauthorized
         */
        this.router.get("/me", AuthMiddleware.authenticate(), async (request, result) => {
            await this.authController.me(request, result);
        });
        /**
         * @swagger
         * /auth/oauth/{provider}:
         *   get:
         *     summary: Start OAuth flow
         *     tags:
         *       - Auth
         *     parameters:
         *       - in: path
         *         name: provider
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       501:
         *         description: Not implemented
         */
        this.router.get("/oauth/:provider", this.authController.oauthStart.bind(this.authController));
        /**
         * @swagger
         * /auth/oauth/{provider}/callback:
         *   get:
         *     summary: OAuth callback endpoint
         *     tags:
         *       - Auth
         *     parameters:
         *       - in: path
         *         name: provider
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       501:
         *         description: Not implemented
         */
        this.router.get("/oauth/:provider/callback", this.authController.oauthCallback.bind(this.authController));
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const authRoutes = new AuthRoutes().getRouter();
