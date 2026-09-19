import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Dumbbell, Users, Calendar } from 'lucide-react';

const AboutPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="bg-white text-gray-900 min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="text-2xl font-extrabold tracking-tight">FitZone</Link>
                        <nav className="hidden md:flex gap-8">
                            <a href="/#features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Features</a>
                            <a href="/#articles" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Articles</a>
                            <Link to="/about" className="text-sm font-medium text-black transition-colors">About Us</Link>
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-gray-800 transition-colors">Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Login</Link>
                                <Link to="/register" className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-gray-800 transition-colors">Sign Up</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Mobile Nav */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg`}>
                    <div className="px-6 py-4 flex flex-col gap-4">
                        <a href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-800 hover:text-black transition-colors">Features</a>
                        <a href="/#articles" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-800 hover:text-black transition-colors">Articles</a>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-black transition-colors">About Us</Link>
                        <hr className="border-gray-100" />
                        {isAuthenticated ? (
                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-black text-white text-sm font-medium px-4 py-2 rounded-md text-center hover:bg-gray-800 transition-colors">Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-800 hover:text-black transition-colors">Login</Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-black text-white text-sm font-medium px-4 py-2 rounded-md text-center hover:bg-gray-800 transition-colors">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="max-w-5xl mx-auto px-6 lg:px-8 pt-20 pb-16 text-center">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 block mb-4">FitZone Gym Community</span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900">
                        More Than a Gym.<br />
                        <span className="bg-gradient-to-r from-slate-950 to-slate-700 bg-clip-text text-transparent">A Community.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        Welcome to FitZone, where strength meets connection. We are a community-focused fitness space dedicated to helping you build a healthier body, a stronger mind, and a supportive network that pushes you forward.
                    </p>
                </section>

                {/* Stats Grid */}
                <section className="bg-slate-50 border-y border-slate-100 py-12 mb-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950">12,000+ sq ft</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Premium Facility</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950">20+</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Expert Coaches</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950">1,500+</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Members</div>
                            </div>
                            <div>
                                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950">30+</div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Weekly Classes</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gym Offerings */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">What We Offer</h2>
                        <p className="mt-4 text-lg text-slate-600">Everything you need to reach your fitness goals in a supportive atmosphere.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white mb-6">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Elite Facilities</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Access top-tier strength training gear, free weights, Olympic lifting platforms, and dedicated functional fitness zones.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Community & Support</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Join regular community events, challenges, and support groups where every member motivates each other.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white mb-6">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">Group Classes</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Participate in energizing group sessions including HIIT, yoga, strength training, and mobility classes for all fitness levels.
                            </p>
                        </div>
                    </div>
                </section>


                {/* Call to Action */}
                <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 text-center">
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-12 lg:p-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                            Ready to Join the Movement?
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-base sm:text-lg">
                            Become a member of the FitZone community today. Connect with elite trainers, track your workouts, and elevate your fitness journey.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="bg-slate-950 text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="bg-slate-950 text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                                        Sign Up Now
                                    </Link>
                                    <Link to="/login" className="bg-white text-slate-900 border border-slate-200 text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="font-extrabold text-xl tracking-tight mb-2 text-black">FitZone</div>
                        <div className="text-sm text-gray-500">&copy; 2024 FitZone. All rights reserved. High-Performance Clarity.</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
