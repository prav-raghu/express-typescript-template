import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export class ErrorHandlerMiddleware {
    public static handle(err: Error, req: Request, res: Response, next: NextFunction): void {
        logger.error("Error", err);
        res.status(500).json({
            error: {
                message: err.message,
                name: err.name,
            },
        });
    }
}
