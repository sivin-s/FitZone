import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (newPassword.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match. Please try again.');
            return;
        }

        // Show success modal
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        setNewPassword('');
        setConfirmPassword('');
        navigate('/login');
    };

    const isConfirmPasswordInvalid = confirmPassword && newPassword && confirmPassword !== newPassword;

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-bold text-black">FitZone</Link>
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                            <Link to="/register" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 font-medium transition-colors">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Title and Description */}
                        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Reset Password</h1>
                        <p className="text-center text-gray-600 mb-8">Please enter your new password details to secure your account.</p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900 mb-2">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none pr-12 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                                        aria-label="Toggle new password visibility"
                                    >
                                        {showNewPassword ? (
                                            <i className="far fa-eye-slash"></i>
                                        ) : (
                                            <i className="far fa-eye"></i>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none pr-12 transition-all ${isConfirmPasswordInvalid ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                                        aria-label="Toggle confirm password visibility"
                                    >
                                        {showConfirmPassword ? (
                                            <i className="far fa-eye-slash"></i>
                                        ) : (
                                            <i className="far fa-eye"></i>
                                        )}
                                    </button>
                                </div>
                                {errorMessage && (
                                    <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                            >
                                Reset Password
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="text-2xl font-bold text-black mb-2">FitZone</div>
                            <p className="text-sm text-gray-600">© 2024 FitZone. All rights reserved. High-Performance Clarity.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/about" className="text-sm text-gray-600 hover:text-black transition-colors">About Us</Link>
                            <Link to="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="text-sm text-gray-600 hover:text-black transition-colors">Terms of Service</Link>
                            <Link to="/support" className="text-sm text-gray-600 hover:text-black transition-colors">Contact Support</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Success Modal */}
            {showSuccessModal && (
                <div
                    onClick={() => setShowSuccessModal(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
                    >
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-check text-green-600 text-2xl"></i>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2">Password Reset Successful!</h2>
                        <p className="text-center text-gray-600 mb-6">Your password has been updated successfully.</p>
                        <button
                            onClick={handleCloseModal}
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors"
                        >
                            Continue to Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}