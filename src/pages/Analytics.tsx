import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  PieChart, Pie,
} from "recharts";

/* ─── Corporates list for filter ─── */
const corporateOptions = [
  "All Corporates", "Indo Amines Ltd.", "Fermenta Biotech Ltd.", "Bajaj Healthcare Ltd.",
  "Innovana Thinklabs Ltd.", "Ksolves India Ltd.", "V2 Retail Ltd.", "Thangamayil Jewellery Ltd.",
  "Globus Power Generation Ltd.", "India Power Corporation Ltd.", "Crest Ventures Ltd.",
];

const statusOptions = ["All Statuses", "Success", "Failed", "Pending"];

/* ─── 30-day transaction volume ─── */
const txnVolumeData = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  volume: Math.floor(800 + Math.random() * 600),
}));

/* ─── Top 5 corporates by utilization ─── */
const topCorporatesUtil = [
  { name: "Indo Amines Ltd.", utilization: 95 },
  { name: "V2 Retail Ltd.", utilization: 90 },
  { name: "Ksolves India Ltd.", utilization: 85 },
  { name: "Fermenta Biotech Ltd.", utilization: 80 },
  { name: "Globus Power Gen.", utilization: 75 },
];

/* ─── Top employees by spend ─── */
const topEmployees = [
  { id: "emp_2041", corporate: "Indo Amines Ltd.", totalSpend: "₹4,82,000", txnCount: 142, avgTxn: "₹3,394" },
  { id: "emp_0812", corporate: "Ksolves India Ltd.", totalSpend: "₹3,95,000", txnCount: 98, avgTxn: "₹4,031" },
  { id: "emp_1190", corporate: "V2 Retail Ltd.", totalSpend: "₹3,21,000", txnCount: 87, avgTxn: "₹3,690" },
  { id: "emp_0567", corporate: "Fermenta Biotech Ltd.", totalSpend: "₹2,88,000", txnCount: 76, avgTxn: "₹3,789" },
  { id: "emp_3341", corporate: "Globus Power Generation Ltd.", totalSpend: "₹2,45,000", txnCount: 63, avgTxn: "₹3,889" },
  { id: "emp_4821", corporate: "Thangamayil Jewellery Ltd.", totalSpend: "₹2,12,000", txnCount: 54, avgTxn: "₹3,926" },
  { id: "emp_8812", corporate: "India Power Corporation Ltd.", totalSpend: "₹1,98,000", txnCount: 48, avgTxn: "₹4,125" },
  { id: "emp_1002", corporate: "Crest Ventures Ltd.", totalSpend: "₹1,65,000", txnCount: 41, avgTxn: "₹4,024" },
];

/* ─── MCC Category Breakdown (kept as-is) ─── */
const mccData = [
  { name: "Travel", value: 32, color: "hsl(217, 91%, 60%)" },
  { name: "F&B", value: 24, color: "hsl(142, 76%, 36%)" },
  { name: "Office Supplies", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Fuel", value: 14, color: "hsl(280, 68%, 60%)" },
  { name: "Others", value: 12, color: "hsl(220, 14%, 70%)" },
];

const mccTable = [
  { mcc: "5411", category: "Grocery Stores", txnCount: "34,210", volume: "₹8.2Cr", pctTotal: "22.4%", blocked: false },
  { mcc: "5812", category: "Restaurants", txnCount: "28,450", volume: "₹5.1Cr", pctTotal: "13.9%", blocked: false },
  { mcc: "4112", category: "Railways", txnCount: "12,830", volume: "₹4.8Cr", pctTotal: "13.1%", blocked: false },
  { mcc: "5541", category: "Fuel Stations", txnCount: "18,920", volume: "₹4.2Cr", pctTotal: "11.5%", blocked: false },
  { mcc: "5999", category: "Misc Retail", txnCount: "15,340", volume: "₹3.6Cr", pctTotal: "9.8%", blocked: false },
  { mcc: "4121", category: "Taxi/Rideshare", txnCount: "22,100", volume: "₹2.9Cr", pctTotal: "7.9%", blocked: false },
  { mcc: "5311", category: "Department Stores", txnCount: "8,450", volume: "₹2.4Cr", pctTotal: "6.6%", blocked: false },
  { mcc: "7995", category: "Gambling", txnCount: "0", volume: "₹0", pctTotal: "0%", blocked: true },
  { mcc: "5993", category: "Tobacco Stores", txnCount: "0", volume: "₹0", pctTotal: "0%", blocked: true },
];

export default function Analytics() {
  const [corpFilter, setCorpFilter] = useState("All Corporates");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  return (
    <DashboardLayout title="Spends & Performance Analytics" subtitle="Portfolio-level and corporate-level intelligence">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-card rounded-xl border p-4">
        <select
          value={corpFilter}
          onChange={(e) => setCorpFilter(e.target.value)}
          className="h-8 text-xs rounded-md border border-input bg-background px-3 text-foreground"
        >
          {corporateOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 text-xs rounded-md border border-input bg-background px-3 text-foreground"
        >
          {statusOptions.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 ml-auto"><Download className="w-3.5 h-3.5" /> Export</Button>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Line Chart: 30-day txn volume */}
        <div className="bg-card rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Transaction Volume — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={txnVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
              <Line type="monotone" dataKey="volume" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Top 5 corporates */}
        <div className="bg-card rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top 5 Corporates by Credit Utilization</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topCorporatesUtil} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {topCorporatesUtil.map((entry, i) => (
                  <Cell key={i} fill={entry.utilization > 85 ? "hsl(0, 84%, 60%)" : "hsl(217, 91%, 60%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Employees Table */}
      <div className="bg-card rounded-xl border overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold text-foreground">Top Employees by Spend</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Employee VPA", "Corporate", "Total Spend", "Txn Count", "Avg Txn"].map((h) => (
                  <th key={h} className="data-table-header text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {topEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary">{emp.id}@upi</td>
                  <td className="px-4 py-3 text-foreground">{emp.corporate}</td>
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{emp.totalSpend}</td>
                  <td className="px-4 py-3 text-muted-foreground">{emp.txnCount}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{emp.avgTxn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MCC Category Breakdown — kept as-is */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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

        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold text-foreground">MCC Category Table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  {["MCC Code", "Category", "Txn Count", "Volume", "% of Total", "Status"].map((h) => (
                    <th key={h} className="data-table-header text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {mccTable.map((row) => (
                  <tr key={row.mcc} className={cn("hover:bg-muted/30 transition-colors", row.blocked && "opacity-50")}>
                    <td className="px-4 py-3 font-mono text-foreground">{row.mcc}</td>
                    <td className="px-4 py-3 text-foreground">{row.category}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{row.txnCount}</td>
                    <td className="px-4 py-3 font-mono font-medium text-foreground">{row.volume}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.pctTotal}</td>
                    <td className="px-4 py-3">
                      <span className={row.blocked ? "status-badge-critical" : "status-badge-success"}>
                        {row.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
