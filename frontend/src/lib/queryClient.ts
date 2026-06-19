import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            staleTime: 1000 * 60 * 5, // data is fresh for 5m
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
})