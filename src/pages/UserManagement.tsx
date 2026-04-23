import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Users,
  Eye,
  UserPlus,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  Ban,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ── Role definitions ───────────────────────────────────────
interface RoleDef {
  id: string;
  label: string;
  department: string;
  tags: string[];
  description: string;
  icon: React.ElementType;
}

const ROLES: RoleDef[] = [
  { id: "super_admin", label: "Super Admin", department: "Platform Administration", tags: ["Full access", "Checker"], description: "Full system access. Manages all bank users, global config, and audit exports.", icon: ShieldCheck },
  { id: "platform_admin", label: "Platform Admin", department: "Platform Administration", tags: ["Config access", "Maker"], description: "Manages platform-level configuration — MCC blocklists, velocity rules, fee structures.", icon: Shield },
  { id: "rm", label: "Relationship Manager", department: "Relationship Management", tags: ["Maker", "Assigned scope"], description: "Manages assigned corporate clients. Initiates limit changes, onboards corporates.", icon: Users },
  { id: "rm_lead", label: "RM Team Lead / Zonal Head", department: "Relationship Management", tags: ["Zone view", "RM management"], description: "Oversees a team of RMs. Views all corporates in their zone.", icon: Users },
  { id: "credit_officer", label: "Credit Officer", department: "Relationship Management", tags: ["Checker", "All corporates"], description: "Reviews and approves RM-initiated limit change requests.", icon: ShieldCheck },
  { id: "risk_officer", label: "Risk Officer", department: "Risk & Compliance", tags: ["Risk config", "Checker"], description: "Monitors real-time fraud alerts, configures MCC blocklists and velocity rules.", icon: ShieldAlert },
  { id: "compliance_officer", label: "Compliance Officer", department: "Risk & Compliance", tags: ["Compliance", "Report certifier"], description: "Manages FIU-IND STR filing, NPCI MIS submissions, and regulatory report certification.", icon: Shield },
  { id: "aml_analyst", label: "AML / FIU Analyst", department: "Risk & Compliance", tags: ["AML queue", "STR draft"], description: "Investigates suspicious transaction alerts. Prepares STR drafts.", icon: Eye },
  { id: "ops_analyst", label: "Ops / Recon Analyst", department: "Operations & Treasury", tags: ["Recon write", "Credit read"], description: "Daily reconciliation of NPCI settlement files against CBS ledger.", icon: UserCog },
  { id: "ops_lead", label: "Ops Lead / Recon Checker", department: "Operations & Treasury", tags: ["Recon approve", "Checker"], description: "Approves force-match and dispute escalations raised by Ops Analysts.", icon: ShieldCheck },
  { id: "treasury_officer", label: "Treasury Officer", department: "Operations & Treasury", tags: ["Read-only", "MIS export"], description: "Monitors daily settlement amounts, funding positions, and NACH mandate success rates.", icon: Eye },
  { id: "collections_officer", label: "Collections Officer", department: "Operations & Treasury", tags: ["Collections write", "Credit read"], description: "Manages delinquent corporate accounts. Views overdue accounts, DPD buckets.", icon: UserCog },
  { id: "internal_auditor", label: "Internal Auditor", department: "Audit & Senior Oversight", tags: ["Full read-only", "Audit export"], description: "Full read-only access across all modules. Can export audit logs.", icon: Eye },
  { id: "senior_mgmt", label: "Senior Management", department: "Audit & Senior Oversight", tags: ["Dashboard view", "Reports only"], description: "Executive view of portfolio KPIs. No write access.", icon: Eye },
  { id: "helpdesk", label: "Customer Service / Helpdesk", department: "Audit & Senior Oversight", tags: ["Limited view", "No PII"], description: "Handles inbound corporate queries. Strict data minimisation.", icon: Users },
];

// ── User statuses ──────────────────────────────────────────
type UserStatus = "active" | "invited" | "suspended" | "deactivated";

const STATUS_CONFIG: Record<UserStatus, { label: string; className: string; icon: React.ElementType }> = {
  active: { label: "Active", className: "status-badge-success", icon: CheckCircle2 },
  invited: { label: "Invited", className: "status-badge-info", icon: Mail },
  suspended: { label: "Suspended", className: "status-badge-warning", icon: AlertTriangle },
  deactivated: { label: "Deactivated", className: "status-badge-critical", icon: XCircle },
};

