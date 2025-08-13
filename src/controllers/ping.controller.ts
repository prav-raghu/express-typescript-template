import { Request, Response } from "express";

export class PingController {
    public async ping(request: Request, response: Response): Promise<Response> {
        return response.json({ message: "pong" });
    }
}
