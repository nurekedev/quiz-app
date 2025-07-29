import axios, { type AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "./refreshToken";

export const CORE_API =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const createApiClient = (): AxiosInstance => {
	const client = axios.create({
		baseURL: CORE_API,
		timeout: 3000,
		withCredentials: true,
	});
	client.interceptors.request.use(
		async (config) => {
			if (config.url === "/auth/login/") return config;

			if (typeof window === "undefined" && config.headers.Authorization) {
				return config;
			}

			let token = Cookies.get("accessToken");

			if (!token) {
				token = (await refreshToken()).access_token;
			}

			config.headers.Authorization = `Bearer ${token}`;
			return config;
		},
		(error) => Promise.reject(error),
	);

	client.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (error.response?.status === 401) {
				Cookies.remove("accessToken");

				if (!originalRequest._retry) {
					originalRequest._retry = true;
					const refreshResult = await refreshToken();
					if (refreshResult?.access_token) {
						originalRequest.headers.Authorization = `Bearer ${refreshResult.access_token}`;
						return client(originalRequest);
					}
				}
			}

			throw error;
		},
	);
	return client;
};

export const coreClient = createApiClient();

export const authClient = axios.create({
	baseURL: CORE_API,
	timeout: 5000,
	withCredentials: true,
});

export const apiRequest = async <T>(
	method: "get" | "post" | "patch" | "delete" | "put",
	url: string,
	data?: unknown,
	client: "auth" | "core" = "core",
): Promise<T> => {
	try {
		const response = await (client === "auth" ? authClient : coreClient)[
			method
		](url, data ?? undefined);
		return response.data as T;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : String(error));
	}
};
