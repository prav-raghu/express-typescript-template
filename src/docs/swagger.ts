import swaggerJSDoc, { Options, SwaggerDefinition } from "swagger-jsdoc";

export class SwaggerConfig {
    private readonly options: Options;

    constructor() {
        this.options = {
            definition: this.createDefinition(),
            apis: ["./src/routes/*.ts", "./src/dtos/*.ts"],
        };
    }

    private createDefinition(): SwaggerDefinition {
        return {
            openapi: "3.0.0",
            info: {
                title: "Express TypeScript API",
                version: "1.0.0",
                description: "Production-grade Express.js + TypeScript API",
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
            security: [{ bearerAuth: [] }],
        };
    }

    public getSpec() {
        return swaggerJSDoc(this.options);
    }
}

export const swaggerSpec = new SwaggerConfig().getSpec();
