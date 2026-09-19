export function ActivityPanel() {
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