import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export default function UserDashboard() {
    const [hasUpcomingSession, setHasUpcomingSession] = useState(false);

    const { data: profile } = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const res = await api.get('/user/profile');
            return res.data.data;
        }
    });

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                    <i className="ph ph-user text-slate-600 text-sm"></i>
                    <span className="text-sm font-semibold text-slate-800">
                        {/* {isLoading ? 'Loading...' : (profile?.username || 'Guest')} */}
                        {'Guest'}
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">
                        Scan The Barcode
                    </button>
                    
                     <Link to='/profile'>
                    {profile?.profilePicture ? (
                        <img 
                            src={profile.profilePicture} 
                            alt="User Avatar" 
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 cursor-pointer" 
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-200 cursor-pointer text-white text-xs font-bold uppercase">
                            {profile?.username ? profile.username.charAt(0) : 'U'}
                        </div>
                    )}
                      </Link>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Wider) */}
                    <div className="flex-1 flex flex-col gap-6">
                        
                        {/* Top Stats Row */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Plan Card */}
                            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 relative flex flex-col justify-between">
                                <div>
                                    <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Guest Plan</span>
                                    <h2 className="text-3xl font-bold mt-4 mb-1 text-slate-900">0 Sessions<br />Remaining</h2>
                                    <p className="text-sm text-slate-500">Expiry: 0 0, 0000</p>
                                </div>
                                <button className="mt-6 bg-black text-white w-full py-2.5 rounded-md text-sm font-medium hover:bg-slate-800">
                                    Renew Plan
                                </button>
                                <i className="ph-fill ph-seal-check text-black text-3xl absolute top-6 right-6"></i>
                            </div>

                            {/* 2x2 Stats Grid */}
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                {/* BMI */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-2">
                                        <i className="ph ph-address-book text-lg"></i>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">BMI</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-slate-900">0.0</span>
                                    </div>
                                </div>
                                {/* Streak */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-2">
                                        <i className="ph-fill ph-fire text-lg"></i>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Streak</span>
                                    <span className="text-xl font-bold text-slate-900">0 Days</span>
                                </div>
                                {/* Sessions */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-2">
                                        <i className="ph ph-barbell text-lg"></i>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Sessions</span>
                                    <span className="text-xl font-bold text-slate-900">0</span>
                                </div>
                                {/* Wallet */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-2">
                                        <i className="ph ph-wallet text-lg"></i>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Wallet</span>
                                    <span className="text-xl font-bold text-slate-900">₹0.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50">
                                <i className="ph ph-magnifying-glass text-2xl text-slate-700"></i>
                                <span className="text-xs font-semibold  text-slate-700 ">Find Trainer</span>
                            </button>
                            <button className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50">
                                <i className="ph ph-calendar-plus text-2xl text-slate-700"></i>
                                <span className="text-xs font-semibold text-slate-700">Book Session</span>
                            </button>
                            <button className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50">
                                <i className="ph ph-fork-knife text-2xl text-slate-700"></i>
                                <span className="text-xs font-semibold text-slate-700">Log Food</span>
                            </button>
                            <button className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-slate-300 hover:bg-slate-50">
                                <i className="ph ph-barbell text-2xl text-slate-700"></i>
                                <span className="text-xs font-semibold text-slate-700">Log Activity</span>
                            </button>
                        </div>                        {/* Upcoming Session / Join Call section */}
                        {hasUpcomingSession ? (
                            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row overflow-hidden shadow-sm animate-fade-in">
                                <div className="sm:w-48 h-48 sm:h-auto bg-slate-100 relative flex-shrink-0">
                                    <img 
                                        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=80" 
                                        alt="Trainer" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
                                        TRAINER
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold tracking-wider uppercase">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                Confirmed
                                            </div>
                                            <span className="text-xs font-medium text-slate-400">60 Min Session</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Marcus Hall</h3>
                                        <p className="text-sm text-slate-500 mt-1">Specialist in Strength & Conditioning</p>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mt-3">
                                            <i className="ph ph-calendar-blank text-lg text-slate-400"></i>
                                            <span>Today at 2:00 PM</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <button className="flex-1 bg-black hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]">
                                            <i className="ph ph-video-camera"></i> Join Call
                                        </button>
                                        <button 
                                            onClick={() => setHasUpcomingSession(false)} 
                                            className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-2xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
                                {/* Decorative background element */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-100 rounded-full blur-2xl opacity-50"></div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-slate-100 rounded-full blur-2xl opacity-50"></div>
                                
                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100/80 text-slate-700 flex items-center justify-center mb-4 mx-auto shadow-sm">
                                        <i className="ph ph-video-camera text-2xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No active sessions</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
                                        You don't have any upcoming virtual sessions scheduled. Book a session with one of our expert trainers to kickstart your progress.
                                    </p>
                                    <button 
                                        disabled
                                        // missing session available logic
                                        onClick={() => setHasUpcomingSession(true)} 
                                        className="bg-black  hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm active:scale-[0.98] inline-flex items-center gap-2"
                                    >
                                        <span>Schedule a Session</span>
                                        <i className="ph ph-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Weekly Streak */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase">Weekly Streak</h3>
                                <div className="text-xs text-slate-500 font-medium">
                                    Current: <span className="text-slate-800 font-bold">0</span> &nbsp;&nbsp; Longest: <span className="text-slate-800 font-bold">0</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mb-8 px-2 md:px-8">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <span className="text-xs font-semibold text-slate-500">{day}</span>
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-sm font-medium">-</div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full bg-white border border-slate-300 text-slate-800 py-2.5 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors">
                                Log Today's Activity
                            </button>
                        </div>

                        {/* Upgrade Banner */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <h2 className="text-4xl font-bold text-slate-900">Guest Plan</h2>
                            <button className="bg-black text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-slate-800 whitespace-nowrap transition-colors">
                                Upgrade to Premium
                            </button>
                        </div>

                    </div>

                    {/* Right Column (Narrower) */}
                    <div className="w-full lg:w-[360px] flex flex-col gap-6 flex-shrink-0">
                        
                        {/* Nutrition Summary */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase">Nutrition Summary</h3>
                                <button className="text-slate-400 hover:text-slate-600">
                                    <i className="ph ph-info text-xl"></i>
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm text-slate-600 font-medium">Calories</span>
                                    <span className="text-sm font-bold text-slate-900">0 / 2,200 kcal</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-black rounded-full transition-all" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="border border-slate-200 rounded-lg p-2 text-center flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Protein</span>
                                    <span className="text-sm font-bold text-slate-900">0g</span>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-2 text-center flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Carbs</span>
                                    <span className="text-sm font-bold text-slate-900">0g</span>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-2 text-center flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Fats</span>
                                    <span className="text-sm font-bold text-slate-900">0g</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-6">
                                <li className="flex items-center justify-between text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <i className="ph ph-circle text-slate-300 text-xl"></i>
                                        <span className="text-sm font-medium">Breakfast</span>
                                    </div>
                                    <span className="text-xs">--:--</span>
                                </li>
                                <li className="flex items-center justify-between text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <i className="ph ph-circle text-slate-300 text-xl"></i>
                                        <span className="text-sm font-medium">Lunch</span>
                                    </div>
                                    <span className="text-xs">--:--</span>
                                </li>
                                <li className="flex items-center justify-between text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <i className="ph ph-circle text-slate-300 text-xl"></i>
                                        <span className="text-sm font-medium">Dinner</span>
                                    </div>
                                    <span className="text-xs">--:--</span>
                                </li>
                                <li className="flex items-center justify-between text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <i className="ph ph-circle text-slate-300 text-xl"></i>
                                        <span className="text-sm font-medium">Snacks</span>
                                    </div>
                                    <span className="text-xs">--:--</span>
                                </li>
                            </ul>

                            <button className="w-full bg-black text-white py-2.5 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors">
                                Log Meal
                            </button>
                        </div>

                        {/* Basic Diet Plan */}
                        <div className="bg-white border border-slate-200 rounded-xl">
                            <div className="p-6">
                                <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase mb-4">Guest Diet Plan</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
                                        <i className="ph ph-fork-knife text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Standard Balanced</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">General wellness plan</p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/upgrade" className="block border-t border-slate-100 p-4 text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-between rounded-b-xl transition-colors">
                                <div className="flex items-center gap-2">
                                    <i className="ph ph-lock-key text-slate-400"></i>
                                    Upgrade for Personalized Plans
                                </div>
                                <i className="ph ph-caret-right text-slate-400"></i>
                            </Link>
                        </div>

                        {/* Progress */}
                        <div className="bg-white border border-slate-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold tracking-wider text-slate-800 uppercase">Progress</h3>
                                <Link to="/progress" className="text-xs font-bold underline underline-offset-2 text-slate-700 hover:text-black transition-colors">View Full</Link>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Weight */}
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 block mb-1">Weight</span>
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg font-bold text-slate-900">0kg</span>
                                    </div>
                                </div>
                                {/* BMI */}
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 block mb-1">BMI</span>
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg font-bold text-slate-900">0.0</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Unlock AI Insights (Locked Card) */}
                        <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-hidden flex flex-col items-center justify-center text-center min-h-[180px]">
                            {/* Blurry Background Effect */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                <div className="w-48 h-24 bg-blue-400 blur-2xl rounded-full"></div>
                            </div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                                <i className="ph ph-lock-key text-2xl text-slate-800 mb-2"></i>
                                <h3 className="font-bold text-slate-900 mb-2">Unlock AI Insights</h3>
                                <p className="text-xs text-slate-600 mb-4 px-4 leading-relaxed bg-white/50 py-1 rounded backdrop-blur-sm">
                                    Personalized recommendations based<br />on your unique performance data.
                                </p>
                                <button className="bg-black text-white px-5 py-2 rounded-md text-xs font-semibold hover:bg-slate-800 shadow-sm transition-colors">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                
                {/* Footer */}
                <footer className="max-w-[1200px] mx-auto mt-12 py-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
                    <p>&copy; 2024 FitPortal Performance. All rights reserved.</p>
                    <div className="flex gap-4 sm:gap-6">
                        <Link to="/about" className="hover:text-slate-800 underline underline-offset-2 transition-colors">About Us</Link>
                        <Link to="/privacy" className="hover:text-slate-800 underline underline-offset-2 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-slate-800 underline underline-offset-2 transition-colors">Terms of Service</Link>
                        <Link to="/support" className="hover:text-slate-800 underline underline-offset-2 transition-colors">Contact Support</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}