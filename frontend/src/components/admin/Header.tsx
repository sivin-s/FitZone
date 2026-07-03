interface HeaderProps {
  totalUsers: number;
  verifiedTrainers: number;
  subscriptions: number;
}

export function Header({ totalUsers, verifiedTrainers, subscriptions }: HeaderProps) {
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