import { useState } from "react";


export function RegistrationsChart() {
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
