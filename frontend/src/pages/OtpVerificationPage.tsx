import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {useMutation} from '@tanstack/react-query'
import {api, getApiErrorMessage} from '../lib/axios'
import Toast from '../components/Toast';

type OtpLocationState = {
    email?: string;
};

export default function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = (location.state as OtpLocationState | null)?.email ?? 'your email';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(55);
    const canResend = timer === 0;
    const isTimerRunning = timer > 0;
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // toast
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error'
    }>({
        show: false,
        message: '',
        type: 'success'
    })

    useEffect(() => { // no email in router state
    if (!email) {
        navigate('/register', { replace: true });
    }
}, [email, navigate]);

    useEffect(() => {
        if (!isTimerRunning) return;
        const interval = setInterval(() => {
            setTimer((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === 'Backspace' && !otp[index] && index > 0){
            inputRefs.current[index - 1]?.focus();
        }
    }

    const verifyMutation = useMutation({
        mutationFn: async()=>{
            const response  = await api.post('/auth/verify-otp',{email,otp: otp.join('')});
            return response.data;
        },
        onSuccess: ()=>{
             navigate('/login', {replace: true, state:{message: 'Email verified! Please log in.'}})
        },
        onError: (error: unknown)=>{
            setToast({
                show: true,
                message: getApiErrorMessage(error, 'Invalid OTP. Please try again.'),
                type: 'error'
            })
            setOtp(['','','','','',''])
            inputRefs.current[0]?.focus();
        }
    })

   const resendMutation = useMutation({
    mutationFn: async ()=>{
        const response = await api.post('/auth/resend-otp',{email});
        return response.data;
    },
    onSuccess: ()=>{
        setTimer(55);
        setOtp(['','','','','',''])
        inputRefs.current[0]?.focus();
        setToast({show: true, message: 'New Verification code sent!', type: 'success'})
    }
   })

    const handleVerify = () => {
        if(otp.every(digit => digit !== '')) verifyMutation.mutate()
    };

    const handleResend = () => {
        if (canResend) {
            resendMutation.mutate();
        }
    };

    const formatTimer = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            {/* // toast  */}
            <Toast 
              show={toast.show}
              message={toast.message}
              type={toast.type}
              onClose={()=> setToast((prev)=>({...prev, show: false}))}
            />

            <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-gray-900">FitZone</Link>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                        <Link to="/register" className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-10">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Verify your email</h1>
                   <p className="text-gray-500 text-center mb-8">
    We've sent a 6-digit code to <span className="font-semibold text-gray-900">{email || 'your email'}</span>
</p>

                    {/* OTP Inputs */}
                    <div className="flex gap-2 sm:gap-3 justify-center mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-11 h-14 text-black  sm:w-12 sm:h-14 bg-gray-50 border border-gray-200 rounded-lg text-center text-xl font-semibold focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                            />
                        ))}
                    </div>

            <button 
            onClick={handleVerify}
            disabled={verifyMutation.isPending || otp.some(digit => digit === '')}
            className={`w-full py-3.5 rounded-lg font-medium text-white mb-4 transition-all duration-200 flex items-center justify-center gap-2 ${otp.every(digit => digit !== '') && !verifyMutation.isPending ? 'bg-black hover:bg-gray-800 cursor-pointer active:scale-[0.98]' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            {verifyMutation.isPending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Verify'}
          </button>

                 <div className="text-center text-sm text-gray-500 mb-6">
            Didn't receive the code?{' '}
            <button 
              onClick={handleResend}
              disabled={!canResend || resendMutation.isPending}
              className={`font-semibold transition-colors ${canResend ? 'text-gray-900 hover:text-gray-700 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
            >
              Resend OTP {timer > 0 && `(${formatTimer(timer)})`}
            </button>
          </div>

                    {/* Divider */}
                    <hr className="border-gray-200 mb-6" />

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-8 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-xl font-bold text-gray-900 mb-1">FitZone</div>
                        <p className="text-sm text-gray-500">
                            © 2024 FitZone. All rights reserved. High-Performance Clarity.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <Link to="" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</Link>
                        <Link to="" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
                        <Link to="" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</Link>
                        <Link to="" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}