import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IndianRupee,
  Building2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Eye,
  ArrowUpRight,
  Zap,
} from "lucide-react";

/* ─── Corporate risk data ─── */
const corporateRisk = [
  { name: "Indo Amines Ltd.", sanctioned: "₹12Cr", utilized: "₹11.4Cr", available: "₹0.6Cr", utilPct: 95, risk: "Critical" as const },
  { name: "V2 Retail Ltd.", sanctioned: "₹18Cr", utilized: "₹16.2Cr", available: "₹1.8Cr", utilPct: 90, risk: "High" as const },
  { name: "Ksolves India Ltd.", sanctioned: "₹8Cr", utilized: "₹6.8Cr", available: "₹1.2Cr", utilPct: 85, risk: "High" as const },
  { name: "Fermenta Biotech Ltd.", sanctioned: "₹25Cr", utilized: "₹20Cr", available: "₹5Cr", utilPct: 80, risk: "Medium" as const },
  { name: "Globus Power Generation Ltd.", sanctioned: "₹30Cr", utilized: "₹22.5Cr", available: "₹7.5Cr", utilPct: 75, risk: "Medium" as const },
  { name: "Thangamayil Jewellery Ltd.", sanctioned: "₹15Cr", utilized: "₹9Cr", available: "₹6Cr", utilPct: 60, risk: "Low" as const },
  { name: "India Power Corporation Ltd.", sanctioned: "₹40Cr", utilized: "₹20Cr", available: "₹20Cr", utilPct: 50, risk: "Low" as const },
  { name: "Crest Ventures Ltd.", sanctioned: "₹10Cr", utilized: "₹3.5Cr", available: "₹6.5Cr", utilPct: 35, risk: "Low" as const },
];

const riskBadge = (r: string) => {
  switch (r) {
    case "Critical": return "status-badge-critical";
    case "High": return "status-badge-warning";
    case "Medium": return "status-badge-info";
    default: return "status-badge-success";
  }
};

/* ─── Recent transactions feed ─── */
const recentTxns = [
  { id: "1", corporate: "Indo Amines Ltd.", employee: "emp_2041@upi", amount: "₹14,500", status: "Success" as const, time: "Just now" },
  { id: "2", corporate: "Ksolves India Ltd.", employee: "emp_0812@upi", amount: "₹3,200", status: "Success" as const, time: "1 min ago" },
  { id: "3", corporate: "V2 Retail Ltd.", employee: "emp_1190@upi", amount: "₹8,900", status: "Pending" as const, time: "2 min ago" },
  { id: "4", corporate: "Fermenta Biotech Ltd.", employee: "emp_0567@upi", amount: "₹22,000", status: "Failed" as const, time: "3 min ago" },
  { id: "5", corporate: "Globus Power Generation Ltd.", employee: "emp_3341@upi", amount: "₹5,600", status: "Success" as const, time: "4 min ago" },
  { id: "6", corporate: "Thangamayil Jewellery Ltd.", employee: "emp_4821@upi", amount: "₹1,850", status: "Success" as const, time: "5 min ago" },
  { id: "7", corporate: "India Power Corporation Ltd.", employee: "emp_8812@upi", amount: "₹41,200", status: "Success" as const, time: "6 min ago" },
  { id: "8", corporate: "Crest Ventures Ltd.", employee: "emp_1002@upi", amount: "₹7,300", status: "Pending" as const, time: "8 min ago" },
];

const txnStatusBadge = (s: string) => {
  switch (s) {
    case "Success": return "status-badge-success";
    case "Pending": return "status-badge-warning";
    default: return "status-badge-critical";
  }
};

/* ─── Alerts ─── */
interface Alert {
  id: string;
  severity: "critical" | "high" | "medium";
  title: string;
  entity: string;
  time: string;
}

const alerts: Alert[] = [
  { id: "1", severity: "critical", title: "Velocity breach detected", entity: "Indo Amines Ltd. — VPA emp_2041", time: "2 min ago" },
  { id: "2", severity: "high", title: "Recon SLA breach in 45 min", entity: "NPCI Batch #T2026-1847", time: "18 min ago" },
  { id: "3", severity: "high", title: "MCC policy violation attempt", entity: "V2 Retail Ltd. — MCC 7995", time: "34 min ago" },
  { id: "4", severity: "medium", title: "Limit utilization at 95%", entity: "Indo Amines Ltd. — ₹12Cr sanctioned", time: "1 hr ago" },
  { id: "5", severity: "medium", title: "KYC renewal due in 15 days", entity: "Fermenta Biotech Ltd.", time: "3 hr ago" },
];

const sevConfig = {
  critical: { badge: "status-badge-critical", icon: ShieldAlert },
  high: { badge: "status-badge-warning", icon: AlertTriangle },
  medium: { badge: "status-badge-info", icon: Clock },
};

const Index = () => {
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);
  const activeAlerts = alerts.filter((a) => !resolvedAlerts.includes(a.id));

  const totalSanctioned = 1250;
  const totalUtilized = 842;
  const utilPct = ((totalUtilized / totalSanctioned) * 100).toFixed(1);

  return (
    <DashboardLayout title="Portfolio Dashboard" subtitle="Credit Line on UPI — Bank Command Center">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="kpi-tile">
          <div className="flex items-center justify-between">
            <span className="text-kpi-label uppercase text-muted-foreground">Total Sanctioned / Utilized</span>
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-kpi text-foreground">₹{totalUtilized}Cr <span className="text-sm font-normal text-muted-foreground">/ ₹{totalSanctioned}Cr</span></span>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${utilPct}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{utilPct}% utilized</span>
        </div>
        <KpiTile
          label="Active Corporates"
          value="20"
          subtitle="Across 6 industries"
          icon={<Building2 className="w-4 h-4" />}
        />
        <KpiTile
          label="Today's UPI Spends"
          value="₹18.4Cr"
          subtitle="vs ₹16.1Cr 30-day avg"
          change={{ value: "14.3%", positive: true }}
          icon={<Zap className="w-4 h-4" />}
        />
        <KpiTile
          label="Open High-Severity Alerts"
          value={String(activeAlerts.filter((a) => a.severity === "critical" || a.severity === "high").length)}
          subtitle={`${activeAlerts.length} total open`}
          alert
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>

      {/* Main grid: heatmap + feed left, action hub right */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 space-y-4">
          {/* Risk Heatmap Table */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Corporate Risk Heatmap</h3>
              <p className="text-xs text-muted-foreground">Sorted by utilization % descending</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {["Corporate Name", "Sanctioned", "Utilized", "Available", "Util %", "Risk Status"].map((h) => (
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
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", c.utilPct > 85 ? "bg-critical" : c.utilPct > 70 ? "bg-warning" : "bg-primary")}
                              style={{ width: `${c.utilPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{c.utilPct}%</span>
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
              {recentTxns.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{txn.corporate}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{txn.employee}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-sm font-mono font-medium text-foreground">{txn.amount}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <span className={cn("text-[10px]", txnStatusBadge(txn.status))}>{txn.status}</span>
                      <span className="text-[10px] text-muted-foreground">{txn.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Hub — Alerts */}
        <div className="xl:col-span-1">
          <div className="bg-card rounded-xl border flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Action Hub</h3>
              <span className="status-badge-critical text-[10px]">{activeAlerts.length} Open</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y">
              {activeAlerts.length === 0 && (
                <div className="p-6 text-center text-xs text-muted-foreground">All alerts resolved ✓</div>
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
                            onClick={() => setResolvedAlerts((prev) => [...prev, alert.id])}
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
