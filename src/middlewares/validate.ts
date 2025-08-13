import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export class ValidateMiddleware {
    public static validate(schema: ZodType<unknown>) {
        return (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({ errors: result.error.issues });
                return;
            }
            next();
        };
    }
}
