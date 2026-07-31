import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoles, updateRolePermissions } from "../api/roles.js";

export const useRoles = () => {
  const queryClient = useQueryClient();
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ key, permissions }) => updateRolePermissions(key, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  return {
    roles: rolesQuery.data?.roles ?? [],
    permissions: rolesQuery.data?.permissions ?? [],
    isLoading: rolesQuery.isLoading,
    isError: rolesQuery.isError,
    error: rolesQuery.error,
    updateRolePermissions: updatePermissionsMutation.mutateAsync,
    isUpdating: updatePermissionsMutation.isPending,
  };
};
