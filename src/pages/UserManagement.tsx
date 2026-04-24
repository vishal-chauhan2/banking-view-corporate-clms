import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Search, Filter, Shield, ShieldCheck, ShieldAlert, UserCog, Users, Eye,
  UserPlus, CheckCircle2, XCircle, AlertTriangle, Mail, Clock, Edit3,
  Activity, FileText, Layers, Sparkles, Globe, Smartphone, Lock,
  ArrowRight, ChevronRight, History, Workflow, AlertOctagon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// ── Types ──────────────────────────────────────────────────
type UserStatus = "active" | "invited" | "suspended";
type RiskFlag = "high_value" | "restricted" | "high_limit" | "off_hours";

interface CBACRules {
  maxTxn: number;       // ₹ Cr
  dailyLimit: number;   // ₹ Cr
  approvalLimit: number;// ₹ Cr
  makerChecker: boolean;
  selfApproval: boolean;
  timeWindow: string;
  deviceLock: boolean;
  onlyAssignedClients: boolean;
}

interface Permissions { view: boolean; transact: boolean; approve: boolean; admin: boolean; }

interface PortfolioAccess {
  type: "Region" | "Client" | "Segment" | "Global";
  region: string;
  clientCount: number;
  filters: string[];
  highValueClients: number;
  restrictedClients: number;
}

interface ActivityEvent { ts: string; action: string; outcome: "success" | "denied" | "warning"; }

interface BankUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  permissions: Permissions;
  portfolio: PortfolioAccess;
  cbac: CBACRules;
  riskFlags: RiskFlag[];
  status: UserStatus;
  lastActivity: string;
  failedAttempts: number;
  recent: ActivityEvent[];
}

