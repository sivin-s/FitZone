import axios, { isAxiosError } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

export const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // cookies
    headers: {
        'Content-Type': 'application/json'
    }
})

//  performs the token refresh
const refreshAuthLogic = async (failedRequest: any) => {
    try {
        await api.post('/auth/refresh-token');
        return Promise.resolve(); // if it has no value it mark as 'fulfilled'.
    } catch (error) {
        // if reject -> redirect to login page
        console.warn("session expired. Redirecting to login")
        window.location.href = '/login';
        return Promise.reject(error);
    }
}

createAuthRefreshInterceptor(api, refreshAuthLogic, {
    statusCodes: [401], // trigger refresh only on 401 unauthorized.
    // Queues all subsequent requests while refreshing(pause the request)
})

// api.interceptors.response.use( // middleware
//     (response) => response,
//     (error)=>{
//         if(error.response?.status === 401){
//             console.warn('Session expired. Redirecting to login.')
//             //todo: redirect pending react router
//         }
//         return Promise.reject(error);
//     }
// )

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (typeof message === 'string') return message;
    }
    return fallback;
}