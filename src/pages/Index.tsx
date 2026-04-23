import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { cn } from "@/lib/utils";
import {
  IndianRupee,
  Building2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/* ── Corporate risk heatmap data ── */
const corporateRisk = [
  { name: "Indo Amines Ltd.", sanctioned: "₹12Cr", utilized: "₹11.2Cr", available: "₹0.8Cr", utilPct: 93, risk: "High" as const },
  { name: "Innovana Thinklabs Ltd.", sanctioned: "₹8Cr", utilized: "₹7.1Cr", available: "₹0.9Cr", utilPct: 89, risk: "High" as const },
  { name: "V2 Retail Ltd.", sanctioned: "₹15Cr", utilized: "₹12.6Cr", available: "₹2.4Cr", utilPct: 84, risk: "Medium" as const },
  { name: "Globus Power Generation Ltd.", sanctioned: "₹20Cr", utilized: "₹15.4Cr", available: "₹4.6Cr", utilPct: 77, risk: "Medium" as const },
  { name: "Ksolves India Ltd.", sanctioned: "₹6Cr", utilized: "₹4.3Cr", available: "₹1.7Cr", utilPct: 72, risk: "Low" as const },
  { name: "Fermenta Biotech Ltd.", sanctioned: "₹10Cr", utilized: "₹6.5Cr", available: "₹3.5Cr", utilPct: 65, risk: "Low" as const },
  { name: "Dhanlaxmi Bank Ltd.", sanctioned: "₹25Cr", utilized: "₹14Cr", available: "₹11Cr", utilPct: 56, risk: "Low" as const },
  { name: "Hardwyn India Ltd.", sanctioned: "₹5Cr", utilized: "₹2.1Cr", available: "₹2.9Cr", utilPct: 42, risk: "Low" as const },
];

/* ── Real-time transaction feed ── */
const recentTxns = [
  { id: "1", corporate: "Indo Amines Ltd.", employee: "emp_4821@upi", amount: "₹12,450", status: "Success" as const, time: "Just now" },
  { id: "2", corporate: "V2 Retail Ltd.", employee: "emp_1190@upi", amount: "₹2,340", status: "Success" as const, time: "1 min ago" },
  { id: "3", corporate: "Ksolves India Ltd.", employee: "emp_0567@upi", amount: "₹8,920", status: "Pending" as const, time: "2 min ago" },
  { id: "4", corporate: "Innovana Thinklabs Ltd.", employee: "emp_3341@upi", amount: "₹34,500", status: "Failed" as const, time: "3 min ago" },
  { id: "5", corporate: "Globus Power Generation Ltd.", employee: "emp_2234@upi", amount: "₹5,600", status: "Success" as const, time: "4 min ago" },
  { id: "6", corporate: "Fermenta Biotech Ltd.", employee: "emp_8812@upi", amount: "₹1,850", status: "Success" as const, time: "5 min ago" },
  { id: "7", corporate: "Dhanlaxmi Bank Ltd.", employee: "emp_1002@upi", amount: "₹3,200", status: "Pending" as const, time: "6 min ago" },
  { id: "8", corporate: "Hardwyn India Ltd.", employee: "emp_7721@upi", amount: "₹950", status: "Success" as const, time: "7 min ago" },
];

/* ── Alerts ── */
interface Alert {
  id: string;
  severity: "critical" | "high" | "medium";
  title: string;
  entity: string;
  time: string;
}

const alerts: Alert[] = [
  { id: "1", severity: "critical", title: "Velocity breach detected", entity: "Indo Amines Ltd. — VPA emp_4821", time: "2 min ago" },
  { id: "2", severity: "high", title: "Recon SLA breach in 45 min", entity: "NPCI Batch #T2024-1847", time: "18 min ago" },
  { id: "3", severity: "high", title: "MCC policy violation attempt", entity: "V2 Retail — MCC 7995 (Gambling)", time: "34 min ago" },
  { id: "4", severity: "medium", title: "Limit utilization at 93%", entity: "Indo Amines Ltd. — Sanctioned ₹12Cr", time: "1 hr ago" },
  { id: "5", severity: "medium", title: "KYC renewal due in 15 days", entity: "Cupid Ltd.", time: "3 hr ago" },
];

const sevConfig = {
  critical: { badge: "status-badge-critical", icon: ShieldAlert },
  high: { badge: "status-badge-warning", icon: AlertTriangle },
  medium: { badge: "status-badge-info", icon: Clock },
};

const statusBadge = (s: string) => {
  if (s === "Success") return "status-badge-success";
  if (s === "Failed") return "status-badge-critical";
  return "status-badge-warning";
};

const riskBadge = (r: string) => {
  if (r === "High") return "status-badge-critical";
  if (r === "Medium") return "status-badge-warning";
  return "status-badge-success";
};

const Index = () => {
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set());
  const activeAlerts = alerts.filter((a) => !resolvedAlerts.has(a.id));

  const resolve = (id: string) => {
    setResolvedAlerts((prev) => new Set(prev).add(id));
  };

  return (
    <DashboardLayout title="Portfolio Dashboard" subtitle="Credit Line on UPI — Bank Command Center">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="kpi-tile">
          <span className="text-kpi-label uppercase text-muted-foreground flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" /> Total Sanctioned / Utilized
          </span>
          <span className="text-kpi text-foreground">₹842Cr <span className="text-sm font-normal text-muted-foreground">/ ₹1,250Cr</span></span>
          <Progress value={67.4} className="h-2 mt-1" />
          <span className="text-xs text-muted-foreground">67.4% overall utilization</span>
        </div>
        <KpiTile
          label="Active Corporates"
          value="20"
          subtitle="3 onboarding · 1 frozen"
          change={{ value: "2", positive: true }}
          icon={<Building2 className="w-4 h-4" />}
        />
        <KpiTile
          label="Open High-Severity Alerts"
          value={String(activeAlerts.filter((a) => a.severity === "critical" || a.severity === "high").length)}
          subtitle={`${activeAlerts.length} total open`}
          alert
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <KpiTile
          label="Today's UPI Spends"
          value="₹18.4Cr"
          subtitle="vs ₹16.1Cr 30-day avg"
          change={{ value: "14.3%", positive: true }}
          icon={<IndianRupee className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left 2 cols */}
        <div className="xl:col-span-2 space-y-4">
          {/* Risk Heatmap Table */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Risk Heatmap — Corporates by Utilization</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Corporate", "Sanctioned", "Utilized", "Available", "Util %", "Risk Status"].map((h) => (
                      <th key={h} className="data-table-header text-left px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {corporateRisk.map((c) => (
                    <tr key={c.name} className="hover:bg-muted/30 cursor-pointer transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{c.sanctioned}</td>
                      <td className="px-4 py-3 font-mono text-foreground">{c.utilized}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{c.available}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", c.utilPct > 85 ? "bg-critical" : c.utilPct > 70 ? "bg-warning" : "bg-primary")}
                              style={{ width: `${c.utilPct}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground">{c.utilPct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={riskBadge(c.risk)}>{c.risk}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-Time Transaction Feed */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Real-Time Transaction Feed</h3>
            </div>
            <div className="divide-y max-h-[320px] overflow-y-auto">
              {recentTxns.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{tx.corporate}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{tx.employee}</p>
                  </div>
                  <span className="text-xs font-mono font-medium text-foreground mx-3">{tx.amount}</span>
                  <span className={cn("text-[10px]", statusBadge(tx.status))}>{tx.status}</span>
                  <span className="text-[10px] text-muted-foreground ml-3 w-16 text-right">{tx.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col — Action Hub */}
        <div className="xl:col-span-1">
          <div className="bg-card rounded-xl border flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Action Hub — Active Alerts</h3>
              <span className="status-badge-critical text-[10px]">{activeAlerts.length} Open</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y">
              {activeAlerts.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                  All alerts resolved
                </div>
              )}
              {activeAlerts.map((alert) => {
                const config = sevConfig[alert.severity];
                const Icon = config.icon;
                return (
                  <div key={alert.id} className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className={cn("mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0", config.badge)}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{alert.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{alert.entity}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-2 text-[10px] text-primary"
                            onClick={() => resolve(alert.id)}
                          >
                            Quick Resolve <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
