import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import { logger } from "./config/logger";
import { SwaggerConfig } from "./docs/swagger";

export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.setupSwagger();
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
    }

    private setupSwagger(): void {
        const swaggerSpec = new SwaggerConfig().init();
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    private initializeRoutes(): void {
        this.app.use(routes);
    }
}