// ── Mock data ──────────────────────────────────────────────
const USERS: BankUser[] = [
  {
    id: "u1", name: "Rajesh Sharma", email: "rajesh.sharma@bank.com",
    role: "super_admin", roleLabel: "Super Admin",
    permissions: { view: true, transact: true, approve: true, admin: true },
    portfolio: { type: "Global", region: "All India", clientCount: 247, filters: ["All segments"], highValueClients: 18, restrictedClients: 4 },
    cbac: { maxTxn: 100, dailyLimit: 500, approvalLimit: 50, makerChecker: true, selfApproval: false, timeWindow: "24×7", deviceLock: true, onlyAssignedClients: false },
    riskFlags: ["high_value", "high_limit"], status: "active", lastActivity: "2 min ago", failedAttempts: 0,
    recent: [
      { ts: "2 min ago", action: "Approved limit increase — Infosys (₹4.2 Cr)", outcome: "success" },
      { ts: "1 hr ago", action: "Exported audit log (Q1 FY26)", outcome: "success" },
    ],
  },
  {
    id: "u2", name: "Priya Menon", email: "priya.menon@bank.com",
    role: "rm_senior", roleLabel: "Senior Relationship Manager",
    permissions: { view: true, transact: true, approve: true, admin: false },
    portfolio: { type: "Region", region: "West Zone", clientCount: 12, filters: ["Mid Corporate", "Excl. Restricted"], highValueClients: 3, restrictedClients: 0 },
    cbac: { maxTxn: 5, dailyLimit: 25, approvalLimit: 2, makerChecker: true, selfApproval: false, timeWindow: "9 AM – 7 PM", deviceLock: true, onlyAssignedClients: true },
    riskFlags: ["high_value"], status: "active", lastActivity: "18 min ago", failedAttempts: 0,
    recent: [
      { ts: "18 min ago", action: "Initiated UPI credit txn — TCS (₹85 L)", outcome: "success" },
      { ts: "Yesterday", action: "Attempted txn ₹7.2 Cr — exceeded limit", outcome: "denied" },
    ],
  },
  {
    id: "u3", name: "Vikram Patel", email: "vikram.patel@bank.com",
    role: "risk_officer", roleLabel: "Risk Officer",
    permissions: { view: true, transact: false, approve: true, admin: false },
    portfolio: { type: "Global", region: "All India", clientCount: 247, filters: ["Risk module only"], highValueClients: 18, restrictedClients: 4 },
    cbac: { maxTxn: 0, dailyLimit: 0, approvalLimit: 10, makerChecker: true, selfApproval: false, timeWindow: "24×7", deviceLock: true, onlyAssignedClients: false },
    riskFlags: ["high_limit"], status: "active", lastActivity: "5 min ago", failedAttempts: 0,
    recent: [{ ts: "5 min ago", action: "Froze VPA emp_4821@upi (Velocity breach)", outcome: "success" }],
  },
  {
    id: "u4", name: "Suresh Iyer", email: "suresh.iyer@bank.com",
    role: "credit_officer", roleLabel: "Credit Officer (Checker)",
    permissions: { view: true, transact: false, approve: true, admin: false },
    portfolio: { type: "Segment", region: "All India", clientCount: 247, filters: ["Credit approvals only"], highValueClients: 18, restrictedClients: 4 },
    cbac: { maxTxn: 0, dailyLimit: 0, approvalLimit: 25, makerChecker: true, selfApproval: false, timeWindow: "9 AM – 9 PM", deviceLock: true, onlyAssignedClients: false },
    riskFlags: ["high_limit"], status: "active", lastActivity: "1 hr ago", failedAttempts: 1,
    recent: [{ ts: "1 hr ago", action: "Approved limit change — Wipro (₹12 Cr)", outcome: "success" }],
  },
  {
    id: "u5", name: "Amit Joshi", email: "amit.joshi@bank.com",
    role: "rm", roleLabel: "Relationship Manager",
    permissions: { view: true, transact: true, approve: false, admin: false },
    portfolio: { type: "Region", region: "South Zone", clientCount: 8, filters: ["Mid Corporate"], highValueClients: 1, restrictedClients: 0 },
    cbac: { maxTxn: 2, dailyLimit: 10, approvalLimit: 0, makerChecker: true, selfApproval: false, timeWindow: "9 AM – 7 PM", deviceLock: true, onlyAssignedClients: true },
    riskFlags: [], status: "invited", lastActivity: "—", failedAttempts: 0, recent: [],
  },
  {
    id: "u6", name: "Meera Reddy", email: "meera.reddy@bank.com",
    role: "rm_lead", roleLabel: "RM Team Lead — North",
    permissions: { view: true, transact: true, approve: true, admin: false },
    portfolio: { type: "Region", region: "North Zone", clientCount: 42, filters: ["All RMs in zone"], highValueClients: 6, restrictedClients: 1 },
    cbac: { maxTxn: 10, dailyLimit: 50, approvalLimit: 5, makerChecker: true, selfApproval: false, timeWindow: "8 AM – 9 PM", deviceLock: true, onlyAssignedClients: true },
    riskFlags: ["high_value"], status: "active", lastActivity: "32 min ago", failedAttempts: 0,
    recent: [{ ts: "32 min ago", action: "Reviewed RM utilization report", outcome: "success" }],
  },
  {
    id: "u7", name: "Pooja Bhatt", email: "pooja.bhatt@bank.com",
    role: "aml_analyst", roleLabel: "AML / FIU Analyst",
    permissions: { view: true, transact: false, approve: false, admin: false },
    portfolio: { type: "Segment", region: "All India", clientCount: 247, filters: ["AML queue only"], highValueClients: 18, restrictedClients: 4 },
    cbac: { maxTxn: 0, dailyLimit: 0, approvalLimit: 0, makerChecker: false, selfApproval: false, timeWindow: "9 AM – 6 PM", deviceLock: true, onlyAssignedClients: false },
    riskFlags: [], status: "active", lastActivity: "2 hr ago", failedAttempts: 0,
    recent: [{ ts: "2 hr ago", action: "Drafted STR — case CASE-9821", outcome: "success" }],
  },
  {
    id: "u8", name: "Rahul Gupta", email: "rahul.gupta@bank.com",
    role: "ops_analyst", roleLabel: "Ops / Recon Analyst",
    permissions: { view: true, transact: true, approve: false, admin: false },
    portfolio: { type: "Global", region: "All India", clientCount: 247, filters: ["Recon module"], highValueClients: 18, restrictedClients: 4 },
    cbac: { maxTxn: 1, dailyLimit: 5, approvalLimit: 0, makerChecker: true, selfApproval: false, timeWindow: "9 AM – 6 PM", deviceLock: false, onlyAssignedClients: false },
    riskFlags: ["off_hours"], status: "suspended", lastActivity: "8 days ago", failedAttempts: 4,
    recent: [{ ts: "8 days ago", action: "4× failed login outside time window", outcome: "denied" }],
  },
];

