import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Download, Filter, User, CreditCard, ShieldAlert, Settings, UserPlus } from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  details: string;
  outcome: "Success" | "Failed" | "Pending";
  icon: React.ElementType;
}

const auditEntries: AuditEntry[] = [
  { id: "AUD-2024-18471", timestamp: "22 Apr 2026 09:42:18", user: "Priya Sharma", role: "RM", action: "Limit Change Request", entity: "TCS — ₹50Cr → ₹60Cr", details: "Justification: Q2 hiring expansion. Supporting docs attached.", outcome: "Pending", icon: CreditCard },
  { id: "AUD-2024-18470", timestamp: "22 Apr 2026 09:38:05", user: "Vikram Singh", role: "Risk Officer", action: "Alert Escalated", entity: "RA-001 — Infosys velocity breach", details: "Auto-freeze triggered. Escalated to compliance team.", outcome: "Success", icon: ShieldAlert },
  { id: "AUD-2024-18469", timestamp: "22 Apr 2026 09:15:33", user: "Rajesh Agarwal", role: "Super Admin", action: "User Role Modified", entity: "Neha Gupta — RM → Senior RM", details: "Access scope expanded to include 12 additional corporates.", outcome: "Success", icon: User },
  { id: "AUD-2024-18468", timestamp: "22 Apr 2026 08:55:12", user: "System", role: "Automated", action: "NPCI File Processed", entity: "Batch #T2024-1847", details: "12,400 transactions parsed. 99.5% auto-matched.", outcome: "Success", icon: Settings },
  { id: "AUD-2024-18467", timestamp: "22 Apr 2026 08:30:00", user: "Amit Kumar", role: "RM", action: "Corporate Onboarded", entity: "Zensar Technologies Ltd", details: "KYC verified. Sanctioned limit: ₹8Cr. 200 VPAs allocated.", outcome: "Success", icon: UserPlus },
  { id: "AUD-2024-18466", timestamp: "21 Apr 2026 18:45:22", user: "Vikram Singh", role: "Risk Officer", action: "MCC Blocklist Updated", entity: "Global — Added MCC 5993 (Tobacco)", details: "Impact: 42 active VPAs affected. Approved by Rajesh Agarwal.", outcome: "Success", icon: ShieldAlert },
  { id: "AUD-2024-18465", timestamp: "21 Apr 2026 17:20:10", user: "Priya Sharma", role: "RM", action: "Credit Line Freeze Request", entity: "Bajaj Finance — Repayment default", details: "Request submitted. Pending dual approval. Reason: 32-day DPD.", outcome: "Pending", icon: CreditCard },
];

const outcomeColors = {
  Success: "status-badge-success",
  Failed: "status-badge-critical",
  Pending: "status-badge-warning",
};

export default function AuditTrail() {
  return (
    <DashboardLayout title="Audit Trail & Activity Log" subtitle="Immutable record of all system actions · 7-year retention per RBI guidelines">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search by user, action, entity..." className="pl-8 h-9 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"><Filter className="w-3.5 h-3.5" /> Filters</Button>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 ml-auto"><Download className="w-3.5 h-3.5" /> Export for Audit</Button>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {auditEntries.map((entry) => {
          const Icon = entry.icon;
          return (
            <div key={entry.id} className="bg-card rounded-xl border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{entry.action}</span>
                    <span className={cn("status-badge", outcomeColors[entry.outcome])}>{entry.outcome}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{entry.entity}</p>
                  <p className="text-xs text-muted-foreground mt-1">{entry.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                    <span className="font-mono">{entry.id}</span>
                    <span>{entry.user} ({entry.role})</span>
                    <span>{entry.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
