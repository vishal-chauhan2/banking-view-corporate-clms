import { Bell, Search, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
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
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-critical text-[10px] font-bold text-primary-foreground flex items-center justify-center">
            7
          </span>
        </Button>

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
