import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { api, getApiErrorMessage } from '../lib/axios';
import { GoogleLogin } from '@react-oauth/google';

const signupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').min(1, 'Username is required'),
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s])\S{8,}$/,
            'Password must contain uppercase, lowercase, number, and special character'
        ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUpPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Google Login Mutation
    const googleLoginMutation = useMutation({
        mutationFn: async (idToken: string) => {
            const response = await api.post('/auth/google', { idToken });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth-user'] });
            navigate('/dashboard', { replace: true });
        },
        onError: (error: unknown) => {
            const message = getApiErrorMessage(error, 'Google sign up failed. Please try again.');
            showToast(message, 'error');
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setError,
        reset,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onBlur',
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const signupMutation = useMutation({
        mutationFn: async (data: SignupFormData) => {
            const response = await api.post('/auth/register', {
                username: data.username,
                email: data.email,
                password: data.password,
            });
            return response.data;
        },
         onSuccess: (_data,variables) => {
      showToast('Account created! Please check your email for the OTP.', 'success');
      reset();
      setTimeout(() =>{
         navigate('/verify-otp',{state:{email: variables.email}})
        }, 1500);
    },
        onError: (error: unknown) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const apiMessage: string = error.response?.data?.message ?? '';

        if (status === 409) {
          setError('email', { type: 'manual', message: 'Email already registered.' });
          return;
        }

        // Parse structured validation errors from the backend and set field-level errors
        if (status === 400 && apiMessage.startsWith('Validation failed:')) {
          try {
            const jsonPart = apiMessage.replace('Validation failed:', '').trim();
            const validationErrors: { field: string; message: string }[] = JSON.parse(jsonPart);
            let hasFieldError = false;
            validationErrors.forEach(({ field, message }) => {
              // field comes as e.g. "body.password" — strip the "body." prefix
              const formField = field.replace(/^body\./, '') as keyof SignupFormData;
              if (['username', 'email', 'password', 'confirmPassword'].includes(formField)) {
                setError(formField, { type: 'manual', message });
                hasFieldError = true;
              }
            });
            if (hasFieldError) return;
          } catch {
            // JSON parse failed — fall through to generic toast
          }
        }
      }

      const message = getApiErrorMessage(error, 'Registration failed. Please try again.');
      showToast(message, 'error');
    },
    });
// submit 
    const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  // css css  - for error
  const getInputClass = (fieldName: keyof SignupFormData) => {
    const baseClass = "w-full px-4 py-3 rounded-lg border text-gray-900 placeholder-gray-400 text-base transition duration-200 outline-none focus:ring-1 ";
    if (errors[fieldName]) return `${baseClass} border-red-600 focus:border-red-600 focus:ring-red-600`;
    if (touchedFields[fieldName] && !errors[fieldName]) return `${baseClass} border-green-600 focus:border-green-600 focus:ring-green-600`;
    return `${baseClass} border-gray-200 focus:border-black focus:ring-black`;
  };


    return (
        <div className="min-h-screen flex flex-col text-gray-900 bg-[#f8f8ff] font-sans">
            {toast && (
                <div className={`fixed top-6 right-6 p-4 rounded-lg text-white font-medium z-50 transition-all duration-300 transform translate-x-0 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}

            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-xl font-bold tracking-tight text-black">
                            FitZone
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-gray-600 hover:text-black font-medium text-sm sm:text-base transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-black text-white px-5 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-900 transition-colors active:scale-95">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center px-4P sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="text-center mb-6">
                    <h1 className="text-3xl   sm:text-4xl font-bold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-500 text-base">Join the high-performance community.</p>
                </div>

                <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="fitness_enthusiast"
                                className={getInputClass('username')}
                                autoComplete="username"
                                {...register('username')}
                            />
                            {errors.username && (
                                <span className="block text-red-600 text-xs mt-1">
                                    {errors.username.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                className={getInputClass('email')}
                                autoComplete="email"
                                {...register('email')}
                            />
                            {errors.email && (
                                <span className="block text-red-600 text-xs mt-1">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="••••••••"
                                    className={getInputClass('password')}
                                    autoComplete="new-password"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-black transition-colors"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" x2="22" y1="2" y2="22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="block text-red-600 text-xs mt-1">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    className={getInputClass('confirmPassword')}
                                    autoComplete="new-password"
                                    {...register('confirmPassword')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:text-black transition-colors"
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" x2="22" y1="2" y2="22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="block text-red-600 text-xs mt-1">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={signupMutation.isPending}
                            className={`w-full bg-black text-white py-3 rounded-lg font-medium text-base mb-6 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:bg-neutral-900 ${signupMutation.isPending ? 'opacity-80 cursor-not-allowed' : ''}`}
                        >
                            {signupMutation.isPending ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>

                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-6 before:flex-1 before:h-px before:bg-gray-200 after:flex-1 after:h-px after:bg-gray-200">
                            <span>Or continue with</span>
                        </div>

                        <div className="flex justify-center [&>div]:w-full">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    const idToken = credentialResponse.credential;
                                    if (idToken) {
                                        googleLoginMutation.mutate(idToken);
                                    }
                                }}
                                onError={() => {
                                    showToast('Google authentication cancelled or failed.', 'error');
                                }}
                                theme="outline"
                                size="large"
                                text="signup_with"
                                shape="rectangular"
                            />
                        </div>
                    </form>
                </div>

                <p className="mt-6 text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gray-900 font-medium underline underline-offset-2 hover:text-black transition-colors">
                        Login
                    </Link>
                </p>

                <div className="w-full max-w-md mt-10 sm:mt-12">
                    <div className="relative rounded-xl overflow-hidden h-32 sm:h-40">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
                            alt="Modern gym interior with equipment"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}