const POLICIES = [
  { id: "p1", scope: "Role: RM", rule: "max_transaction_limit ≤ ₹5 Cr", version: "v3.2", updated: "2026-03-15", active: true },
  { id: "p2", scope: "Txn > ₹5 Cr", rule: "require VP / Credit Officer approval (Checker)", version: "v2.8", updated: "2026-02-28", active: true },
  { id: "p3", scope: "client_tag = High_Value AND role ≠ Senior RM", rule: "restrict transact + approve actions", version: "v1.5", updated: "2026-04-01", active: true },
  { id: "p4", scope: "Role: RM", rule: "access window = 09:00 – 19:00 IST", version: "v2.0", updated: "2026-01-12", active: true },
  { id: "p5", scope: "Any role", rule: "self-approval prohibited (Maker ≠ Checker)", version: "v4.0", updated: "2026-04-10", active: true },
  { id: "p6", scope: "Restricted clients", rule: "view-only for non-Senior roles", version: "v1.2", updated: "2026-03-22", active: true },
  { id: "p7", scope: "All users", rule: "MFA + device fingerprint required", version: "v5.1", updated: "2026-04-18", active: true },
];

interface PendingItem {
  id: string; category: "Role Change" | "Limit Change" | "Emergency Access";
  maker: string; subject: string; details: string; checker: string; raisedAt: string;
}
const PENDING: PendingItem[] = [
  { id: "MC-2041", category: "Role Change", maker: "Rajesh Sharma", subject: "Priya Menon", details: "RM → Senior RM (West Zone Head)", checker: "Second Super Admin", raisedAt: "2 hr ago" },
  { id: "MC-2042", category: "Limit Change", maker: "Priya Menon", subject: "Self (txn limit)", details: "Increase max_txn ₹5 Cr → ₹8 Cr (90 days)", checker: "Credit Officer", raisedAt: "45 min ago" },
  { id: "MC-2043", category: "Emergency Access", maker: "Vikram Patel", subject: "Pooja Bhatt", details: "Temporary write access to Audit module — fraud investigation", checker: "Super Admin", raisedAt: "12 min ago" },
  { id: "MC-2044", category: "Role Change", maker: "Sanjay Tiwari", subject: "Amit Joshi (invited)", details: "Activate role: RM — South Zone", checker: "RM Team Lead", raisedAt: "1 day ago" },
];

const STATUS_CFG: Record<UserStatus, { label: string; cls: string; icon: React.ElementType }> = {
  active:    { label: "Active",    cls: "status-badge-success",  icon: CheckCircle2 },
  invited:   { label: "Invited",   cls: "status-badge-info",     icon: Mail },
  suspended: { label: "Suspended", cls: "status-badge-critical", icon: XCircle },
};

const FLAG_CFG: Record<RiskFlag, { label: string; cls: string }> = {
  high_value:  { label: "High-Value Access", cls: "status-badge-warning" },
  restricted:  { label: "Restricted Clients", cls: "status-badge-info" },
  high_limit:  { label: "High Approval Limit", cls: "status-badge-critical" },
  off_hours:   { label: "Off-Hours Activity", cls: "status-badge-warning" },
};

