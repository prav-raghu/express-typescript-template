import { Router } from "express";
import { PingController } from "../controllers/ping.controller";

export class PingRoute {
    private readonly router: Router;
    private readonly controller: PingController;

    constructor() {
        this.router = Router();
        this.controller = new PingController();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.use("/", this.controller.ping);
    }

    public getRouter(): Router {
        return this.router;
    }
}

export const pingRoutes = new PingRoute().getRouter();
