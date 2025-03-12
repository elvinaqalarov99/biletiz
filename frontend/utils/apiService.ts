import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiService {
    private static instance: ApiService;
    private readonly api: AxiosInstance;
    private isRefreshing: boolean = false;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.initializeInterceptors();
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }

        return ApiService.instance;
    }

    private initializeInterceptors() {
        // Attach Bearer token to requests
        this.api.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error),
        );

        // Handle token refresh and retries
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest: AxiosRequestConfig = error.config;

                if (originalRequest?.headers && error?.response?.status === 401) {
                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        try {
                            await this.refreshToken();

                            // Retry the original request
                            return this.api(originalRequest);
                        } catch (refreshError) {
                            // Handle token refresh error
                            // You can clear all storage and redirect the user to the login page
                            throw refreshError;
                        } finally {
                            this.isRefreshing = false;
                        }
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private async refreshToken(): Promise<string> {
        const { data } = await this.api.post('/auth/refresh-token');

        return data.accessToken;
    }

    // Add other HTTP methods as needed...

    public getAxiosInstance() {
        return this.api;
    }
}

export const apiService = ApiService.getInstance();