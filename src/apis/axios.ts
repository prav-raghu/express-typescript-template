import axios, { AxiosInstance, AxiosResponse } from "axios";
import { AxiosRequestInterceptor } from "./interceptors/axios-request.interceptor";
import { AxiosLogInterceptor } from "./interceptors/axios-log.interceptor";

export class AxiosApi {
    public axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            timeout: Number(process.env.AXIOS_TIMEOUT) || 10000,
            headers: {
                "Content-Type": process.env.AXIOS_CONTENT_TYPE || "application/json",
            },
            baseURL: process.env.AXIOS_BASE_URL || undefined,
        });
        AxiosRequestInterceptor.authorizationInterceptor(this.axiosInstance);
        AxiosLogInterceptor.log(this.axiosInstance);
    }

    public async get<T = unknown>(
        url: string,
        params?: Record<string, unknown> | null,
        headers?: Record<string, string>,
    ): Promise<AxiosResponse<T>> {
        const result = await this.axiosInstance.get<T>(url, {
            params,
            headers,
        });
        return result;
    }

    public async post<T = unknown, R = AxiosResponse<T>>(
        url: string,
        data: T,
        params?: Record<string, unknown>,
        headers?: Record<string, string>,
    ): Promise<R> {
        const result = await this.axiosInstance.post<T, R>(url, data, {
            params,
            headers,
        });
        return result;
    }

    public async put<T = unknown, R = AxiosResponse<T>>(
        url: string,
        data: T,
        params?: Record<string, unknown>,
        headers?: Record<string, string>,
    ): Promise<R> {
        const result = await this.axiosInstance.put<T, R>(url, data, {
            params,
            headers,
        });
        return result;
    }

    public async patch<T = unknown, R = AxiosResponse<T>>(
        url: string,
        data: T,
        params?: Record<string, unknown>,
        headers?: Record<string, string>,
    ): Promise<R> {
        const result = await this.axiosInstance.patch<T, R>(url, data, {
            params,
            headers,
        });
        return result;
    }

    public async delete<T = unknown>(
        url: string,
        params?: Record<string, unknown>,
        headers?: Record<string, string>,
    ): Promise<AxiosResponse<T>> {
        const result = await this.axiosInstance.delete<T>(url, {
            params,
            headers,
        });
        return result;
    }
}
