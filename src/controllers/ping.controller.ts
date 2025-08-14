import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export class PingController {
    public async ping(request: Request, response: Response): Promise<Response> {
        try {
            return response.status(StatusCodes.OK).json({ message: "pong" });
        } catch (exception) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ data: exception.stack });
        }
    }
}
