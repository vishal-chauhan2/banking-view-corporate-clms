import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiTileProps {
  label: string;
  value: string;
  change?: { value: string; positive: boolean };
  subtitle?: string;
  icon?: React.ReactNode;
  alert?: boolean;
}

export function KpiTile({ label, value, change, subtitle, icon, alert }: KpiTileProps) {
  return (
    <div className={cn("kpi-tile", alert && "border-critical/30")}>
      <div className="flex items-center justify-between">
        <span className="text-kpi-label uppercase text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-kpi text-foreground">{value}</span>
        {change && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium mb-1",
              change.positive ? "text-success" : "text-critical"
            )}
          >
            {change.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {change.value}
          </span>
        )}
      </div>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </div>
  );
}
