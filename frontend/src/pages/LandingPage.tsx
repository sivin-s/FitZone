import { useState } from 'react';
import { Link } from 'react-router';

const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="bg-white text-gray-900">

            {/* Header */}
            <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-2xl font-extrabold tracking-tight">FitZone</Link>
                        <nav className="hidden md:flex gap-8">
                            <Link to="/trainers" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Browse Trainers</Link>
                            <Link to="/articles" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Articles</Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Login</Link>
                        <Link to="/register" className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-gray-800 transition-colors">Sign Up</Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg`}>
                    <div className="px-6 py-4 flex flex-col gap-4">
                        <Link to="/trainers" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-800 hover:text-black transition-colors">Browse Trainers</Link>
                        <Link to="/articles" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-800 hover:text-black transition-colors">Articles</Link>
                        <hr className="border-gray-100" />
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-800 hover:text-black transition-colors">Login</Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-black text-white text-sm font-medium px-4 py-2 rounded-md text-center hover:bg-gray-800 transition-colors">Sign Up</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
                <div className="max-w-xl">
                    <h1 className="text-5xl lg:text-[4rem] font-extrabold leading-[1.1] mb-6">
                        Train Smart.<br />Live Well.
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-10">
                        Elevate your physical potential through elite trainers, science-backed methodologies, and high-fidelity progress tracking. No gimmicks, just results.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/register" className="bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center">Get Started</Link>
                        <Link to="/programs" className="bg-white text-black border border-gray-300 px-8 py-3.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">View Programs</Link>
                    </div>
                </div>

                <div className="relative h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                    {/* <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 font-medium text-lg">
                        [ Hero Image Placeholder: Gym/Workout Scene ]
                    </div> */}
                    <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="gym image" className="h-full w-full object-cover" />

                    <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 bg-black text-white p-6 rounded-xl min-w-[200px] shadow-2xl">
                        <div className="text-4xl font-bold mb-1">100%</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Scientific Approach</div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-black text-white py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
                        <div className="pt-8 md:pt-0 flex flex-col items-center justify-center">
                            <div className="text-4xl lg:text-5xl font-bold mb-3">1200+</div>
                            <div className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-bold">Active Users</div>
                        </div>
                        <div className="pt-8 md:pt-0 flex flex-col items-center justify-center">
                            <div className="text-4xl lg:text-5xl font-bold mb-3">85+</div>
                            <div className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-bold">Certified Trainers</div>
                        </div>
                        <div className="pt-8 md:pt-0 flex flex-col items-center justify-center">
                            <div className="text-4xl lg:text-5xl font-bold mb-3">500+</div>
                            <div className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-bold">Sessions Completed</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Engineered for Excellence</h2>
                    <p className="text-gray-600 text-lg">Our platform provides the tools required for sustained physical evolution.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Feature 1 */}
                    <div className="border border-gray-100 bg-white p-8 lg:p-10 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="w-12 h-12 mb-6 text-black">
                            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M8 22l-6-6M22 8l-6-6M13 3l8 8M3 13l8 8"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Personalized Training</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">Customized workout regimens tailored to your specific biomechanics and goals.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="border border-gray-100 bg-white p-8 lg:p-10 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="w-12 h-12 mb-6 text-black">
                            <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Nutrition Tracking</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">Advanced algorithms that analyze your caloric intake and optimize your macronutrients.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="border border-gray-100 bg-white p-8 lg:p-10 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="w-12 h-12 mb-6 text-black">
                            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">High-fidelity data visualization for every lift, run, and movement you complete.</p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="bg-[#EEF2F9] py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#1E293B]">Invest in Yourself</h2>
                    <p className="text-[#475569] text-lg mb-16">Choose the discipline that suits your ambition.</p>

                    {/* User Requested Empty State */}
                    <div className="max-w-2xl mx-auto bg-white/50 border-2 border-dashed border-[#CBD5E1] rounded-2xl py-20 px-6">
                        <div className="flex flex-col items-center justify-center text-[#64748B]">
                            <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <p className="text-xl font-medium">No plan available</p>
                            <p className="text-sm mt-2 max-w-md mx-auto">Subscription tiers are currently being updated. Please check back later.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
                <div className="mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-3">Performance Journal</h2>
                    <p className="text-gray-600 text-lg">Expert insights on training, recovery, and peak human performance.</p>
                </div>

                {/* User Requested Empty State */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl py-32 px-6 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                        </svg>
                        <h3 className="text-xl font-semibold mb-2 text-gray-500">No article available</h3>
                        <p className="text-sm">We're currently writing fresh content. Stay tuned.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="font-extrabold text-xl tracking-tight mb-2 text-black">FitZone</div>
                        <div className="text-sm text-gray-500">&copy; 2024 FitZone. All rights reserved. High-Performance Clarity.</div>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500">
                        <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
                        <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
                        <Link to="/support" className="hover:text-black transition-colors">Contact Support</Link>
                        <Link to="/careers" className="hover:text-black transition-colors">Careers</Link>
                    </nav>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;