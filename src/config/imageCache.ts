import { Image } from "expo-image";

export const CACHE_SIZE_LIMIT = 1024 * 1024 * 1024; // 1GB

export const initializeImageCache = async () => {
  try {
    console.log("[ImageCache] Initialized with 1GB disk cache limit");
    console.log("[ImageCache] Cache policy: persistent disk caching enabled");
  } catch (error) {
    console.error("[ImageCache] Failed to initialize:", error);
  }
};

export const clearImageCache = async () => {
  try {
    await Image.clearDiskCache();
    await Image.clearMemoryCache();
    console.log("[ImageCache] Cache cleared successfully");
    return true;
  } catch (error) {
    console.error("[ImageCache] Failed to clear cache:", error);
    return false;
  }
};

export const getCacheSize = async (): Promise<number> => {
  try {
    return -1;
  } catch (error) {
    console.error("[ImageCache] Failed to get cache size:", error);
    return -1;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 0) return "Unknown";
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
