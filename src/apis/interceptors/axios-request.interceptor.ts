import { AxiosInstance } from "axios";

export class AxiosRequestInterceptor {
    public static authorizationInterceptor(axiosInstance: AxiosInstance) {
        axiosInstance.interceptors.request.use((config) => {
            config.headers["Authorization"] = `Bearer ${process.env.API_GATEWAY_SUBSCRIPTION_KEY}`;
            return config;
        });
    }
}
