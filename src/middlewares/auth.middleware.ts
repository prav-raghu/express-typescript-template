import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { AuthenticatedUser } from "../models/authenticated-user.model";

export class AuthMiddleware {
    public static authenticate(strategy: "local" | "google" | "facebook" = "local") {
        return async (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate(strategy, { session: false }, (err: unknown, user: Express.User | false, info: unknown) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                req.user = user as AuthenticatedUser;
                return next();
            })(req, res, next);
        };
    }
}
