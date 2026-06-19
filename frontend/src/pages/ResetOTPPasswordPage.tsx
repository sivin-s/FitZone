import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '../lib/axios';
import { BadgeCheck, MailCheck } from 'lucide-react';

// Zod Schema Send OTP
const forgotSchema = z.object({
    email: z.email('Invalid email address')
        .min(1, 'Email is required')
        .refine((value) => !/\s/.test(value), {
            message: 'Email cannot contain spaces',
        }),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

// Zod Schema Reset Password
const resetSchema = z.object({
    otp: z.string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d+$/, 'OTP must contain only numbers'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
            'Password must contain uppercase, lowercase, number, and special character'
        )
        .refine((val) => !/\s/.test(val), { message: 'Password must not contain spaces' }),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isResetSuccess, setIsResetSuccess] = useState(false);
    const [formError, setFormError] = useState('');
    
    // Resend OTP Timer
    const [timer, setTimer] = useState(55);
    const canResend = timer === 0;
    const isTimerRunning = timer > 0 && isSubmitted;

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Timer Effect
    useEffect(() => {
        if (!isTimerRunning) return;
        const interval = setInterval(() => {
            setTimer((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const {
        register: registerForgot,
        handleSubmit: handleSubmitForgot,
        formState: { errors: forgotErrors },
        reset: resetForgotForm
    } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema)
    });

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        formState: { errors: resetErrors },
        reset: resetResetForm,
        setValue: setResetValue,
        trigger: triggerResetField
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            otp: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    // Sync the OTP array state with react-hook-form value
    useEffect(() => {
        const joinedOtp = otp.join('');
        setResetValue('otp', joinedOtp);
        // Only trigger validation once the user has filled in all 6 digits to keep UX clean
        if (joinedOtp.length === 6) {
            triggerResetField('otp');
        }
    }, [otp, setResetValue, triggerResetField]);

    // Mutation to send the OTP
    const forgotPasswordMutation = useMutation({
        mutationFn: async (emailData: string) => {
            const response = await api.post('/auth/forgot-password', { email: emailData });
            return response.data;
        },
        onSuccess: (_, emailData) => {
            setFormError('');
            setEmail(emailData);
            setIsSubmitted(true);
            setTimer(55); // Reset timer on successful send
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 50);
        },
        onError: (err: unknown) => {
            setFormError(getApiErrorMessage(err, 'Failed to send OTP. Please try again.'));
        }
    });

    // Mutation to reset password with the OTP
    const resetPasswordMutation = useMutation({
        mutationFn: async (data: { email: string; otp: string; newPassword: string }) => {
            const response = await api.post('/auth/reset-password', data);
            return response.data;
        },
        onSuccess: () => {
            setFormError('');
            setIsResetSuccess(true);
        },
        onError: (err: unknown) => {
            setFormError(getApiErrorMessage(err, 'Failed to reset password. Please check your OTP.'));
        }
    });

    const onForgotSubmit = (data: ForgotFormData) => {
        setFormError('');
        forgotPasswordMutation.mutate(data.email.trim());
    };

    const onResetSubmit = (data: ResetFormData) => {
        setFormError('');
        resetPasswordMutation.mutate({
            email: email.trim(),
            otp: data.otp,
            newPassword: data.newPassword.trim()
        });
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        if (email && canResend) {
            setFormError('');
            setOtp(['', '', '', '', '', '']);
            forgotPasswordMutation.mutate(email.trim());
        }
    };

    const handleGoBack = () => {
        setIsSubmitted(false);
        setFormError('');
        setOtp(['', '', '', '', '', '']);
        resetForgotForm();
        resetResetForm();
    };

    return (
        <div className="bg-[#F8F9FB] min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-screen-xl mx-auto">
                    <div className="px-6 py-5 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center gap-x-2">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                    <i className="fa-solid fa-dumbbell text-white text-xl"></i>
                                </div>
                                <span className="logo-font text-2xl font-semibold tracking-tighter text-black">FitZone</span>
                            </Link>
                        </div>

                        {/* Nav Actions */}
                        <div className="flex items-center gap-x-3">
                            <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-900 transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {/* Forgot Password Card: Enter Email */}
                    {!isSubmitted && !isResetSuccess && (
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            {/* Lock Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                                    <i className="fa-solid fa-lock text-3xl text-gray-700"></i>
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="text-center mb-2">
                                <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">Forgot Password</h1>
                            </div>

                            {/* Description */}
                            <div className="text-center mb-7">
                                <p className="text-gray-500 text-[15px] leading-relaxed">
                                    Enter the email associated with your account and we'll send an OTP to reset your password.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmitForgot(onForgotSubmit)} className="space-y-5" noValidate>
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-envelope text-gray-400"></i>
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            disabled={forgotPasswordMutation.isPending}
                                            className={`w-full border text-black border-gray-200 focus:border-gray-300 text-sm rounded-2xl py-3.5 pl-11 pr-4 placeholder:text-gray-400 outline-none focus:ring-3 focus:ring-black/5 transition-all disabled:bg-gray-50 ${forgotErrors.email ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                                            placeholder="trainer@fitzone.com"
                                            {...registerForgot('email')}
                                        />
                                    </div>
                                    {forgotErrors.email && (
                                        <span className="block text-red-500 text-sm mt-1">{forgotErrors.email.message}</span>
                                    )}
                                    {formError && (
                                        <span className="block text-red-500 text-sm mt-1">{formError}</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={forgotPasswordMutation.isPending}
                                    className="w-full bg-black hover:bg-gray-900 transition-colors text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-x-2 text-sm active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {forgotPasswordMutation.isPending ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span>Sending OTP...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send OTP</span>
                                            <i className="fa-solid fa-arrow-right ml-1"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="my-6 border-t border-gray-100"></div>

                            {/* Back to Login */}
                            <div className="text-center">
                                <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                                    <i className="fa-solid fa-arrow-left mr-2 text-xs"></i>
                                    <span>Back to Login</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Reset Password Card: Enter OTP and New Password */}
                    {isSubmitted && !isResetSuccess && (
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            {/* Success Icon / Mail Check */}
                            <div className="flex justify-center mb-6">
                                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center">
                                    <MailCheck color='#10b981' size={26} />
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="text-center mb-2">
                                <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">Enter OTP</h1>
                            </div>

                            {/* Description */}
                            <div className="text-center mb-7">
                                <p className="text-gray-500 text-[15px] leading-relaxed">
                                    We have sent a verification code to <span className="font-semibold text-gray-900">{email}</span>. Please check your inbox.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-5" noValidate>
                                {/* Hidden input to bind the OTP field to react-hook-form */}
                                <input type="hidden" {...registerReset('otp')} />

                                {/* OTP Code - 6 column grid inputs */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 text-center mb-3">Verification Code (OTP)</label>
                                    <div className="flex gap-2 sm:gap-3 justify-center mb-6">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => { inputRefs.current[index] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                disabled={resetPasswordMutation.isPending}
                                                className={`w-11 h-14 text-black bg-gray-50 border rounded-xl text-center text-xl font-semibold focus:outline-none focus:border-black focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:opacity-50 transition-all ${resetErrors.otp ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    {resetErrors.otp && (
                                        <span className="block text-red-500 text-sm text-center mt-2">{resetErrors.otp.message}</span>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-lock text-gray-400"></i>
                                        </div>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            disabled={resetPasswordMutation.isPending}
                                            className={`w-full border text-black border-gray-200 focus:border-gray-300 text-sm rounded-2xl py-3.5 pl-11 pr-4 placeholder:text-gray-400 outline-none focus:ring-3 focus:ring-black/5 transition-all disabled:bg-gray-50 ${resetErrors.newPassword ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                                            placeholder="••••••••"
                                            {...registerReset('newPassword')}
                                        />
                                    </div>
                                    {resetErrors.newPassword && (
                                        <span className="block text-red-500 text-sm mt-1">{resetErrors.newPassword.message}</span>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-lock-open text-gray-400"></i>
                                        </div>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            disabled={resetPasswordMutation.isPending}
                                            className={`w-full border text-black border-gray-200 focus:border-gray-300 text-sm rounded-2xl py-3.5 pl-11 pr-4 placeholder:text-gray-400 outline-none focus:ring-3 focus:ring-black/5 transition-all disabled:bg-gray-50 ${resetErrors.confirmPassword ? 'border-red-500 ring-2 ring-red-100' : ''}`}
                                            placeholder="••••••••"
                                            {...registerReset('confirmPassword')}
                                        />
                                    </div>
                                    {resetErrors.confirmPassword && (
                                        <span className="block text-red-500 text-sm mt-1">{resetErrors.confirmPassword.message}</span>
                                    )}
                                    {formError && (
                                        <span className="block text-red-500 text-sm mt-1.5 text-center">{formError}</span>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={resetPasswordMutation.isPending}
                                    className="w-full bg-black hover:bg-gray-900 transition-colors text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-x-2 text-sm active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    {resetPasswordMutation.isPending ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <span>Resetting Password...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Reset Password</span>
                                            <i className="fa-solid fa-check ml-1"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Resend and Go Back controls */}
                            <div className="mt-6 flex flex-col items-center justify-center gap-y-3 text-sm">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={!canResend || forgotPasswordMutation.isPending}
                                    className={`font-semibold transition-colors ${canResend ? 'text-black hover:text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                                >
                                    {forgotPasswordMutation.isPending ? 'Resending...' : `Resend OTP ${!canResend ? `(${timer}s)` : ''}`}
                                </button>

                                <hr className="w-full border-gray-100 my-1" />

                                <button
                                    type="button"
                                    onClick={handleGoBack}
                                    className="font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success Page: Password changed successfully */}
                    {isResetSuccess && (
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
                            <div className="w-14 h-14 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
<BadgeCheck  />
                                {/* <i className="fa-solid fa-circle-check text-emerald-600 text-3xl"></i> */}
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900">Password Reset Success!</h3>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                                Your password has been changed successfully. You can now use your new password to log in.
                            </p>

                            <Link
                                to="/login"
                                className="mt-6 inline-block w-full bg-black hover:bg-gray-900 transition-colors text-white font-semibold py-3.5 px-4 rounded-2xl text-sm text-center"
                            >
                                Proceed to Login
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-5 mt-auto">
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 text-sm">
                        {/* Footer Left */}
                        <div>
                            <span className="logo-font font-semibold text-lg text-black">FitZone</span>
                            <p className="text-xs text-gray-400 mt-1">© 2024 FitZone. All rights reserved.</p>
                        </div>

                        {/* Footer Links */}
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                            <Link to="/about" className="text-gray-500 hover:text-gray-700 transition-colors">About Us</Link>
                            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</Link>
                            <Link to="/support" className="text-gray-500 hover:text-gray-700 transition-colors">Contact Support</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}