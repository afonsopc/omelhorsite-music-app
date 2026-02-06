import { Method, sendRequest } from "../lib/request";

export const BACKEND_URL = "https://omelhorsite.pt/backend";

export const FALLBACK_IMAGE_URL = "https://omelhorsite.pt/fallbackPhoto.jpg";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type ArrayOrSingle<T> = Prettify<T | T[]>;

export type SearchFilters<T = {}> = {
  [K in keyof T]?: ArrayOrSingle<T[K]>;
};

export type ModifierFilters = {
  page?: string;
  order?: string;
  random?: boolean;
};

export type ExactSearchFilters<T = {}> = {
  [K in keyof T]?: ArrayOrSingle<T[K]>;
};

export type ExtraOptionsFilters<T = {}> = {
  [K in keyof T]?: T[K];
};

export type ListFilters<T = {}, U = {}> = {
  search?: SearchFilters<T>;
  modifiers?: ModifierFilters;
  exact_search?: ExactSearchFilters<T>;
  extra_options?: ExtraOptionsFilters<U>;
};

const transformNulls = (obj?: any): any => {
  if (!obj || typeof obj !== "object") return obj;

  if (obj instanceof FormData) return obj;

  if (Array.isArray(obj)) {
    return obj.map((v) => (v === null ? "\b" : transformNulls(v)));
  }

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      v === null ? "\b" : transformNulls(v),
    ]),
  );
};

export const backend = <T = any>(
  route: string,
  method: Method,
  data?: any,
  params?: any,
  options?: {
    onUploadProgress?: (progressEvent: any) => void;
    responseType?: any;
  },
) => {
  let transformedData = transformNulls(data);
  let transformedParams = transformNulls(params);
  const actualParams =
    (transformedParams ?? method === Method.GET) ? transformedData : undefined;
  const actualBody = method === Method.GET ? undefined : transformedData;

  return sendRequest<T>({
    token: authToken ?? undefined,
    url: BACKEND_URL + "/" + route,
    method,
    body: actualBody,
    params: actualParams,
    onUploadProgress: options?.onUploadProgress,
    responseType: options?.responseType,
  });
};

export const getAuthenticatedBackendUrl = (
  route: string,
  params: Record<string, any> = {},
) => {
  let queryString = new URLSearchParams(params).toString();
  if (queryString) queryString = "&" + queryString;
  return BACKEND_URL + "/" + route + `?token=${authToken}${queryString}`;
};
