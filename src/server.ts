import { env } from "./config/env";
import { logger } from "./config/logger";
import { App } from "./app";

const port = env.APP_PORT || 3000;
const app = new App().app;

app.listen(port, () => {
    const fs = require("fs");
    const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
    logger.info(`Server running on port ${port}`);
    console.info(`🤖 Service Running\n🔢 Version: ${packageJson.version}\n🔌 Port: ${port}`);
    if (env.NODE_ENV === "development") {
        console.info(`📝 Variables Applied:\n ${JSON.stringify(process.env)}`);
    }
});
