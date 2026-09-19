interface RevenueChartProps {
  range: string;
  setRange: (r: string) => void;
}

export function RevenueChart({ range, setRange }: RevenueChartProps) {
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