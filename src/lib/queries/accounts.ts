import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "../../services/AccountService";

export const GET_CURRENT_SESSION = "getCurrentSession";

export const useGetCurrentSessionQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: [GET_CURRENT_SESSION],
    queryFn: async () => {
      return Session.getCurrent();
    },
    enabled: options?.enabled,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return Session.login(email, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CURRENT_SESSION] });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return Session.logout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_CURRENT_SESSION] });
      queryClient.clear();
    },
  });
};
