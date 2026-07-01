import axios, { AxiosError, isAxiosError } from 'axios';
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
    const publicPaths = ['/', '/login', '/register', '/admin/login', '/forgot-password', '/verify-otp'];
    if (publicPaths.includes(window.location.pathname)) {
        return Promise.reject(new Error("Skipping token refresh on public routes."));
    }

    try {
        await api.post('/auth/refresh-token');
        return Promise.resolve(); // if it has no value it mark as 'fulfilled'.
    } catch (error) {
        // Check if the failure is because the account was blocked
        const message: string = isAxiosError(error)
            ? (error.response?.data?.message ?? '')
            : '';

        const isBlocked = message.toLowerCase().includes('blocked');
        console.warn("session expired. Redirecting to login");
        window.location.href = isBlocked ? '/login?reason=blocked' : '/login';
        return Promise.reject(error);
    }
}

createAuthRefreshInterceptor(api, refreshAuthLogic, {
    shouldRefresh: (error) => {
        // Trigger refresh only on 401 unauthorized.
        if (error.response?.status !== 401) {
            return false;
        }

        const url = error.config?.url;
        return !(
            url?.includes('/auth/login') ||
            url?.includes('/auth/register') ||
            url?.includes('/auth/google') ||
            url?.includes('/auth/forgot-password') ||
            url?.includes('/auth/reset-password') ||
            url?.includes('/auth/verify-otp')
        );
    }
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
        console.log("message1 > ",  message)
        console.log("message2 > ", typeof  message)
        const errMessage  = JSON.parse(message) as Array<{field: string, message: string}>;
        console.log("message3 > ", errMessage?.at(0)?.message)
        if (typeof message === 'string') return errMessage?.at(0)?.message as string;
    }
    return fallback;
}