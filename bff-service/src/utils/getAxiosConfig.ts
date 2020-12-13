import { AxiosRequestConfig, Method } from "axios";

export const getAxiosConfig = (serviceUrl: string, originalUrl: string, method: Method, data: any): AxiosRequestConfig => {
  return {
    method,
    url: `${serviceUrl}${originalUrl}`,
    ...Object.keys(data || {}).length > 0 && { data }
  }
};
