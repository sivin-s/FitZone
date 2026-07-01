import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '../lib/axios';
import Toast from '../components/Toast';
import { GoogleLogin } from '@react-oauth/google'

//  Zod Schema for react form - custom
const loginSchema = z.object({
    email: z.email('Invalid email address').min(1, 'Email is required').refine((value) => !/\s/.test(value), {
        message: 'Email cannot contain spaces',
    }),
    password: z.string().min(1, 'Password is required').refine((val) => !/\s/.test(val), {
        message: 'Password must not contain spaces',
    }),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginLocationState = {
    from?: { pathname: string };
};

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();

    // toast — pre-fill if redirected because account was blocked
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reason') === 'blocked') {
            setToast({
                show: true,
                message: 'Your account has been blocked by an administrator. Please contact support.',
                type: 'error'
            });
        }
    }, [location.search]);



    const from = (location.state as LoginLocationState | null)?.from?.pathname ?? '/dashboard';

    const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema) // custom validation
    })




    // stable reference so Toast's useEffect doesn't re-run on every render
    const closeToast = useCallback(() => setToast(prev => ({ ...prev, show: false })), []);

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const response = await api.post('/auth/login', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth-user'] });
            setToast({ show: true, message: 'Welcome back! Redirecting to your dashboard...', type: 'success' });
            setTimeout(() => navigate(from, { replace: true }), 1500);
        },
        onError: (error: unknown) => {
            const message = getApiErrorMessage(error, 'Invalid email or password.');
            // Show toast for blocked accounts, inline error for wrong credentials
            if (message.toLowerCase().includes('blocked')) {
                setToast({ show: true, message, type: 'error' });
            } else {
                setError('password', { type: 'manual', message });
            }
        },
    });


    // google
    const googleLoginMutation = useMutation({
        mutationFn: async (idToken: string) => {
            const response = await api.post('/auth/google', { idToken });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth-user'] });
            setToast({ show: true, message: 'Google login successful! Redirecting...', type: 'success' });
            setTimeout(() => navigate(from, { replace: true }), 1500);
        },
        onError: (error: unknown) => {
            const message = getApiErrorMessage(error, 'Google login failed. Please try again.');
            setToast({ show: true, message, type: 'error' });
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data)
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            {/* toast */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-xl font-bold text-black">FitZone</Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">Login</Link>
                            <Link to="/register" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                            <p className="text-gray-600">Enter your details to access your dashboard.</p>
                        </div>


                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    className={`w-full px-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition duration-200 ${errors.email ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'}`}
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <span className="block text-red-500 text-sm mt-1">{errors.email.message}</span>
                                )}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                                    {/* forgot-password */}
                                    <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 border text-black  rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none pr-12 transition duration-200 text-black ${errors.password ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300'}`}
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="block text-red-500 text-sm mt-1">{errors.password.message}</span>
                                )}
                            </div>
                            {/* submit btn  */}
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className={`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 ${loginMutation.isPending ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>


                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            {/* Google Login Button */}
                            <div className="flex justify-center [&>div]:w-full">
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        const idToken = credentialResponse.credential;
                                        if (idToken) {
                                            googleLoginMutation.mutate(idToken);
                                        }
                                    }}
                                    onError={() => {
                                        setToast({ show: true, message: 'Google login cancelled or failed.', type: 'error' });
                                    }}
                                    theme="outline"
                                    size="large"
                                    text="signin_with"
                                    shape="rectangular"
                                />
                            </div>

                            {/* Sign Up Link */}
                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-gray-900 font-medium hover:underline">Sign Up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <div className="text-xl font-bold mb-1 text-black">FitZone</div>
                            <p className="text-sm text-gray-600">© 2024 FitZone. All rights reserved. High-Performance Clarity.</p>
                        </div>
                        <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                            <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
                            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link>
                            <Link to="/support" className="text-gray-600 hover:text-gray-900">Contact Support</Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
}