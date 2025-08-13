import pino, { Logger, LoggerOptions } from "pino";

class LoggerService {
    private readonly logger: Logger;

    constructor() {
        const isDev = process.env.NODE_ENV !== "production";
        const options: LoggerOptions = {
            level: isDev ? "debug" : "info",
            transport: isDev
                ? {
                      target: "pino-pretty",
                      options: { colorize: true },
                  }
                : undefined,
        };
        this.logger = pino(options);
    }

    public info(msg: string, ...args: unknown[]) {
        this.logger.info(msg, ...(args as undefined[]));
    }

    public debug(msg: string, ...args: unknown[]) {
        this.logger.debug(msg, ...(args as undefined[]));
    }

    public error(msg: string, ...args: unknown[]) {
        this.logger.error(msg, ...(args as undefined[]));
    }

    public warn(msg: string, ...args: unknown[]) {
        this.logger.warn(msg, ...(args as undefined[]));
    }

    public fatal(msg: string, ...args: unknown[]) {
        this.logger.fatal(msg, ...(args as undefined[]));
    }
}

export const logger = new LoggerService();