// ── Mock data ──────────────────────────────────────────────
interface BankUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: UserStatus;
  scope: string;
  lastLogin: string;
  createdAt: string;
  mfaEnabled: boolean;
}

const MOCK_USERS: BankUser[] = [
  { id: "1", name: "Rajesh Sharma", email: "rajesh.sharma@bank.com", role: "super_admin", department: "Platform Administration", status: "active", scope: "All", lastLogin: "2026-04-23 09:15", createdAt: "2024-01-15", mfaEnabled: true },
  { id: "2", name: "Priya Menon", email: "priya.menon@bank.com", role: "rm", department: "Relationship Management", status: "active", scope: "West Zone — 12 corporates", lastLogin: "2026-04-23 08:42", createdAt: "2024-03-20", mfaEnabled: true },
  { id: "3", name: "Vikram Patel", email: "vikram.patel@bank.com", role: "risk_officer", department: "Risk & Compliance", status: "active", scope: "All", lastLogin: "2026-04-22 17:30", createdAt: "2024-02-10", mfaEnabled: true },
  { id: "4", name: "Anita Desai", email: "anita.desai@bank.com", role: "ops_analyst", department: "Operations & Treasury", status: "active", scope: "All", lastLogin: "2026-04-23 07:55", createdAt: "2024-06-01", mfaEnabled: true },
  { id: "5", name: "Suresh Iyer", email: "suresh.iyer@bank.com", role: "credit_officer", department: "Relationship Management", status: "active", scope: "All", lastLogin: "2026-04-22 16:10", createdAt: "2024-04-12", mfaEnabled: true },
  { id: "6", name: "Kavita Nair", email: "kavita.nair@bank.com", role: "compliance_officer", department: "Risk & Compliance", status: "active", scope: "All", lastLogin: "2026-04-21 14:22", createdAt: "2024-05-18", mfaEnabled: true },
  { id: "7", name: "Amit Joshi", email: "amit.joshi@bank.com", role: "rm", department: "Relationship Management", status: "invited", scope: "South Zone", lastLogin: "—", createdAt: "2026-04-20", mfaEnabled: false },
  { id: "8", name: "Deepa Krishnan", email: "deepa.krishnan@bank.com", role: "internal_auditor", department: "Audit & Senior Oversight", status: "active", scope: "All (Read-only)", lastLogin: "2026-04-22 11:05", createdAt: "2024-07-22", mfaEnabled: true },
  { id: "9", name: "Rahul Gupta", email: "rahul.gupta@bank.com", role: "ops_analyst", department: "Operations & Treasury", status: "suspended", scope: "All", lastLogin: "2026-04-15 09:30", createdAt: "2024-08-14", mfaEnabled: true },
  { id: "10", name: "Meera Reddy", email: "meera.reddy@bank.com", role: "rm_lead", department: "Relationship Management", status: "active", scope: "North Zone — 4 RMs", lastLogin: "2026-04-23 10:00", createdAt: "2024-02-28", mfaEnabled: true },
  { id: "11", name: "Sanjay Tiwari", email: "sanjay.tiwari@bank.com", role: "platform_admin", department: "Platform Administration", status: "active", scope: "Config only", lastLogin: "2026-04-22 15:45", createdAt: "2024-01-20", mfaEnabled: true },
  { id: "12", name: "Pooja Bhatt", email: "pooja.bhatt@bank.com", role: "aml_analyst", department: "Risk & Compliance", status: "active", scope: "AML queue only", lastLogin: "2026-04-23 08:10", createdAt: "2025-01-10", mfaEnabled: true },
  { id: "13", name: "Karthik Rao", email: "karthik.rao@bank.com", role: "treasury_officer", department: "Operations & Treasury", status: "active", scope: "All (Read-only)", lastLogin: "2026-04-22 12:30", createdAt: "2025-03-05", mfaEnabled: true },
  { id: "14", name: "Neha Singh", email: "neha.singh@bank.com", role: "helpdesk", department: "Audit & Senior Oversight", status: "deactivated", scope: "Limited", lastLogin: "2026-03-10 09:00", createdAt: "2024-09-01", mfaEnabled: false },
  { id: "15", name: "Arjun Malhotra", email: "arjun.malhotra@bank.com", role: "senior_mgmt", department: "Audit & Senior Oversight", status: "active", scope: "Dashboard only", lastLogin: "2026-04-21 10:15", createdAt: "2024-01-05", mfaEnabled: true },
];

