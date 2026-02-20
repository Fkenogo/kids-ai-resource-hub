import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { resolveDataUserId } from '@/services/backend/auth';
import { readMany } from '@/services/backend/firestoreDb';

export const useAdminAccess = () => {
  const { user, loading: authLoading } = useAuthContext();

  const { data: hasAccess = false, isLoading: roleLoading } = useQuery({
    queryKey: ['admin-access', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const dataUserId = await resolveDataUserId(user);
      if (!dataUserId) {
        return false;
      }

      const roles = await readMany('user_roles', {
        filters: [{ field: 'user_id', op: '==', value: dataUserId }],
      });
      return roles.some((entry: Record<string, unknown>) => entry.role === 'admin' || entry.role === 'moderator');
    },
  });

  return {
    isAuthenticated: !!user,
    hasAccess,
    isCheckingAccess: authLoading || (!!user && roleLoading),
  };
};
