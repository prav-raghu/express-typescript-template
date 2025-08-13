import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { swaggerSpec } from "./docs/swagger";
import { logger } from "./config/logger";

export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
        this.app.use((req, res, next) => {
            logger.info("Incoming request", { req });
            next();
        });
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    private initializeRoutes(): void {
        this.app.use(routes);
    }
}
