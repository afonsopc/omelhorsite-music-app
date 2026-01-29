import AsyncStorage from "@react-native-async-storage/async-storage";
import { backend, setAuthToken } from "./BackendService";

const STORAGE_KEY = "music_app_token";

const storage = {
  set: async (token: string) => {
    await AsyncStorage.setItem(STORAGE_KEY, token);
  },
  get: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(STORAGE_KEY);
  },
  remove: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};

storage.get().then((token) => {
  if (token) {
    setAuthToken(token);
  }
});

export type User = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  user_id: string;
  token: string;
  device_info: string;
  last_used_at: string;
  created_at: string;
  user: User;
};

export const Session = {
  create: (email: string, password: string) =>
    backend<Session>("sessions", "POST", {
      email,
      password,
    }).then((response) => response.data),
  destroy: (sessionId: string) =>
    backend<void>(`sessions/${sessionId}`, "DELETE").then(
      (response) => response.data,
    ),
  getCurrent: () =>
    backend<Session>("sessions/mine", "GET").then((response) => response.data),
  login: async (email: string, password: string) => {
    const session = await backend<Session>("sessions", "POST", {
      email,
      password,
    }).then((response) => response.data);
    await storage.set(session.token);
    setAuthToken(session.token);
    return session;
  },
  logout: async () => {
    const token = await storage.get();
    if (token) {
      const session = await backend<Session>("sessions/mine", "GET").then(
        (response) => response.data,
      );
      if (session) {
        await backend<void>(`sessions/${session.id}`, "DELETE").then(
          (response) => response.data,
        );
      }
    }
    await storage.remove();
    setAuthToken(null);
  },
  getToken: () => storage.get(),
  isAuthenticated: async () => !!(await storage.get()),
  is: (variable: any): variable is Session => {
    return (
      !!variable &&
      typeof variable === "object" &&
      "token" in variable &&
      "user_id" in variable
    );
  },
};

export const User = {
  is: (variable: any): variable is User => {
    return (
      !!variable &&
      typeof variable === "object" &&
      "email" in variable &&
      "name" in variable
    );
  },
};