// ── Pending workflow items ─────────────────────────────────
interface PendingAction {
  id: string;
  type: "onboarding" | "role_change" | "reactivation" | "deactivation";
  subject: string;
  requestedBy: string;
  requestedAt: string;
  details: string;
  status: "pending_approval";
}

const PENDING_ACTIONS: PendingAction[] = [
  { id: "pa1", type: "onboarding", subject: "Amit Joshi", requestedBy: "Rajesh Sharma", requestedAt: "2026-04-20 14:30", details: "New RM — South Zone. Role: Relationship Manager.", status: "pending_approval" },
  { id: "pa2", type: "role_change", subject: "Priya Menon", requestedBy: "Rajesh Sharma", requestedAt: "2026-04-22 11:00", details: "RM → RM Team Lead. Justification: Promoted to West Zone Head.", status: "pending_approval" },
  { id: "pa3", type: "reactivation", subject: "Rahul Gupta", requestedBy: "Sanjay Tiwari", requestedAt: "2026-04-23 08:00", details: "Reactivation of suspended Ops Analyst. Suspension reason resolved.", status: "pending_approval" },
];

const WORKFLOW_TYPE_LABELS: Record<string, string> = {
  onboarding: "New User Onboarding",
  role_change: "Role Change",
  reactivation: "Reactivation",
  deactivation: "Deactivation",
};

