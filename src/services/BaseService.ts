import { AxiosError, AxiosResponse } from "axios";
import { ApiClient } from "../config/ApiClient";

export class BaseService {
  protected async get<T>(url: string, signal?: AbortSignal): Promise<T> {
    try {
      const response: AxiosResponse<T> = await ApiClient.get(url, { signal });
      return response.data;
    } catch (error) {
      this.handleError("GET", url, error);
      throw error;
    }
  }

  protected async post<T, D = unknown>(
    url: string,
    data?: D,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await ApiClient.post(url, data, {
        signal,
      });
      return response.data;
    } catch (error) {
      this.handleError("POST", url, error);
      throw error;
    }
  }

  protected async put<T, D = unknown>(
    url: string,
    data?: D,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await ApiClient.put(url, data, {
        signal,
      });
      return response.data;
    } catch (error) {
      this.handleError("PUT", url, error);
      throw error;
    }
  }

  protected async delete<T>(
    url: string,
    data?: unknown,
    signal?: AbortSignal
  ): Promise<T | void> {
    try {
      const config = {
        ...(data ? { data } : {}),
        signal,
      };
      const response: AxiosResponse<T> = await ApiClient.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError("DELETE", url, error);
      throw error;
    }
  }

  protected async getWithRetry<T>(
    url: string,
    retries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await this.get<T>(url);
      } catch (error) {
        lastError = error;
        if (attempt < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  protected async postMultipartFormData<T, D = unknown>(
    url: string,
    data?: D,
    signal?: AbortSignal
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await ApiClient.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal,
      });
      return response.data;
    } catch (error) {
      this.handleError("POST", url, error);
      throw error;
    }
  }

  protected async getBlob(url: string): Promise<Blob> {
    try {
      const response: AxiosResponse<Blob> = await ApiClient.get(url, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      this.handleError("GET", url, error);
      throw error;
    }
  }

  protected createCancellableRequest<T>(
    requestFn: (signal: AbortSignal) => Promise<T>
  ): { request: Promise<T>; cancel: () => void } {
    const controller = new AbortController();
    const request = requestFn(controller.signal);

    return {
      request,
      cancel: () => controller.abort(),
    };
  }

  private handleError(method: string, url: string, error: unknown): void {
    if (error instanceof AxiosError) {
      console.error(
        `API ${method} request failed for ${url}:`,
        error.response?.status,
        error.response?.data
      );
    } else {
      console.error(`API ${method} request failed for ${url}:`, error);
    }
  }
}
