import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

// component
import {StatCard} from '../../components/admin/StatCard'
import {RevenueChart} from '../../components/admin/RevenueChart'
import { ActivityPanel } from '../../components/admin/ActivityPanel';
import { RegistrationsChart } from '../../components/admin/RegistrationsChart';
import { Header } from '../../components/admin/Header';

// SVG Icons used for statistics cards
const Icon = {
  cardUsers: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M20 8v6M17 11h6" />
    </svg>
  ),
  dumbbell: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="m6.5 6.5 11 11" />
      <path d="m5 8 3-3M16 19l3-3M3 10l4-4M17 21l4-4" />
    </svg>
  ),
  wallet: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M16 12h5" />
      <circle cx="16" cy="12" r="1" />
    </svg>
  ),
  tag: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z" />
      <path d="M7 7h.01" />
    </svg>
  ),
  download: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  ),
  bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17a2 2 0 0 1-.6 1.42L4 17h5" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  ),
  settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51.16.07.33.1.51.1H21a2 2 0 1 1 0 4h-.09c-.18 0-.35.03-.51.1-.61.25-1 .85-1 1.51Z" />
    </svg>
  ),
};


export default function AdminDashboard() {
  const [range, setRange] = useState("Last 12 Months");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users-all"],
    queryFn: async () => {
      const response = await api.get('/admin/users?limit=1000');
      return response.data.data;
    }
  });

  const usersList: any[] = data?.users || [];
  
  // Calculate counts
  const totalUsersCount = usersList.filter((u: any) => u.role === 'user').length;
  const verifiedTrainersCount = usersList.filter((u: any) => u.role === 'trainer').length;
  const subscriptionsCount = usersList.filter((u: any) => u.role === 'user' && u.isPremium).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 sm:px-8 lg:px-10 py-6 sm:py-8">
        <Header 
          totalUsers={totalUsersCount} 
          verifiedTrainers={verifiedTrainersCount} 
          subscriptions={subscriptionsCount} 
        />

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            iconBg="bg-neutral-100"
            iconColor="text-black"
            icon={<Icon.cardUsers />}
            title="Total Users"
            value={isLoading ? "..." : String(totalUsersCount)}
          />
          <StatCard
            iconBg="bg-blue-100"
            iconColor="text-slate-700"
            icon={<Icon.dumbbell />}
            title="Verified Trainers"
            value={isLoading ? "..." : String(verifiedTrainersCount)}
          />
          <StatCard
            iconBg="bg-neutral-900"
            iconColor="text-white"
            icon={<Icon.wallet />}
            title="Total Revenue"
            value="$0"
          />
          <StatCard
            iconBg="bg-neutral-100"
            iconColor="text-neutral-700"
            icon={<Icon.tag />}
            title="Subscriptions"
            value={isLoading ? "..." : String(subscriptionsCount)}
          />
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-[1.95fr_0.95fr] gap-6">
          <RevenueChart range={range} setRange={setRange} />
          <ActivityPanel />
        </section>

        <section className="mt-6">
          <RegistrationsChart />
        </section>
      </div>

      <footer className="border-t border-slate-200 px-5 sm:px-8 lg:px-10 py-7 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-[15px] text-slate-500 font-semibold">
        <p>© 2024 FitZone. All rights reserved. High-Performance Clarity.</p>
        <div className="flex flex-wrap gap-6">
          <a href="#" className="hover:text-slate-700">About Us</a>
          <a href="#" className="hover:text-slate-700">Privacy Policy</a>
          <a href="#" className="hover:text-slate-700">Terms of Service</a>
          <a href="#" className="hover:text-slate-700">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}