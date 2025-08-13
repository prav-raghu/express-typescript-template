import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

export class AxiosApi {
    public static get<T>(url: string): Promise<AxiosResponse<T>> {
        return axiosInstance.get<T>(url);
    }

    public static post<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
        return axiosInstance.post<T>(url, data);
    }

    public static delete<T>(url: string): Promise<AxiosResponse<T>> {
        return axiosInstance.delete<T>(url);
    }

    public static put<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
        return axiosInstance.put<T>(url, data);
    }

    public static patch<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
        return axiosInstance.patch<T>(url, data);
    }
}