// ── Component ──────────────────────────────────────────────
export default function UserManagement() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("users");
  const [selected, setSelected] = useState<BankUser | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const filtered = useMemo(() => USERS.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.roleLabel.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  }), [search, statusFilter, roleFilter]);

  // KPIs
  const kpis = useMemo(() => {
    const active = USERS.filter(u => u.status === "active").length;
    const approvers = USERS.filter(u => u.permissions.approve).length;
    const highRisk = USERS.filter(u => u.riskFlags.includes("high_limit") || u.riskFlags.includes("high_value")).length;
    const violations = USERS.reduce((s, u) => s + u.failedAttempts, 0);
    return { active, approvers, highRisk, pending: PENDING.length, violations };
  }, []);

  const KpiCard = ({ label, value, sub, tone, onClick, icon: Icon }: any) => (
    <Card onClick={onClick} className="kpi-tile cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={cn("w-4 h-4", tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : "text-muted-foreground")} />
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </Card>
  );

  return (
    <DashboardLayout title="Access Intelligence System" subtitle="RBAC + CBAC · Who has access · What they can do · Under what conditions">
      {/* ── KPI summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard label="Active Users" value={kpis.active} sub={`of ${USERS.length} total`} tone="default" icon={CheckCircle2} onClick={() => { setStatusFilter("active"); setActiveTab("users"); }} />
        <KpiCard label="Approval Rights" value={kpis.approvers} sub="Checkers + makers" tone="default" icon={ShieldCheck} onClick={() => setActiveTab("users")} />
        <KpiCard label="High-Risk Access" value={kpis.highRisk} sub="High-value / high limits" tone="warning" icon={ShieldAlert} onClick={() => setActiveTab("users")} />
        <KpiCard label="Pending Maker-Checker" value={kpis.pending} sub="Awaiting approval" tone="critical" icon={Workflow} onClick={() => setActiveTab("pending")} />
        <KpiCard label="Policy Violations (7d)" value={kpis.violations} sub="Failed limit attempts" tone="critical" icon={AlertOctagon} onClick={() => setActiveTab("users")} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="users"><Users className="w-3.5 h-3.5 mr-1.5" />Users & Access</TabsTrigger>
            <TabsTrigger value="policies"><FileText className="w-3.5 h-3.5 mr-1.5" />Policies (RBAC + CBAC)</TabsTrigger>
            <TabsTrigger value="pending"><Workflow className="w-3.5 h-3.5 mr-1.5" />
              Maker-Checker
              {PENDING.length > 0 && <Badge variant="destructive" className="ml-1.5 text-[10px] px-1.5 py-0">{PENDING.length}</Badge>}
            </TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={() => setShowInvite(true)}><UserPlus className="w-4 h-4 mr-1.5" />Invite User</Button>
        </div>

        {/* ── USERS TAB ── */}
        <TabsContent value="users">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search name, email, role…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]"><Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {[...new Set(USERS.map(u => u.role))].map(r => (
                  <SelectItem key={r} value={r}>{USERS.find(u => u.role === r)?.roleLabel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="data-table-header">User</TableHead>
                  <TableHead className="data-table-header">Role (RBAC)</TableHead>
                  <TableHead className="data-table-header">Portfolio Access</TableHead>
                  <TableHead className="data-table-header">Permissions</TableHead>
                  <TableHead className="data-table-header">Approval Power</TableHead>
                  <TableHead className="data-table-header">Risk Flags</TableHead>
                  <TableHead className="data-table-header">Status</TableHead>
                  <TableHead className="data-table-header">Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => {
                  const sCfg = STATUS_CFG[u.status];
                  const SIcon = sCfg.icon;
                  return (
                    <TableRow key={u.id} onClick={() => setSelected(u)} className="cursor-pointer hover:bg-muted/40">
                      <TableCell>
                        <div className="font-medium text-sm text-foreground">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell><span className="text-sm">{u.roleLabel}</span></TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{u.portfolio.region}</div>
                        <div className="text-xs text-muted-foreground">{u.portfolio.clientCount} clients · {u.portfolio.filters[0]}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <PermIcon active={u.permissions.view} icon={Eye} title="View" />
                          <PermIcon active={u.permissions.transact} icon={Activity} title="Transact" />
                          <PermIcon active={u.permissions.approve} icon={ShieldCheck} title="Approve" />
                          <PermIcon active={u.permissions.admin} icon={UserCog} title="Admin" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm text-foreground">
                          {u.cbac.approvalLimit > 0 ? `₹${u.cbac.approvalLimit} Cr` : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {u.riskFlags.length === 0
                            ? <span className="text-xs text-muted-foreground">None</span>
                            : u.riskFlags.map(f => <span key={f} className={cn(FLAG_CFG[f].cls, "text-[10px]")}>{FLAG_CFG[f].label}</span>)}
                        </div>
                      </TableCell>
                      <TableCell><span className={sCfg.cls}><SIcon className="w-3 h-3" />{sCfg.label}</span></TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{u.lastActivity}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ── POLICIES TAB ── */}
        <TabsContent value="policies">
          <Card className="p-5 mb-4 bg-info-muted border-info/20">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground text-sm">RBAC + CBAC Policy Engine</h3>
                <p className="text-xs text-muted-foreground mt-1">Policies evaluated top-down. CBAC rules layer on top of RBAC role permissions. All edits versioned and audit-logged.</p>
              </div>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="data-table-header w-32">Policy ID</TableHead>
                  <TableHead className="data-table-header">IF (Scope)</TableHead>
                  <TableHead className="data-table-header">THEN (Rule)</TableHead>
                  <TableHead className="data-table-header w-24">Version</TableHead>
                  <TableHead className="data-table-header w-32">Last Updated</TableHead>
                  <TableHead className="data-table-header w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {POLICIES.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-primary">{p.id.toUpperCase()}</TableCell>
                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{p.scope}</code></TableCell>
                    <TableCell className="text-sm">→ {p.rule}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{p.version}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.updated}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => toast({ title: "Edit policy", description: `Opening editor for ${p.id.toUpperCase()}` })}><Edit3 className="w-3 h-3 mr-1" />Edit</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => toast({ title: "Audit log", description: `Showing version history for ${p.id.toUpperCase()}` })}><History className="w-3 h-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ── PENDING / MAKER-CHECKER TAB ── */}
        <TabsContent value="pending">
          {(["Role Change", "Limit Change", "Emergency Access"] as const).map((cat) => {
            const items = PENDING.filter(p => p.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat} className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{cat}</h3>
                  <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
                </div>
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="data-table-header w-28">Request ID</TableHead>
                        <TableHead className="data-table-header">Subject</TableHead>
                        <TableHead className="data-table-header">Change</TableHead>
                        <TableHead className="data-table-header">Maker</TableHead>
                        <TableHead className="data-table-header">Required Checker</TableHead>
                        <TableHead className="data-table-header w-28">Raised</TableHead>
                        <TableHead className="data-table-header w-44 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell className="font-mono text-xs text-primary">{it.id}</TableCell>
                          <TableCell className="text-sm font-medium">{it.subject}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{it.details}</TableCell>
                          <TableCell className="text-xs">{it.maker}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{it.checker}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{it.raisedAt}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast({ title: "Rejected", description: `${it.id} rejected and logged.` })}>Reject</Button>
                            <Button size="sm" className="h-7 text-xs" onClick={() => toast({ title: "Approved", description: `${it.id} approved and audit-logged.` })}>Approve</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* ── DETAIL DRAWER ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4 border-b">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <SheetTitle className="text-xl">{selected.name}</SheetTitle>
                    <SheetDescription>{selected.email} · {selected.roleLabel}</SheetDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowSimulator(true)}>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />What can this user do?
                  </Button>
                </div>
              </SheetHeader>

              <div className="py-5 space-y-6">
                {/* RBAC */}
                <Section icon={Shield} title="RBAC — Base Permissions">
                  <div className="grid grid-cols-2 gap-2">
                    <PermPill active={selected.permissions.view} icon={Eye} label="View" />
                    <PermPill active={selected.permissions.transact} icon={Activity} label="Transact" />
                    <PermPill active={selected.permissions.approve} icon={ShieldCheck} label="Approve" />
                    <PermPill active={selected.permissions.admin} icon={UserCog} label="Admin" />
                  </div>
                </Section>

                {/* Portfolio */}
                <Section icon={Layers} title="Portfolio Mapping">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Field label="Type" value={selected.portfolio.type} />
                    <Field label="Region" value={selected.portfolio.region} />
                    <Field label="Assigned Clients" value={`${selected.portfolio.clientCount}`} />
                    <Field label="Filters" value={selected.portfolio.filters.join(", ")} />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selected.portfolio.highValueClients > 0 && <span className="status-badge-warning">{selected.portfolio.highValueClients} High-Value Clients</span>}
                    {selected.portfolio.restrictedClients > 0 && <span className="status-badge-info">{selected.portfolio.restrictedClients} Restricted</span>}
                  </div>
                </Section>

                {/* CBAC */}
                <Section icon={Lock} title="CBAC — Context Rules">
                  <div className="space-y-2 text-sm">
                    <Rule label="Max single transaction" value={selected.cbac.maxTxn > 0 ? `₹${selected.cbac.maxTxn} Cr` : "Not allowed"} />
                    <Rule label="Daily transaction limit" value={selected.cbac.dailyLimit > 0 ? `₹${selected.cbac.dailyLimit} Cr` : "Not allowed"} />
                    <Rule label="Approval limit" value={selected.cbac.approvalLimit > 0 ? `₹${selected.cbac.approvalLimit} Cr` : "Not allowed"} />
                    <Rule label="Maker-Checker required" value={selected.cbac.makerChecker ? "Yes" : "No"} />
                    <Rule label="Self-approval" value={selected.cbac.selfApproval ? "Allowed" : "Restricted"} highlight={!selected.cbac.selfApproval} />
                    <Rule label="Only assigned clients" value={selected.cbac.onlyAssignedClients ? "Yes" : "All accessible"} />
                    <Rule label="Time window" value={selected.cbac.timeWindow} icon={Clock} />
                    <Rule label="Device / network lock" value={selected.cbac.deviceLock ? "Bank-issued device only" : "Open"} icon={Smartphone} />
                  </div>
                </Section>

                {/* Activity */}
                <Section icon={Activity} title="Activity & Risk Insights">
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <MiniStat label="Last Activity" value={selected.lastActivity} />
                    <MiniStat label="Failed Attempts (7d)" value={selected.failedAttempts.toString()} tone={selected.failedAttempts > 0 ? "critical" : "default"} />
                    <MiniStat label="Risk Flags" value={selected.riskFlags.length.toString()} tone={selected.riskFlags.length > 0 ? "warning" : "default"} />
                  </div>
                  <div className="space-y-1.5">
                    {selected.recent.length === 0 && <div className="text-xs text-muted-foreground italic">No recent activity.</div>}
                    {selected.recent.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs p-2 rounded bg-muted/40">
                        <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", e.outcome === "success" ? "bg-success" : e.outcome === "denied" ? "bg-critical" : "bg-warning")} />
                        <div className="flex-1">
                          <div className="text-foreground">{e.action}</div>
                          <div className="text-muted-foreground">{e.ts}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── ACCESS SIMULATOR ── */}
      <Dialog open={showSimulator} onOpenChange={setShowSimulator}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />Access Simulation</DialogTitle>
            <DialogDescription>Effective permissions for {selected?.name} after evaluating RBAC + CBAC policies.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <SimGroup title="ALLOWED" tone="success" items={[
                ...(selected.permissions.view ? ["View assigned clients & portfolios"] : []),
                ...(selected.permissions.transact && selected.cbac.maxTxn > 0 ? [`Initiate UPI credit transactions up to ₹${selected.cbac.maxTxn} Cr`] : []),
                ...(selected.permissions.approve && selected.cbac.approvalLimit > 0 ? [`Approve transactions up to ₹${selected.cbac.approvalLimit} Cr`] : []),
                ...(selected.permissions.admin ? ["Manage users, policies, global config"] : []),
              ]} />
              <SimGroup title="DENIED" tone="critical" items={[
                ...(!selected.permissions.approve ? ["Approve transactions"] : []),
                ...(selected.cbac.onlyAssignedClients ? ["Access unassigned clients"] : []),
                ...(!selected.cbac.selfApproval ? ["Self-approve own requests (Maker ≠ Checker enforced)"] : []),
              ]} />
              <SimGroup title="CONDITIONAL" tone="warning" items={[
                ...(selected.cbac.makerChecker && selected.permissions.transact ? [`Transactions above ₹${selected.cbac.maxTxn} Cr require Checker approval`] : []),
                `Access only during: ${selected.cbac.timeWindow}`,
                ...(selected.cbac.deviceLock ? ["Bank-issued device + MFA required"] : []),
              ]} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── INVITE DIALOG ── */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>New user creation requires Maker-Checker approval.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Full name</Label><Input placeholder="e.g. Anil Kumar" /></div>
            <div><Label className="text-xs">Email</Label><Input type="email" placeholder="anil.kumar@bank.com" /></div>
            <div>
              <Label className="text-xs">Role</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>{[...new Set(USERS.map(u => u.role))].map(r => <SelectItem key={r} value={r}>{USERS.find(u => u.role === r)?.roleLabel}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Justification</Label><Textarea placeholder="Onboarding reason…" rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={() => { setShowInvite(false); toast({ title: "Invitation queued", description: "Sent for Maker-Checker approval." }); }}>Send for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// ── Helpers ────────────────────────────────────────────────
function PermIcon({ active, icon: Icon, title }: any) {
  return (
    <span title={title} className={cn("w-6 h-6 rounded-md flex items-center justify-center", active ? "bg-success-muted text-success-muted-foreground" : "bg-muted text-muted-foreground/40")}>
      <Icon className="w-3 h-3" />
    </span>
  );
}

function Section({ icon: Icon, title, children }: any) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground mt-0.5">{value}</div>
    </div>
  );
}

