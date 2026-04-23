import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar, Filter, Download } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";

const successRateData = [
  { day: "Mon", success: 98.2, failure: 1.3, pending: 0.5 },
  { day: "Tue", success: 97.8, failure: 1.6, pending: 0.6 },
  { day: "Wed", success: 98.5, failure: 1.1, pending: 0.4 },
  { day: "Thu", success: 97.1, failure: 2.2, pending: 0.7 },
  { day: "Fri", success: 98.8, failure: 0.9, pending: 0.3 },
  { day: "Sat", success: 99.1, failure: 0.6, pending: 0.3 },
  { day: "Sun", success: 98.9, failure: 0.8, pending: 0.3 },
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

const repaymentData = [
  { corporate: "TCS", avgDays: 8, trend: "stable" },
  { corporate: "Infosys", avgDays: 6, trend: "improving" },
  { corporate: "Wipro", avgDays: 18, trend: "worsening" },
  { corporate: "HCL Tech", avgDays: 10, trend: "stable" },
  { corporate: "L&T", avgDays: 5, trend: "improving" },
  { corporate: "Mindtree", avgDays: 12, trend: "stable" },
  { corporate: "Bajaj Finance", avgDays: 32, trend: "worsening" },
];

export default function Analytics() {
  return (
    <DashboardLayout title="Spends & Performance Analytics" subtitle="Portfolio-level and corporate-level intelligence">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-card rounded-xl border p-4">
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5"><Calendar className="w-3.5 h-3.5" /> Last 30 Days</Button>
        <Button variant="outline" size="sm" className="h-8 text-xs">All Corporates</Button>
        <Button variant="outline" size="sm" className="h-8 text-xs">All MCCs</Button>
        <Button variant="outline" size="sm" className="h-8 text-xs">All Statuses</Button>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 ml-auto"><Download className="w-3.5 h-3.5" /> Export</Button>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* UPI Success Rate */}
        <div className="bg-card rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">UPI Transaction Success Rate</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={successRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} domain={[95, 100]} unit="%" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="success" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} stackId="a" name="Success %" />
              <Bar dataKey="failure" fill="hsl(0, 84%, 60%)" radius={[0, 0, 0, 0]} stackId="a" name="Failure %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Repayment Behavior */}
        <div className="bg-card rounded-xl border p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Repayment Behavior (Avg Days)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={repaymentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} unit="d" />
              <YAxis type="category" dataKey="corporate" tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
              <Bar dataKey="avgDays" radius={[0, 4, 4, 0]} maxBarSize={16}>
                {repaymentData.map((entry, i) => (
                  <Cell key={i} fill={entry.avgDays > 15 ? "hsl(0, 84%, 60%)" : entry.avgDays > 10 ? "hsl(38, 92%, 50%)" : "hsl(142, 76%, 36%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MCC Heatmap Table */}
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
