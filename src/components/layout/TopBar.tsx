import { useState } from "react";
import { Bell, Search, CheckCircle2, ShieldAlert, AlertTriangle, Clock, ArrowUpRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  severity: "critical" | "high" | "medium";
  title: string;
  entity: string;
  time: string;
}

const defaultNotifications: Notification[] = [
  { id: "1", severity: "critical", title: "Velocity breach detected", entity: "Indo Amines Ltd. — VPA emp_4821", time: "2 min ago" },
  { id: "2", severity: "high", title: "Recon SLA breach in 45 min", entity: "NPCI Batch #T2024-1847", time: "18 min ago" },
  { id: "3", severity: "high", title: "MCC policy violation attempt", entity: "V2 Retail — MCC 7995 (Gambling)", time: "34 min ago" },
  { id: "4", severity: "medium", title: "Limit utilization at 93%", entity: "Indo Amines Ltd. — Sanctioned ₹12Cr", time: "1 hr ago" },
  { id: "5", severity: "medium", title: "KYC renewal due in 15 days", entity: "Cupid Ltd.", time: "3 hr ago" },
  { id: "6", severity: "high", title: "Unusual txn pattern flagged", entity: "Innovana Thinklabs — emp_3341", time: "4 hr ago" },
  { id: "7", severity: "medium", title: "NACH mandate bounce", entity: "Hardwyn India Ltd.", time: "5 hr ago" },
];

const sevConfig = {
  critical: { badge: "status-badge-critical", icon: ShieldAlert, label: "Critical" },
  high: { badge: "status-badge-warning", icon: AlertTriangle, label: "High" },
  medium: { badge: "status-badge-info", icon: Clock, label: "Medium" },
};

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
  const [open, setOpen] = useState(false);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  const count = notifications.length;

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-card shrink-0">
      <div>
        <h1 className="text-lg font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground -mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* CBS Sync Status */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span>CBS Synced</span>
        </div>

        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search corporates, VPAs, txns..."
            className="w-64 h-8 pl-8 text-xs"
          />
        </div>

        {/* Notifications */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-critical text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {count}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0" sideOffset={8}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
              {count > 0 && (
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px] text-muted-foreground" onClick={dismissAll}>
                  Clear all
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-success" />
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => {
                  const config = sevConfig[n.severity];
                  const Icon = config.icon;
                  return (
                    <div key={n.id} className="flex items-start gap-2.5 p-3 hover:bg-muted/50 transition-colors group">
                      <div className={cn("mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0", config.badge)}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{n.entity}</p>
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                        onClick={() => dismiss(n.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            RA
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-foreground">Rajesh Agarwal</p>
            <p className="text-[10px] text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
