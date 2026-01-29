import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const secondsToMilliseconds = (seconds: number): number => {
  return seconds * 1000;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: secondsToMilliseconds(25),
    },
  },
});

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
