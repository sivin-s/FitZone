import {useQuery} from '@tanstack/react-query';
import { api } from '../lib/axios';

export const useAuth = ()=>{
    const {data, isLoading, error} = useQuery({
        queryKey: ['auth-user'], // for cache
        queryFn: async ()=>{
            const response = await api.get('/user/profile');
            return response.data.data;
        },
        retry: false,
        staleTime: 1000 * 60 * 5
    });
    return{
        user: data,
        isAuthenticated: !!data,
        isLoading,
        isError: !!error
    }
}