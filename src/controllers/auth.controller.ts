import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/auth.service";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedUser } from "../models/authenticated-user.model";

export class AuthController {
    private readonly authService = new AuthService(new PrismaClient());

    public async register(request: Request, response: Response): Promise<Response> {
        try {
            const result = await this.authService.register(request.body);
            return response.json(result);
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }

    public async login(request: Request, response: Response): Promise<Response> {
        try {
            const result = await this.authService.login(request.body);
            return response.json(result);
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }

    public async refresh(request: Request, response: Response): Promise<Response> {
        try {
            const result = await this.authService.refresh(request.body);
            return response.json(result);
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }

    public async forgotPassword(request: Request, response: Response): Promise<Response> {
        try {
            await this.authService.forgotPassword(request.body);
            return response.status(StatusCodes.NO_CONTENT).send();
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }

    public async verifyOtp(request: Request, response: Response): Promise<Response> {
        try {
            const result = await this.authService.verifyOtp(request.body);
            return response.json(result);
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }

    public async resetPassword(request: Request, response: Response): Promise<Response> {
        try {
            await this.authService.resetPassword(request.body);
            return response.status(204).send();
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }

    public async me(request: Request, response: Response): Promise<Response> {
        try {
            const user = request?.user as AuthenticatedUser;
            if (!user) {
                return response.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
            const result = await this.authService.me(user.userId);
            return response.json(result);
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }

    public async oauthStart(request: Request, response: Response): Promise<void> {
        response.status(StatusCodes.NOT_IMPLEMENTED).send("Not implemented");
    }

    public async oauthCallback(request: Request, response: Response): Promise<void> {
        response.status(StatusCodes.NOT_IMPLEMENTED).send("Not implemented");
    }
}
