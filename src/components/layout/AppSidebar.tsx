import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  ArrowLeftRight,
  ShieldAlert,
  CreditCard,
  FileText,
  UserCog,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Portfolio Dashboard", icon: LayoutDashboard, path: "/", section: "Overview" },
  { label: "Corporate Clients", icon: Building2, path: "/corporates", section: "Management" },
  { label: "Employee & VPA", icon: Users, path: "/employees", section: "Management" },
  { label: "Spends & Analytics", icon: TrendingUp, path: "/analytics", section: "Intelligence" },
  { label: "Recon & Settlements", icon: ArrowLeftRight, path: "/reconciliation", section: "Operations" },
  { label: "Risk & Compliance", icon: ShieldAlert, path: "/risk", section: "Operations" },
  { label: "Limit Management", icon: CreditCard, path: "/limits", section: "Operations" },
  { label: "Regulatory MIS", icon: FileText, path: "/reports", section: "Compliance" },
  { label: "User Management", icon: UserCog, path: "/users", section: "Administration" },
  { label: "Audit Trail", icon: ClipboardList, path: "/audit", section: "Administration" },
  { label: "Configuration", icon: Settings, path: "/settings", section: "Administration" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sections = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const section = item.section || "Other";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Landmark className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-sidebar-accent-foreground truncate">CreditLine UPI</span>
            <span className="text-[10px] text-sidebar-muted truncate">Bank Admin Portal</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            {!collapsed && <div className="nav-section-label">{section}</div>}
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 mx-2 px-2.5 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 flex items-center justify-center border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
