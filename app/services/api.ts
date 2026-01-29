// ===== app/services/api.ts =====
import type { ApiResponse } from "~/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface RequestConfig extends Omit<RequestInit, 'body'> {
  timeout?: number;
  body?: BodyInit | null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    
    if (import.meta.env.DEV) {
      console.log('🔧 API Client configured:', {
        baseURL: this.baseURL,
        useMocks: import.meta.env.VITE_USE_MOCKS || 'not set'
      });
    }
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T> | T> {
    const { timeout = 10000, headers, ...restConfig } = config;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...(headers as Record<string, string>),
    };

    const token = localStorage.getItem("auth-token");
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const fetchPromise = fetch(url, {
        ...restConfig,
        headers: requestHeaders,
        signal: controller.signal,
      });

      const response = await fetchPromise;
      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      const hasJsonContent = contentType && contentType.includes("application/json");

      let data: any;
      if (hasJsonContent) {
        try {
          data = await response.json();
          console.log('🎯 Raw API response:', data);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new ApiError(
            "Invalid JSON response from server",
            response.status
          );
        }
      } else {
        data = {
          success: false,
          error: `Server returned ${response.status}: ${response.statusText}`,
        };
      }

      if (!response.ok) {
        if (data && typeof data === 'object' && 'success' in data && !data.success) {
          throw new ApiError(
            data.errorMessage || data.error || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            data.code
          );
        }
        
        throw new ApiError(
          data.error || data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data.code
        );
      }

      // ✅ CORRECCIÓN CRÍTICA: Detectar tipo de respuesta correctamente
      if (hasJsonContent && data && typeof data === 'object') {
        // Detectar respuesta directa del backend real
        if ('currentDate' in data && 'currentTime' in data && 'transactionId' in data) {
          console.log('🎯 Backend real response detected');
          return data; // Devolver directamente sin envolver
        }
        
        // Detectar respuesta de MSW con success: false
        if ('success' in data && data.success === false) {
          throw new ApiError(
            data.errorMessage || data.error || 'Request failed',
            response.status
          );
        }
        
        // Detectar respuesta de MSW con success: true
        if ('success' in data && data.success === true) {
          console.log('🎯 MSW success response detected');
          return data;
        }
        
        // Si ya tiene la estructura de ApiResponse completa
        if ('success' in data && 'data' in data) {
          console.log('🎯 Standard ApiResponse detected');
          return data;
        }
        
        // Si no tiene success, asumir que es exitoso y envolver
        console.log('🎯 Raw data response, wrapping in ApiResponse');
        return {
          success: true,
          data: data,
        } as ApiResponse<T>;
      }

      return data;
    } catch (error) {
      console.error('🚨 API request error:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError("Request timeout");
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          "Network error - please check your connection"
        );
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Network error"
      );
    }
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T> | T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T> | T> {
    const requestConfig: RequestConfig = {
      ...config,
      method: "POST",
    };

    if (data !== undefined) {
      requestConfig.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, requestConfig);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T> | T> {
    const requestConfig: RequestConfig = {
      ...config,
      method: "PUT",
    };

    if (data !== undefined) {
      requestConfig.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, requestConfig);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T> | T> {
    const requestConfig: RequestConfig = {
      ...config,
      method: "PATCH",
    };

    if (data !== undefined) {
      requestConfig.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, requestConfig);
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T> | T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

export const apiClient = new HttpClient(API_BASE_URL);

export const setupApiInterceptors = () => {
  if (import.meta.env.DEV) {
    console.log("🔧 API interceptors configured");
  }
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred";
};

export const isApiSuccess = <T>(response: ApiResponse<T> | T): response is ApiResponse<T> & { success: true; data: T } => {
  return typeof response === 'object' && response !== null && 'success' in response && response.success === true && 'data' in response;
};

export const API_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
} as const;

export const COMMON_HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
  FORM: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  MULTIPART: {},
} as const;

export const createApiRequest = <T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: any;
    timeout?: number;
    headers?: Record<string, string>;
  } = {}
) => {
  const { method = 'GET', data, timeout, headers } = options;
  
  const config: RequestConfig = {};
  
  if (timeout !== undefined) {
    config.timeout = timeout;
  }
  
  if (headers !== undefined) {
    config.headers = headers;
  }

  switch (method) {
    case 'GET':
      return apiClient.get<T>(endpoint, config);
    case 'POST':
      return apiClient.post<T>(endpoint, data, config);
    case 'PUT':
      return apiClient.put<T>(endpoint, data, config);
    case 'PATCH':
      return apiClient.patch<T>(endpoint, data, config);
    case 'DELETE':
      return apiClient.delete<T>(endpoint, config);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
};

setupApiInterceptors();