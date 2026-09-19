interface StatCardProps {
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  value: string;
}

export function StatCard({ iconBg, iconColor, icon, title, value }: StatCardProps) {
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