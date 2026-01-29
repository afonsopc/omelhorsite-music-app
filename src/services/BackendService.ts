export const BACKEND_URL = "http://192.168.50.240:1143";

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

export class ApiResponse<T> {
  constructor(
    public response: Response,
    public data: T,
  ) {
    this.response = response;
    this.data = data;
  }
}

export class ApiError extends Error {
  constructor(
    public response: Response,
    public error?: any,
  ) {
    super(`API Error: ${status}`);
    this.response = response;
    this.error = error;
  }
}

const transformNulls = (obj?: any): any => {
  if (!obj || typeof obj !== "object") return obj;

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

const stringifyParams = (params: Record<string, any>) => {
  const pairs: string[] = [];

  const processValue = (value: any, key: string, prefix: string | null) => {
    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          processObject(item, `${fullKey}[]`);
        } else {
          pairs.push(`${fullKey}[]=${item}`);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      processObject(value, fullKey);
    } else {
      pairs.push(`${fullKey}=${value}`);
    }
  };

  const processObject = (
    obj: Record<string, any>,
    prefix: string | null = null,
  ) => {
    for (const key of Object.keys(obj)) {
      processValue(obj[key], key, prefix);
    }
  };

  processObject(params);
  return pairs.join("&");
};

export const backend = async <T = any>(
  route: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
  data?: any,
  params?: any,
): Promise<ApiResponse<T>> => {
  const cleanRoute = route.startsWith("/") ? route.slice(1) : route;
  const url = new URL(BACKEND_URL + (cleanRoute ? "/" + cleanRoute : ""));
  let allParams = {};

  if (params) {
    allParams = { ...allParams, ...params };
  }

  if (data && method === "GET") {
    allParams = { ...allParams, ...data };
  }

  if (Object.keys(allParams).length > 0) {
    const transformedParams = transformNulls(allParams);
    const stringifiedParams = stringifyParams(transformedParams);
    url.search = stringifiedParams;
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
  };

  if (method !== "GET" && data) {
    options.body = JSON.stringify(transformNulls(data));
  }

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    throw new ApiError(response);
  }

  try {
    const responseData = await response.json();

    return new ApiResponse<T>(response, responseData);
  } catch (error) {
    throw new ApiError(response, error);
  }
};

export const getAuthenticatedBackendUrl = (
  route: string,
  params: Record<string, any> = {},
) => {
  let queryString = new URLSearchParams(params).toString();
  if (queryString) queryString = "&" + queryString;
  return BACKEND_URL + "/" + route + `?token=${authToken}${queryString}`;
};
