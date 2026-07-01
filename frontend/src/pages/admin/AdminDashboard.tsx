import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';

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

interface StatCardProps {
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  value: string;
}

function StatCard({ iconBg, iconColor, icon, title, value }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <p className="text-neutral-700 text-[15px] font-semibold">{title}</p>
      <p className="mt-2 text-[38px] leading-none font-extrabold tracking-tight text-neutral-900">{value}</p>
    </div>
  );
}

interface RevenueChartProps {
  range: string;
  setRange: (r: string) => void;
}

function RevenueChart({ range, setRange }: RevenueChartProps) {
  const datasets: Record<string, number[]> = {
    "Last 12 Months": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Last 6 Months": [0, 0, 0, 0, 0, 0],
    "Last 3 Months": [0, 0, 0],
  };

  const labelsMap: Record<string, string[]> = {
    "Last 12 Months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "Last 6 Months": ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "Last 3 Months": ["Oct", "Nov", "Dec"],
  };

  const values = datasets[range] || [0];
  const labels = labelsMap[range] || [];
  
  const w = 760, h = 260, pad = 18;
  const min = 0;
  const max = 10;
  const stepX = (w - pad * 2) / (values.length - 1 || 1);

  const pts = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return { x, y };
  });

  const d = pts.map((p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }).join(" ");

  const peak = 0;
  const peakLabel = labels[0] || '';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-[26px] font-extrabold leading-tight text-black">Revenue Growth</h2>
          <p className="text-neutral-600 text-[15px] mt-1">Tracking platform earnings monthly.</p>
        </div>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="self-start bg-neutral-100 border border-neutral-100 rounded-xl px-4 py-2 text-sm font-semibold text-neutral-800 outline-none"
        >
          {Object.keys(datasets).map(k => <option key={k}>{k}</option>)}
        </select>
      </div>

      <div className="mt-6">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px] sm:h-[260px]">
          <path d={d} fill="none" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <div className="grid mt-1 text-sm font-semibold text-neutral-600" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0,1fr))` }}>
          {labels.map(label => <div key={label} className="text-center">{label}</div>)}
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-[15px] font-semibold text-neutral-600">Peak Revenue</p>
          <p className="text-[20px] sm:text-[28px] font-extrabold text-neutral-900">${peak.toFixed(1)}k <span className="text-neutral-600">({peakLabel})</span></p>
        </div>
        <div>
          <p className="text-[15px] font-semibold text-neutral-600">Projected Next Month</p>
          <p className="text-[20px] sm:text-[28px] font-extrabold text-neutral-900">
            $0.0k
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityPanel() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-[26px] font-extrabold leading-tight text-black">Recent Activity</h2>
        <p className="text-neutral-600 text-[15px] mt-1">Real-time platform events</p>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center text-slate-400">
        <p className="font-semibold text-sm">No recent activity</p>
        <p className="text-xs text-slate-400 mt-1">Updates on events will appear here.</p>
      </div>
    </div>
  );
}

function RegistrationsChart() {
  const [visible, setVisible] = useState({ users: true, trainers: true });

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Mon", "Today"];
  const users = [0, 0, 0, 0, 0, 0, 0, 0];
  const trainers = [0, 0, 0, 0, 0, 0, 0, 0];
  const max = 10;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-extrabold leading-tight text-black">New Registrations</h2>
          <p className="text-neutral-600 text-[15px] mt-1">Comparing User vs. Trainer signups.</p>
        </div>
        <div className="flex items-center gap-6 text-[15px] font-semibold text-neutral-700">
          <button onClick={() => setVisible(v => ({ ...v, users: !v.users }))} className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full border border-black ${visible.users ? 'bg-black' : 'bg-white'}`}></span>
            Users
          </button>
          <button onClick={() => setVisible(v => ({ ...v, trainers: !v.trainers }))} className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full border border-slate-500 ${visible.trainers ? 'bg-slate-500' : 'bg-white'}`}></span>
            Trainers
          </button>
        </div>
      </div>

      <div className="mt-10 h-[250px] sm:h-[260px] flex items-end gap-3 sm:gap-6">
        {labels.map((label, i) => (
          <div key={label} className="flex-1 h-full flex flex-col justify-end items-center gap-3">
            <div className="w-full flex justify-center items-end gap-2 h-full">
              {visible.users && (
                <div
                  className="w-4 sm:w-5 bg-black rounded-t-md"
                  style={{ height: `${(users[i] / max) * 100}%` }}
                  title={`Users: ${users[i]}`}
                />
              )}
              {visible.trainers && (
                <div
                  className="w-4 sm:w-5 bg-slate-500 rounded-t-md"
                  style={{ height: `${(trainers[i] / max) * 100}%` }}
                  title={`Trainers: ${trainers[i]}`}
                />
              )}
              {!visible.users && !visible.trainers && (
                <div className="w-5 h-1 bg-slate-200 rounded-full" />
              )}
            </div>
            <span className="text-sm font-semibold text-neutral-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HeaderProps {
  totalUsers: number;
  verifiedTrainers: number;
  subscriptions: number;
}

function Header({ totalUsers, verifiedTrainers, subscriptions }: HeaderProps) {
  const exportData = () => {
    const csv = [
      ["Metric", "Value"],
      ["Total Users", String(totalUsers)],
      ["Verified Trainers", String(verifiedTrainers)],
      ["Total Revenue", "0.0k"],
      ["Subscriptions", String(subscriptions)]
    ].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dashboard-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-extrabold leading-tight text-black">Global Overview</h1>
          <p className="text-neutral-600 text-[15px] sm:text-[16px] mt-1">Monitoring platform performance and user growth metrics.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button onClick={exportData} className="hidden sm:flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-neutral-800 bg-white">
          <Icon.download />
          <span>Export Data</span>
        </button>
        <button className="sm:hidden p-3 border border-slate-200 rounded-xl bg-white" onClick={exportData}>
          <Icon.download />
        </button>
        <button className="relative p-2 text-neutral-800">
          <Icon.bell />
          {/* <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full"></span> */}
        </button>
        <button className="p-2 text-neutral-800">
          <Icon.settings />
        </button>
      </div>
    </header>
  );
}

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