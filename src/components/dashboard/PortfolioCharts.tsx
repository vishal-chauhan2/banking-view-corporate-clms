import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const utilizationData = [
  { month: "Oct", utilization: 42, limit: 100 },
  { month: "Nov", utilization: 48, limit: 100 },
  { month: "Dec", utilization: 55, limit: 100 },
  { month: "Jan", utilization: 61, limit: 100 },
  { month: "Feb", utilization: 58, limit: 100 },
  { month: "Mar", utilization: 67, limit: 100 },
];

const topCorporates = [
  { name: "TCS", utilization: 92, npa: false },
  { name: "Infosys", utilization: 87, npa: false },
  { name: "Wipro", utilization: 81, npa: true },
  { name: "HCL Tech", utilization: 74, npa: false },
  { name: "Tech Mah.", utilization: 68, npa: false },
  { name: "L&T", utilization: 63, npa: false },
  { name: "Mindtree", utilization: 57, npa: false },
  { name: "Mphasis", utilization: 52, npa: false },
];

const mccData = [
  { name: "Travel", value: 32, color: "hsl(217, 91%, 60%)" },
  { name: "F&B", value: 24, color: "hsl(142, 76%, 36%)" },
  { name: "Office Supplies", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Fuel", value: 14, color: "hsl(280, 68%, 60%)" },
  { name: "Others", value: 12, color: "hsl(220, 14%, 70%)" },
];

const settlementData = [
  { stage: "Received", count: 12400, status: "done" },
  { stage: "Matched", count: 12340, status: "done" },
  { stage: "Exceptions", count: 48, status: "pending" },
  { stage: "Posted", count: 12280, status: "done" },
  { stage: "Disputed", count: 12, status: "alert" },
];

export function UtilizationTrend() {
  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Portfolio Utilization Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={utilizationData}>
          <defs>
            <linearGradient id="utilizationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
          <Area type="monotone" dataKey="utilization" stroke="hsl(217, 91%, 60%)" fill="url(#utilizationGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopCorporatesChart() {
  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Top Corporates by Utilization</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={topCorporates} layout="vertical" margin={{ left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} width={70} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
          <Bar dataKey="utilization" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {topCorporates.map((entry, i) => (
              <Cell key={i} fill={entry.npa ? "hsl(0, 84%, 60%)" : "hsl(217, 91%, 60%)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MccBreakdown() {
  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">MCC Spend Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={mccData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {mccData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
          <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SettlementTimeline() {
  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Today's Settlement Pipeline</h3>
      <div className="flex items-center justify-between gap-2 mt-6">
        {settlementData.map((item, i) => (
          <div key={item.stage} className="flex-1 flex flex-col items-center relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                item.status === "done"
                  ? "bg-success/10 text-success"
                  : item.status === "alert"
                  ? "bg-critical/10 text-critical"
                  : "bg-warning/10 text-warning animate-pulse-soft"
              }`}
            >
              {item.count > 999 ? `${(item.count / 1000).toFixed(1)}k` : item.count}
            </div>
            <span className="text-[10px] text-muted-foreground mt-1.5 text-center">{item.stage}</span>
            {i < settlementData.length - 1 && (
              <div className="absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
