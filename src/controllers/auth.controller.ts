import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedUser } from "../models/authenticated-user.model";

export class AuthController {
    private readonly authService = new AuthService(new PrismaClient());

    public async register(request: Request, response: Response): Promise<Response> {
        const result = await this.authService.register(request.body);
        return response.json(result);
    }

    public async login(request: Request, response: Response): Promise<Response> {
        const result = await this.authService.login(request.body);
        return response.json(result);
    }

    public async refresh(request: Request, response: Response): Promise<Response> {
        const result = await this.authService.refresh(request.body);
        return response.json(result);
    }

    public async forgotPassword(request: Request, response: Response): Promise<Response> {
        await this.authService.forgotPassword(request.body);
        return response.status(204).send();
    }

    public async verifyOtp(request: Request, response: Response): Promise<Response> {
        const result = await this.authService.verifyOtp(request.body);
        return response.json(result);
    }

    public async resetPassword(request: Request, response: Response): Promise<Response> {
        await this.authService.resetPassword(request.body);
        return response.status(204).send();
    }

    public async me(request: Request, response: Response): Promise<Response> {
        const user = request?.user as AuthenticatedUser;
        if (!user) {
            return response.status(401).json({ error: "Unauthorized" });
        }
        const result = await this.authService.me(user.userId);
        return response.json(result);
    }

    public async oauthStart(request: Request, response: Response): Promise<void> {
        response.status(501).send("Not implemented");
    }

    public async oauthCallback(request: Request, response: Response): Promise<void> {
        response.status(501).send("Not implemented");
    }
}
