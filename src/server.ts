import { createServer } from "http";
import { env } from "./config/env";
import { Server as WebSocketServer, WebSocket } from "ws";
import { App } from "./app";
import { Application } from "express";

class Server {
    private readonly port: number;
    private readonly app: Application;
    private readonly server: ReturnType<typeof createServer>;
    private readonly wss: WebSocketServer;

    constructor() {
        this.port = env.APP_PORT || 3000;
        this.app = new App().app;
        this.server = createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server });
    }

    private startSocketServer(): void {
        this.wss.on("connection", (ws: WebSocket) => {
            console.info("📢 WebSocket client connected");
            ws.on("message", (message: string) => {
                console.info(`Received message: ${message}`);
                ws.send(`Echo: ${message}`);
            });
            ws.send("Welcome to WebSocket server!");
        });
    }

    private startHttpServer(): void {
        this.server.listen(this.port, () => {
            const fs = require("fs");
            const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
            console.info(`Server running on port ${this.port}`);
            console.info(`🌐 HTTP Server Running\n🔢 Version: ${packageJson.version}\n🔌 Port: ${this.port}`);
            if (env.NODE_ENV === "development") {
                console.info(`🛠️ Development Mode Enabled`);
                console.info(`💻 URL: http://localhost:${this.port}`);
                console.info(`📃 Documentation: http://localhost:${this.port}/doc`);
                console.info(`📝 Environment Variables:\n ${JSON.stringify(env, null, 2)}`);
            }
        });
    }

    public start(): void {
        this.startHttpServer();
        this.startSocketServer();
    }
}

const mainServer = new Server();
mainServer.start();
