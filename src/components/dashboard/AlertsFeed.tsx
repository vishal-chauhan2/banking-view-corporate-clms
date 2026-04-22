import { AlertTriangle, ShieldAlert, Clock, Eye, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  entity: string;
  time: string;
  action: string;
}

const alerts: Alert[] = [
  { id: "1", severity: "critical", title: "Velocity breach detected", entity: "Infosys Ltd — VPA emp_4821", time: "2 min ago", action: "Review" },
  { id: "2", severity: "high", title: "Recon SLA breach in 45 min", entity: "NPCI Batch #T2024-1847", time: "18 min ago", action: "Resolve" },
  { id: "3", severity: "high", title: "MCC policy violation attempt", entity: "Wipro — MCC 7995 (Gambling)", time: "34 min ago", action: "Review" },
  { id: "4", severity: "medium", title: "Limit utilization at 92%", entity: "TCS — Sanctioned ₹50Cr", time: "1 hr ago", action: "Review" },
  { id: "5", severity: "medium", title: "KYC renewal due in 15 days", entity: "HCL Technologies", time: "3 hr ago", action: "View" },
  { id: "6", severity: "low", title: "Dormant VPA reactivated", entity: "Tech Mahindra — VPA emp_1002", time: "5 hr ago", action: "Log" },
];

const severityConfig = {
  critical: { badge: "status-badge-critical", icon: ShieldAlert },
  high: { badge: "status-badge-warning", icon: AlertTriangle },
  medium: { badge: "status-badge-info", icon: Clock },
  low: { badge: "status-badge-success", icon: Eye },
};

export function AlertsFeed() {
  return (
    <div className="bg-card rounded-xl border flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-sm font-semibold text-foreground">Alerts & Actions</h3>
        <span className="status-badge-critical text-[10px]">7 Open</span>
      </div>
      <div className="flex-1 overflow-y-auto divide-y">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
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
                    <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-primary">
                      {alert.action} <ArrowUpRight className="w-2.5 h-2.5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