function Rule({ label, value, highlight, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
      <span className="flex items-center gap-1.5 text-muted-foreground">{Icon && <Icon className="w-3.5 h-3.5" />}{label}</span>
      <span className={cn("font-mono text-xs", highlight ? "text-success" : "text-foreground")}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, tone }: any) {
  return (
    <div className="p-2 rounded-md bg-muted/40">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-semibold mt-0.5", tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : "text-foreground")}>{value}</div>
    </div>
  );
}

function PermPill({ active, icon: Icon, label }: any) {
  return (
    <div className={cn("flex items-center gap-2 p-2 rounded-md border", active ? "bg-success-muted border-success/20" : "bg-muted/40 border-border")}>
      <Icon className={cn("w-4 h-4", active ? "text-success" : "text-muted-foreground/50")} />
      <span className={cn("text-sm", active ? "text-foreground" : "text-muted-foreground/60 line-through")}>{label}</span>
    </div>
  );
}

function SimGroup({ title, tone, items }: { title: string; tone: "success" | "critical" | "warning"; items: string[] }) {
  if (!items.length) return null;
  const cls = tone === "success" ? "border-success/30 bg-success-muted" : tone === "critical" ? "border-critical/30 bg-critical-muted" : "border-warning/30 bg-warning-muted";
  const icon = tone === "success" ? "✓" : tone === "critical" ? "✗" : "⚠";
  const tcls = tone === "success" ? "text-success-muted-foreground" : tone === "critical" ? "text-critical-muted-foreground" : "text-warning-muted-foreground";
  return (
    <div className={cn("p-3 rounded-lg border", cls)}>
      <div className={cn("text-xs font-bold mb-2", tcls)}>{title}</div>
      <ul className="space-y-1">
        {items.map((it, i) => <li key={i} className={cn("text-sm flex gap-2", tcls)}><span className="font-bold">{icon}</span>{it}</li>)}
      </ul>
    </div>
  );
}
