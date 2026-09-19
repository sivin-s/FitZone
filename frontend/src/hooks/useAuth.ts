import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export const useAuth = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['auth-user'],
        queryFn: async () => {
            // Only reads userAccessToken cookie, and checks isBlocked in DB
            const response = await api.get('/auth/user-me');
            return response.data.data; // { userId, role }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
        // Only poll when already authenticated — prevents 401 loops on public pages (OTP, forgot-password etc.)
        refetchInterval: (query) => query.state.data ? 30 * 1000 : false,
    });
    return {
        user: data,
        isAuthenticated: !!data,
        isLoading,
        isError: !!error
    }
}