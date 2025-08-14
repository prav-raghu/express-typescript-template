import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { logger } from "../../config/logger";
import { DateTime } from "luxon";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    metadata?: { startTime: Date };
}

export class AxiosLogInterceptor {
    public static log(axiosInstance: AxiosInstance) {
        axiosInstance.interceptors.request.use(
            (config: CustomAxiosRequestConfig) => {
                config.metadata = { startTime: new Date() };
                return config;
            },
            (error) => {
                this.normalizeException(error);
            },
        );

        axiosInstance.interceptors.response.use(
            async (response) => {
                const endTime = new Date();
                const latency =
                    endTime.getTime() -
                        ((response.config as CustomAxiosRequestConfig)?.metadata?.startTime?.getTime() || endTime.getTime()) || 100;
                const contentType = response.headers?.["content-type"];
                const isJsonResponse = contentType?.includes("application/json");
                const responseData = isJsonResponse ? JSON.stringify(response.data) : response.data;
                logger.info("", {
                    method: response?.config?.method?.toUpperCase()!,
                    url: response.config?.url || "",
                    requestBody: response.config?.data,
                    response: responseData,
                    status: response.status,
                    latency: latency,
                    environment: process.env.LOG_ENV,
                    system: "external",
                    level: "info",
                    headers: response?.headers,
                });
                return response;
            },
            async (error) => {
                this.normalizeException(error);
            },
        );

        axiosInstance.interceptors.response.use(
            async (response) => {
                logger.info("", {
                    method: response.config?.method?.toUpperCase(),
                    url: response.config?.url,
                    requestBody: JSON.stringify(response.config?.data),
                    response: JSON.stringify(response.data),
                    status: response.status,
                    timestamp: DateTime.now().toISO(),
                    system: "external",
                    level: "info",
                    headers: JSON.stringify(response.config?.headers),
                });
                return response;
            },
            async (error: {
                response: { data: any; status?: any };
                message: any;
                code: any;
                name: any;
                config: { method: string; url: any; data: any };
            }) => {
                this.normalizeException(error);
            },
        );
    }

    public static normalizeException(error: Error | string): Promise<Error> {
        let errorMessage: string;
        if (typeof error === "string") {
            errorMessage = error;
        } else {
            errorMessage = JSON.stringify(error);
        }
        const normalizedError = error instanceof Error ? error : new Error(errorMessage);
        return Promise.reject(normalizedError);
    }
}
