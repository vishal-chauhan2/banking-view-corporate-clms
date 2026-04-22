import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldAlert, AlertTriangle, Zap, MapPin, CreditCard, Clock, Eye, CheckCircle2, XCircle } from "lucide-react";

interface RiskAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  entity: string;
  time: string;
  status: "Open" | "Under Review" | "Resolved" | "Dismissed";
}

const riskAlerts: RiskAlert[] = [
  { id: "RA-001", severity: "critical", type: "Velocity Breach", description: "47 transactions in 5 minutes from single VPA", entity: "Infosys — emp_4821@upi", time: "2 min ago", status: "Open" },
  { id: "RA-002", severity: "critical", type: "Geo Anomaly", description: "Transaction from Chennai, last txn 3 min ago from Mumbai", entity: "TCS — emp_1190@upi", time: "8 min ago", status: "Under Review" },
  { id: "RA-003", severity: "high", type: "MCC Violation", description: "Attempted purchase at MCC 7995 (Gambling)", entity: "Wipro — emp_0567@upi", time: "34 min ago", status: "Open" },
  { id: "RA-004", severity: "high", type: "Limit Spike", description: "85% utilization consumed in single 2-hour session", entity: "Mindtree — emp_7712@upi", time: "1 hr ago", status: "Open" },
  { id: "RA-005", severity: "medium", type: "Repayment Default", description: "Payment overdue by 5 days, DPD risk escalating", entity: "Bajaj Finance Ltd", time: "3 hr ago", status: "Open" },
  { id: "RA-006", severity: "medium", type: "Dormant Reactivation", description: "VPA inactive for 90 days, sudden ₹2.4L spend", entity: "Tech Mahindra — emp_1002@upi", time: "5 hr ago", status: "Under Review" },
  { id: "RA-007", severity: "low", type: "Failed PIN", description: "3 consecutive failed PIN attempts", entity: "HCL — emp_3341@upi", time: "6 hr ago", status: "Resolved" },
];

const severityColors = {
  critical: "status-badge-critical",
  high: "status-badge-warning",
  medium: "status-badge-info",
  low: "text-muted-foreground bg-muted",
};

const statusColors = {
  "Open": "status-badge-critical",
  "Under Review": "status-badge-warning",
  "Resolved": "status-badge-success",
  "Dismissed": "text-muted-foreground bg-muted",
};

const typeIcons: Record<string, React.ElementType> = {
  "Velocity Breach": Zap,
  "Geo Anomaly": MapPin,
  "MCC Violation": CreditCard,
  "Limit Spike": AlertTriangle,
  "Repayment Default": Clock,
  "Dormant Reactivation": Eye,
  "Failed PIN": ShieldAlert,
};

export default function RiskCompliance() {
  return (
    <DashboardLayout title="Risk, Fraud & Compliance" subtitle="Real-time threat monitoring & policy enforcement">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiTile label="Open Alerts" value="23" subtitle="3 critical · 8 high" alert icon={<AlertTriangle className="w-4 h-4" />} />
        <KpiTile label="False Positive Rate" value="1.8%" subtitle="Target: < 2.0%" icon={<CheckCircle2 className="w-4 h-4 text-success" />} />
        <KpiTile label="Auto-Frozen Today" value="2" subtitle="VPAs auto-blocked" icon={<XCircle className="w-4 h-4 text-critical" />} />
        <KpiTile label="MCC Blocks Active" value="14" subtitle="Global + 28 corporate-specific" icon={<CreditCard className="w-4 h-4" />} />
        <KpiTile label="KYC Expiring (30d)" value="8" subtitle="Corporates need renewal" alert icon={<Clock className="w-4 h-4" />} />
      </div>

      {/* Alert severity tabs */}
      <div className="flex gap-2 mb-4">
        {["All (23)", "Critical (3)", "High (8)", "Medium (7)", "Low (5)"].map((tab, i) => (
          <button
            key={tab}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {["ID", "Severity", "Type", "Description", "Entity", "Time", "Status", "Actions"].map((h) => (
                  <th key={h} className="data-table-header text-left px-3 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {riskAlerts.map((alert) => {
                const Icon = typeIcons[alert.type] || ShieldAlert;
                return (
                  <tr key={alert.id} className={cn("hover:bg-muted/30 transition-colors", alert.severity === "critical" && "bg-critical/5")}>
                    <td className="px-3 py-3 font-mono text-primary">{alert.id}</td>
                    <td className="px-3 py-3"><span className={cn("status-badge", severityColors[alert.severity])}>{alert.severity}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-foreground">{alert.type}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground max-w-[250px]">{alert.description}</td>
                    <td className="px-3 py-3 font-mono text-foreground">{alert.entity}</td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{alert.time}</td>
                    <td className="px-3 py-3"><span className={cn("status-badge", statusColors[alert.status])}>{alert.status}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">Review</Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">Escalate</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
