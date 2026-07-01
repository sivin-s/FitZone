import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

// Separate hook exclusively for admin session.
// Reads only adminAccessToken — completely independent from useAuth (which reads userAccessToken).
export const useAdminAuth = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['auth-admin'],  // Separate cache key — never conflicts with ['auth-user']
        queryFn: async () => {
            // Only reads adminAccessToken cookie
            const response = await api.get('/auth/admin-me');
            return response.data.data; // { userId, role }
        },
        retry: false,
        staleTime: 1000 * 60 * 5
    });
    return {
        admin: data,
        isAdminAuthenticated: !!data,
        isLoading,
        isError: !!error
    };
};
