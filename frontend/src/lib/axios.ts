import axios, { isAxiosError } from 'axios';

export const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // cookies
    headers:{
      'Content-Type': 'application/json'
    }
})

api.interceptors.response.use(
    (response) => response,
    (error)=>{
        if(error.response?.status === 401){
            console.warn('Session expired. Redirecting to login.')
            // redirect pending react router
        }
        return Promise.reject(error);
    }
)

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (typeof message === 'string') return message;
    }
    return fallback;
}