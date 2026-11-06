import axios, { AxiosHeaders } from "axios";

export const AUTH_TOKEN_KEY = "pos_access_token";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl && !import.meta.env.DEV) {
  throw new Error("VITE_API_URL must be configured before starting the frontend");
}

export const API_BASE_URL = (configuredApiUrl || "http://localhost:8080/api").replace(/\/+$/, "");
const apiEndpoint = new URL(API_BASE_URL, globalThis.location?.origin || "http://localhost");

const resolveRequestUrl = (config) => {
  const baseUrl = new URL(
    config.baseURL || API_BASE_URL,
    globalThis.location?.origin || "http://localhost"
  );
  const requestUrl = config.url || "";

  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(requestUrl)) {
    return new URL(requestUrl, baseUrl);
  }

  const basePath = baseUrl.pathname.replace(/\/+$/, "");
  const requestPath = requestUrl.replace(/^\/+/, "");
  return new URL(`${basePath}/${requestPath}`, baseUrl.origin);
};

const isApiRequest = (config) => {
  const requestUrl = resolveRequestUrl(config);
  return requestUrl.origin === apiEndpoint.origin
    && (requestUrl.pathname === apiEndpoint.pathname
      || requestUrl.pathname.startsWith(`${apiEndpoint.pathname}/`));
};

const attachBearerToken = (config) => {
  if (!isApiRequest(config)) return config;

  const headers = AxiosHeaders.from(config.headers);
  const token = globalThis.sessionStorage?.getItem(AUTH_TOKEN_KEY);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers = headers;
  return config;
};

const handleUnauthorized = (error) => {
  if (error.response?.status === 401 && error.config && isApiRequest(error.config)) {
    globalThis.sessionStorage?.removeItem(AUTH_TOKEN_KEY);
    if (typeof Event !== "undefined") {
      globalThis.dispatchEvent?.(new Event("auth:unauthorized"));
    }
  }
  if (error.response?.status === 403 && error.config && isApiRequest(error.config)
    && typeof Event !== "undefined") {
    globalThis.dispatchEvent?.(new Event("permissions:forbidden"));
  }
  return Promise.reject(error);
};

axios.defaults.withCredentials = false;
axios.interceptors.request.use(attachBearerToken);
axios.interceptors.response.use((response) => response, handleUnauthorized);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

apiClient.interceptors.request.use(attachBearerToken);
apiClient.interceptors.response.use((response) => response, handleUnauthorized);
