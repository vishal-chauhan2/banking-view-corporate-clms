import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── Corporates list ── */
const corporateOptions = [
  "All Corporates", "Indo Amines Ltd.", "Fermenta Biotech Ltd.", "Innovana Thinklabs Ltd.",
  "V2 Retail Ltd.", "Globus Power Generation Ltd.", "Ksolves India Ltd.", "Dhanlaxmi Bank Ltd.",
];

const statusOptions = ["All Statuses", "Success", "Failed", "Pending"];

/* ── 30-day volume data ── */
const volumeData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 3, i + 1);
  return {
    date: `${d.getDate()} Apr`,
    volume: Math.floor(800 + Math.random() * 600),
  };
});

/* ── Top 5 corporates by utilization ── */
const topCorporates = [
  { name: "Indo Amines", utilization: 93 },
  { name: "Innovana Thinklabs", utilization: 89 },
  { name: "V2 Retail", utilization: 84 },
  { name: "Globus Power", utilization: 77 },
  { name: "Ksolves India", utilization: 72 },
];

/* ── Top employees by spend ── */
const topEmployees = [
  { employee: "emp_4821@upi", corporate: "Indo Amines Ltd.", spend: "₹4,82,100", txnCount: 142 },
  { employee: "emp_1190@upi", corporate: "V2 Retail Ltd.", spend: "₹3,45,600", txnCount: 98 },
  { employee: "emp_0567@upi", corporate: "Innovana Thinklabs Ltd.", spend: "₹2,89,400", txnCount: 87 },
  { employee: "emp_3341@upi", corporate: "Globus Power Generation Ltd.", spend: "₹2,34,500", txnCount: 76 },
  { employee: "emp_2234@upi", corporate: "Ksolves India Ltd.", spend: "₹1,95,200", txnCount: 64 },
  { employee: "emp_8812@upi", corporate: "Fermenta Biotech Ltd.", spend: "₹1,72,800", txnCount: 55 },
  { employee: "emp_1002@upi", corporate: "Dhanlaxmi Bank Ltd.", spend: "₹1,48,300", txnCount: 48 },
  { employee: "emp_7721@upi", corporate: "Hardwyn India Ltd.", spend: "₹1,12,600", txnCount: 39 },
];

/* ── MCC Category Breakdown (kept as-is) ── */
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
  const [corporate, setCorporate] = useState("All Corporates");
  const [status, setStatus] = useState("All Statuses");

  return (
    <DashboardLayout title="Spends & Performance Analytics" subtitle="Portfolio-level and corporate-level intelligence">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-card rounded-xl border p-4">
        <Select value={corporate} onValueChange={setCorporate}>
          <SelectTrigger className="w-[200px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {corporateOptions.map((c) => (
              <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 ml-auto"><Download className="w-3.5 h-3.5" /> Export</Button>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Line: 30-day volume */}
        <div className="bg-card rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Transaction Volume — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
              <Line type="monotone" dataKey="volume" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: Top 5 corporates */}
        <div className="bg-card rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top 5 Corporates by Credit Utilization</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topCorporates} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {topCorporates.map((entry, i) => (
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
                {["Employee VPA", "Corporate", "Total Spend", "Txn Count"].map((h) => (
                  <th key={h} className="data-table-header text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {topEmployees.map((e) => (
                <tr key={e.employee} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-primary">{e.employee}</td>
                  <td className="px-4 py-3 text-foreground">{e.corporate}</td>
                  <td className="px-4 py-3 font-mono font-medium text-foreground">{e.spend}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.txnCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MCC Category Breakdown (kept as-is) */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold text-foreground">MCC Category Breakdown</h3>
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
    </DashboardLayout>
  );
}
