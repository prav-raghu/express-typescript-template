import swaggerJSDoc, { Options } from "swagger-jsdoc";

export class SwaggerConfig {
    private readonly options: Options;

    constructor() {
        this.options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "Express TypeScript API",
                    version: "1.0.0",
                },
            },
            apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
        };
    }

    public init() {
        const swaggerSpec = swaggerJSDoc(this.options);
        return swaggerSpec;
    }
}