// ── Component ──────────────────────────────────────────────
export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const getRoleDef = (roleId: string) => ROLES.find((r) => r.id === roleId);

  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (getRoleDef(u.role)?.label || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    const matchesDept = deptFilter === "all" || u.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const departments = [...new Set(ROLES.map((r) => r.department))];

  const statusCounts = MOCK_USERS.reduce<Record<string, number>>((acc, u) => {
    acc[u.status] = (acc[u.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout title="User Management & RBAC" subtitle="Role-based access control with Maker/Checker workflows">
      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["active", "invited", "suspended", "deactivated"] as UserStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <Card
              key={s}
              className={`kpi-tile cursor-pointer transition-all ${statusFilter === s ? "ring-2 ring-primary" : ""}`}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{cfg.label}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">{statusCounts[s] || 0}</span>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Actions
              {PENDING_ACTIONS.length > 0 && (
                <Badge variant="destructive" className="ml-1.5 text-[10px] px-1.5 py-0">{PENDING_ACTIONS.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <Button size="sm" onClick={() => setShowInviteDialog(true)}>
            <UserPlus className="w-4 h-4 mr-1.5" />
            Invite User
          </Button>
        </div>

        {/* ─── Users Tab ─── */}
        <TabsContent value="users">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, or role…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Table */}
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="data-table-header">User</TableHead>
                  <TableHead className="data-table-header">Role</TableHead>
                  <TableHead className="data-table-header">Department</TableHead>
                  <TableHead className="data-table-header">Scope</TableHead>
                  <TableHead className="data-table-header">Status</TableHead>
                  <TableHead className="data-table-header">MFA</TableHead>
                  <TableHead className="data-table-header">Last Login</TableHead>
                  <TableHead className="data-table-header w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleDef = getRoleDef(user.role);
                  const statusCfg = STATUS_CONFIG[user.status];
                  const StatusIcon = statusCfg.icon;
                  return (
                    <TableRow key={user.id} className="group">
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {roleDef && <roleDef.icon className="w-3.5 h-3.5 text-muted-foreground" />}
                          <span className="text-sm">{roleDef?.label || user.role}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.department}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">{user.scope}</TableCell>
                      <TableCell>
                        <span className={statusCfg.className}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.mfaEnabled ? (
                          <span className="status-badge-success"><ShieldCheck className="w-3 h-3" />On</span>
                        ) : (
                          <span className="status-badge-warning"><AlertTriangle className="w-3 h-3" />Off</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{user.lastLogin}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" />View Details</DropdownMenuItem>
                            <DropdownMenuItem><ArrowUpDown className="w-3.5 h-3.5 mr-2" />Change Role</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" && (
                              <DropdownMenuItem className="text-warning-muted-foreground">
                                <Ban className="w-3.5 h-3.5 mr-2" />Suspend User
                              </DropdownMenuItem>
                            )}
                            {user.status === "suspended" && (
                              <DropdownMenuItem>
                                <RotateCcw className="w-3.5 h-3.5 mr-2" />Reactivate
                              </DropdownMenuItem>
                            )}
                            {user.status !== "deactivated" && (
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="w-3.5 h-3.5 mr-2" />Deactivate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      No users match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ─── Roles Tab ─── */}
        <TabsContent value="roles">
          <div className="grid gap-4">
            {departments.map((dept) => (
              <div key={dept}>
                <h3 className="text-sm font-semibold text-foreground mb-3">{dept}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ROLES.filter((r) => r.department === dept).map((role) => {
                    const userCount = MOCK_USERS.filter((u) => u.role === role.id && u.status !== "deactivated").length;
                    return (
                      <Card key={role.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <role.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-foreground">{role.label}</span>
                              <Badge variant="secondary" className="text-[10px]">{userCount} user{userCount !== 1 ? "s" : ""}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{role.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {role.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className={`text-[10px] ${
                                    tag === "Checker" ? "border-success/40 text-success" :
                                    tag === "Maker" ? "border-primary/40 text-primary" :
                                    tag.includes("read") || tag.includes("Read") ? "border-muted-foreground/30" :
                                    ""
                                  }`}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ─── Pending Actions Tab ─── */}
        <TabsContent value="pending">
          {PENDING_ACTIONS.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="w-10 h-10 text-success mb-3" />
              <p className="text-sm font-medium text-foreground">No pending actions</p>
              <p className="text-xs text-muted-foreground">All Maker/Checker workflows are up to date.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {PENDING_ACTIONS.map((action) => (
                <Card key={action.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-warning-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" style={{ color: "hsl(var(--warning))" }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{WORKFLOW_TYPE_LABELS[action.type]}</span>
                          <Badge variant="outline" className="text-[10px] border-warning/40" style={{ color: "hsl(var(--warning))" }}>Pending Approval</Badge>
                        </div>
                        <p className="text-sm text-foreground mb-0.5">
                          <span className="font-medium">{action.subject}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mb-1">{action.details}</p>
                        <p className="text-xs text-muted-foreground">
                          Requested by <span className="font-medium text-foreground">{action.requestedBy}</span> on {action.requestedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline">Reject</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Workflow info */}
              <Card className="p-4 bg-muted/50 border-dashed">
                <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Maker / Checker Rules</h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>New user onboarding requires a second Super Admin as Checker.</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Role escalation to Risk Officer, Credit Officer, or Super Admin requires Risk Officer approval.</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Suspension is immediate (no Checker). Reactivation requires a second Super Admin.</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Deactivation requires HR exit reference. Open Maker actions must be reassigned first.</li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Deactivated accounts are never deleted — 7-year audit trail preserved per RBI guidelines.</li>
                </ul>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── Invite User Dialog ─── */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite New Bank User</DialogTitle>
            <DialogDescription>
              This will initiate a Maker/Checker workflow. A second Super Admin must approve before the invite is sent.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input placeholder="e.g. Priya Menon" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Bank Email</Label>
                <Input placeholder="name@bank.com" type="email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Scope</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Corporates</SelectItem>
                  <SelectItem value="north">North Zone</SelectItem>
                  <SelectItem value="south">South Zone</SelectItem>
                  <SelectItem value="east">East Zone</SelectItem>
                  <SelectItem value="west">West Zone</SelectItem>
                  <SelectItem value="assigned">Assigned List (specify after creation)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Justification</Label>
              <Textarea placeholder="Business reason for this user addition…" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowInviteDialog(false)}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
