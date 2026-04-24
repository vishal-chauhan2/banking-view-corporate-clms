import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search, Filter, Users, UserCheck, CreditCard, TrendingUp, TrendingDown,
  AlertTriangle, Ban, Sparkles, Activity, Clock, Zap, Eye, ChevronRight,
  CircleDollarSign, ShieldAlert, MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type EmpStatus = "active" | "dormant" | "blocked";
type Risk = "low" | "medium" | "high";

interface Employee {
  id: string;
  name: string;
  empCode: string;
  corporate: string;
  vpa: string;
  status: EmpStatus;
  assignedLimit: number;   // ₹ '000
  utilized: number;        // ₹ '000
  lastTxn: string;
  risk: Risk;
  flags: string[];
  history: { ts: string; merchant: string; amount: number; status: "Success" | "Failed" }[];
  limitHistory: { date: string; from: number; to: number; by: string }[];
  riskEvents: { ts: string; event: string; severity: Risk }[];
}

const EMPS: Employee[] = [
  { id: "e1", name: "Anita Rao", empCode: "INF-4821", corporate: "Infosys Ltd.", vpa: "anita.rao@upi", status: "active", assignedLimit: 200, utilized: 184, lastTxn: "12 min ago", risk: "high", flags: ["Velocity", "High utilization"],
    history: [{ ts: "12m", merchant: "Amazon Pay", amount: 12500, status: "Success" }, { ts: "1h", merchant: "Swiggy", amount: 850, status: "Success" }, { ts: "3h", merchant: "BigBasket", amount: 4200, status: "Success" }],
    limitHistory: [{ date: "2026-03-12", from: 150, to: 200, by: "Priya Menon (RM)" }], riskEvents: [{ ts: "10m ago", event: "47 txns / 5 min — velocity breach", severity: "high" }] },
  { id: "e2", name: "Rahul Joshi", empCode: "TCS-1190", corporate: "TCS", vpa: "rahul.joshi@upi", status: "active", assignedLimit: 150, utilized: 108, lastTxn: "2 hr ago", risk: "medium", flags: ["Geo anomaly"],
    history: [{ ts: "2h", merchant: "Apollo Pharmacy", amount: 850, status: "Success" }], limitHistory: [], riskEvents: [{ ts: "2h ago", event: "Impossible travel — Mumbai → Chennai", severity: "medium" }] },
  { id: "e3", name: "Sneha Pillai", empCode: "WPR-0567", corporate: "Wipro", vpa: "sneha.p@upi", status: "active", assignedLimit: 100, utilized: 23, lastTxn: "1 day ago", risk: "medium", flags: ["MCC violation"],
    history: [{ ts: "1d", merchant: "Dream11 (blocked)", amount: 5000, status: "Failed" }], limitHistory: [], riskEvents: [{ ts: "1d ago", event: "Attempted gambling MCC", severity: "medium" }] },
  { id: "e4", name: "Karthik Iyer", empCode: "MND-7712", corporate: "Mindtree", vpa: "karthik.i@upi", status: "active", assignedLimit: 250, utilized: 212, lastTxn: "30 min ago", risk: "high", flags: ["Limit spike"],
    history: [{ ts: "30m", merchant: "Reliance Digital", amount: 195000, status: "Success" }], limitHistory: [{ date: "2026-04-01", from: 200, to: 250, by: "Meera Reddy (RM Lead)" }], riskEvents: [{ ts: "30m ago", event: "85% util in 2h", severity: "high" }] },
  { id: "e5", name: "Deepa Krishnan", empCode: "TM-1002", corporate: "Tech Mahindra", vpa: "deepa.k@upi", status: "active", assignedLimit: 120, utilized: 24, lastTxn: "5 hr ago", risk: "low", flags: ["Dormant→spike"],
    history: [{ ts: "5h", merchant: "Croma", amount: 24000, status: "Success" }], limitHistory: [], riskEvents: [{ ts: "5h ago", event: "Dormant 90d → ₹2.4L spend", severity: "low" }] },
  { id: "e6", name: "Vivek Menon", empCode: "REL-5512", corporate: "Reliance Industries", vpa: "vivek.m@upi", status: "active", assignedLimit: 180, utilized: 65, lastTxn: "4 hr ago", risk: "low", flags: [],
    history: [{ ts: "4h", merchant: "BigBasket", amount: 3200, status: "Success" }], limitHistory: [], riskEvents: [] },
  { id: "e7", name: "Pooja Sharma", empCode: "HCL-3341", corporate: "HCL Technologies", vpa: "pooja.s@upi", status: "blocked", assignedLimit: 80, utilized: 12, lastTxn: "12 hr ago", risk: "medium", flags: ["Failed PIN"],
    history: [], limitHistory: [], riskEvents: [{ ts: "12h ago", event: "3× failed PIN — auto blocked", severity: "medium" }] },
  { id: "e8", name: "Arjun Nair", empCode: "TCS-8821", corporate: "Tata Steel", vpa: "arjun.n@upi", status: "active", assignedLimit: 200, utilized: 90, lastTxn: "6 hr ago", risk: "low", flags: [],
    history: [{ ts: "6h", merchant: "Indian Oil", amount: 4500, status: "Success" }], limitHistory: [], riskEvents: [] },
  { id: "e9", name: "Meera Iyer", empCode: "INF-9921", corporate: "Infosys Ltd.", vpa: "meera.iy@upi", status: "dormant", assignedLimit: 100, utilized: 0, lastTxn: "65 days ago", risk: "low", flags: ["Zero usage"],
    history: [], limitHistory: [], riskEvents: [] },
  { id: "e10", name: "Sandeep Roy", empCode: "WPR-2244", corporate: "Wipro", vpa: "sandeep.r@upi", status: "dormant", assignedLimit: 80, utilized: 0, lastTxn: "120 days ago", risk: "low", flags: ["Zero usage"],
    history: [], limitHistory: [], riskEvents: [] },
  { id: "e11", name: "Lakshmi Pai", empCode: "TCS-3322", corporate: "TCS", vpa: "lakshmi.p@upi", status: "active", assignedLimit: 150, utilized: 37, lastTxn: "2 days ago", risk: "low", flags: ["Low util"],
    history: [], limitHistory: [], riskEvents: [] },
  { id: "e12", name: "Amit Desai", empCode: "BAJ-1100", corporate: "Bajaj Finance Ltd.", vpa: "amit.d@upi", status: "active", assignedLimit: 300, utilized: 264, lastTxn: "1 hr ago", risk: "high", flags: ["Repayment overdue"],
    history: [], limitHistory: [], riskEvents: [{ ts: "5d ago", event: "Payment overdue — DPD risk", severity: "high" }] },
];

const STATUS_CFG: Record<EmpStatus, string> = {
  active: "status-badge-success",
  dormant: "bg-muted text-muted-foreground inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
  blocked: "status-badge-critical",
};

const RISK_CFG: Record<Risk, string> = {
  low: "status-badge-success",
  medium: "status-badge-warning",
  high: "status-badge-critical",
};

export default function EmployeeVPA() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [corpFilter, setCorpFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [utilFilter, setUtilFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: string; emp: Employee | null }>({ open: false, type: "", emp: null });

  const corporates = useMemo(() => [...new Set(EMPS.map(e => e.corporate))], []);

  const filtered = useMemo(() => EMPS.filter(e => {
    const q = search.toLowerCase();
    const ms = !q || e.name.toLowerCase().includes(q) || e.vpa.toLowerCase().includes(q) || e.empCode.toLowerCase().includes(q);
    const mc = corpFilter === "all" || e.corporate === corpFilter;
    const mst = statusFilter === "all" || e.status === statusFilter;
    const mr = riskFilter === "all" || e.risk === riskFilter;
    const utilPct = (e.utilized / e.assignedLimit) * 100;
    const mu = utilFilter === "all"
      || (utilFilter === "low" && utilPct < 30)
      || (utilFilter === "mid" && utilPct >= 30 && utilPct < 70)
      || (utilFilter === "high" && utilPct >= 70);
    return ms && mc && mst && mr && mu;
  }), [search, corpFilter, statusFilter, riskFilter, utilFilter]);

  const kpis = useMemo(() => {
    const total = EMPS.length;
    const active = EMPS.filter(e => e.status === "active").length;
    const dormant = EMPS.filter(e => e.status === "dormant").length;
    const totalSpend = EMPS.reduce((s, e) => s + e.utilized, 0);
    const avgSpend = Math.round(totalSpend / total);
    return { total, active, dormant, totalVpas: total, totalSpend, avgSpend };
  }, []);

  const riskSignals = useMemo(() => {
    const sig = (k: string) => EMPS.filter(e => e.flags.includes(k)).length;
    return [
      { label: "Velocity breaches", count: sig("Velocity"), filter: () => { setRiskFilter("high"); } },
      { label: "Failed PIN attempts", count: sig("Failed PIN"), filter: () => { setStatusFilter("blocked"); } },
      { label: "Geo / MCC anomalies", count: sig("Geo anomaly") + sig("MCC violation"), filter: () => { setRiskFilter("medium"); } },
      { label: "Dormant → sudden spike", count: sig("Dormant→spike"), filter: () => { setSearch("Dormant"); } },
    ];
  }, []);

  const opportunities = useMemo(() => {
    const zero = EMPS.filter(e => e.utilized === 0).length;
    const low = EMPS.filter(e => (e.utilized / e.assignedLimit) < 0.3).length;
    return { zero, low };
  }, []);

  const openAction = (type: string, emp: Employee) => setActionDialog({ open: true, type, emp });
  const confirmAction = () => {
    toast({ title: `${actionDialog.type} executed`, description: `${actionDialog.emp?.name} — action logged.` });
    setActionDialog({ open: false, type: "", emp: null });
  };

  const Kpi = ({ label, value, sub, icon: Icon, tone }: any) => (
    <Card className="kpi-tile">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={cn("w-3.5 h-3.5", tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : "text-muted-foreground")} />
      </div>
      <span className="text-xl font-bold text-foreground">{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
    </Card>
  );

  return (
    <DashboardLayout title="Employee & VPA Control Console" subtitle="Spend intelligence, risk monitoring & limit controls">
      {/* ── KPI snapshot ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Kpi label="Total Employees" value={kpis.total.toLocaleString("en-IN")} sub={`across ${corporates.length} corporates`} icon={Users} />
        <Kpi label="Active (30d)" value={kpis.active} sub={`${Math.round((kpis.active / kpis.total) * 100)}% of total`} icon={UserCheck} />
        <Kpi label="Total VPAs" value={kpis.totalVpas} sub={`${Math.round((kpis.active / kpis.total) * 100)}% active`} icon={CreditCard} />
        <Kpi label="Total Spend (MTD)" value={`₹${(kpis.totalSpend / 100).toFixed(1)} L`} sub="↑ 12% vs last month" icon={CircleDollarSign} />
        <Kpi label="Avg Spend / Emp" value={`₹${kpis.avgSpend}K`} sub="↑ 4% vs last month" icon={TrendingUp} />
        <Kpi label="Dormant Employees" value={kpis.dormant} sub="No activity 30d+" tone="warning" icon={Clock} />
      </div>

      {/* ── Sticky filter bar ── */}
      <Card className="p-3 mb-4 sticky top-0 z-10">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search employee, VPA, ID…" className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={corpFilter} onValueChange={setCorpFilter}>
            <SelectTrigger className="w-[180px] h-9"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue placeholder="Corporate" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All corporates</SelectItem>
              {corporates.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="dormant">Dormant</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Risk" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={utilFilter} onValueChange={setUtilFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Utilization" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All utilization</SelectItem>
              <SelectItem value="low">0–30%</SelectItem>
              <SelectItem value="mid">30–70%</SelectItem>
              <SelectItem value="high">70%+</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Bulk block", description: "Select rows to block VPAs in bulk." })}><Ban className="w-3.5 h-3.5 mr-1.5" />Bulk Block</Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Bulk update", description: "Limit update workflow opened." })}>Update Limits</Button>
            <Button size="sm" onClick={() => toast({ title: "Apply policy", description: "Policy assignment opened." })}>Apply Policy</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ── Main table ── */}
        <Card className="lg:col-span-3 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="data-table-header">Employee</TableHead>
                  <TableHead className="data-table-header">Corporate</TableHead>
                  <TableHead className="data-table-header">VPA</TableHead>
                  <TableHead className="data-table-header">Status</TableHead>
                  <TableHead className="data-table-header text-right">Limit</TableHead>
                  <TableHead className="data-table-header">Utilization</TableHead>
                  <TableHead className="data-table-header">Last Txn</TableHead>
                  <TableHead className="data-table-header">Risk</TableHead>
                  <TableHead className="data-table-header text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(e => {
                  const pct = Math.round((e.utilized / e.assignedLimit) * 100);
                  const high = pct > 85;
                  const dormant = e.status === "dormant";
                  return (
                    <TableRow key={e.id} className={cn("cursor-pointer hover:bg-muted/40", high && "bg-critical/5", dormant && "opacity-70")} onClick={() => setSelected(e)}>
                      <TableCell>
                        <div className="text-sm font-medium">{e.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{e.empCode}</div>
                      </TableCell>
                      <TableCell className="text-xs">{e.corporate}</TableCell>
                      <TableCell><span className="font-mono text-xs">{e.vpa}</span></TableCell>
                      <TableCell><span className={STATUS_CFG[e.status]}>{e.status}</span></TableCell>
                      <TableCell className="text-right font-mono text-xs">₹{e.assignedLimit}K</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={cn("h-full", pct > 85 ? "bg-critical" : pct > 70 ? "bg-warning" : "bg-success")} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className={cn("text-xs font-mono w-9 text-right", pct > 85 ? "text-critical font-bold" : "text-foreground")}>{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{e.lastTxn}</TableCell>
                      <TableCell>
                        <span className={RISK_CFG[e.risk]}>{e.risk}</span>
                        {e.flags.length > 0 && (
                          <div className="text-[10px] text-muted-foreground mt-0.5" title={e.flags.join(", ")}>
                            {e.flags.length} flag{e.flags.length > 1 ? "s" : ""}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={(ev) => ev.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => setSelected(e)}><Eye className="w-3 h-3" /></Button>
                          {e.status !== "blocked" ? (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => openAction("Block VPA", e)}><Ban className="w-3 h-3" /></Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => openAction("Unblock VPA", e)}><UserCheck className="w-3 h-3" /></Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* ── Side panels ── */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-critical" />
              <h3 className="text-sm font-semibold text-foreground">Risk Signals</h3>
            </div>
            <div className="space-y-2">
              {riskSignals.map((s, i) => (
                <button key={i} onClick={s.filter} className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-left">
                  <span className="text-xs text-foreground">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("font-mono text-xs font-bold", s.count > 0 ? "text-critical" : "text-muted-foreground")}>{s.count}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">Growth Opportunities</h3>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded-md bg-success-muted">
                <div className="text-xs text-success-muted-foreground">Zero usage employees</div>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg font-bold text-success-muted-foreground">{opportunities.zero}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => { setUtilFilter("low"); toast({ title: "Filter applied", description: "Showing low-utilization employees." }); }}>View & Act</Button>
                </div>
              </div>
              <div className="p-2 rounded-md bg-info-muted">
                <div className="text-xs text-info-muted-foreground">Employees &lt;30% utilization</div>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-lg font-bold text-info-muted-foreground">{opportunities.low}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setUtilFilter("low")}>View & Act</Button>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground pt-2 border-t">Drive utilization → grow interest revenue.</div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Detail drawer ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4 border-b">
                <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                <SheetDescription>
                  <span className="font-mono">{selected.empCode}</span> · {selected.corporate}
                  <div className="font-mono text-xs mt-1">{selected.vpa}</div>
                </SheetDescription>
              </SheetHeader>

              <div className="py-5 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Spend Summary</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Box label="Limit" value={`₹${selected.assignedLimit}K`} />
                    <Box label="Utilized" value={`₹${selected.utilized}K`} tone={selected.utilized / selected.assignedLimit > 0.85 ? "critical" : "default"} />
                    <Box label="Last Txn" value={selected.lastTxn} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Transaction History (last 10)</h4>
                  {selected.history.length === 0 ? <div className="text-xs text-muted-foreground italic">No recent transactions.</div> : (
                    <div className="space-y-1">
                      {selected.history.map((t, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/40 text-xs">
                          <div><div className="font-medium">{t.merchant}</div><div className="text-muted-foreground">{t.ts}</div></div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold">₹{t.amount.toLocaleString("en-IN")}</span>
                            <span className={t.status === "Success" ? "status-badge-success" : "status-badge-critical"}>{t.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Limit History</h4>
                  {selected.limitHistory.length === 0 ? <div className="text-xs text-muted-foreground italic">No limit changes recorded.</div> : (
                    <div className="space-y-1">
                      {selected.limitHistory.map((h, i) => (
                        <div key={i} className="text-xs p-2 rounded bg-muted/40">
                          <div className="font-medium">₹{h.from}K → ₹{h.to}K</div>
                          <div className="text-muted-foreground">{h.date} · by {h.by}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Risk Events Timeline</h4>
                  {selected.riskEvents.length === 0 ? <div className="text-xs text-muted-foreground italic">No risk events.</div> : (
                    <div className="space-y-1.5">
                      {selected.riskEvents.map((r, i) => (
                        <div key={i} className="flex gap-2 p-2 rounded bg-muted/40 text-xs">
                          <div className={cn("w-1 rounded-full", r.severity === "high" ? "bg-critical" : r.severity === "medium" ? "bg-warning" : "bg-info")} />
                          <div className="flex-1">
                            <div className="text-foreground">{r.event}</div>
                            <div className="text-muted-foreground">{r.ts}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t">
                  <h4 className="text-sm font-semibold mb-2">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.status !== "blocked" ? (
                      <Button variant="destructive" size="sm" onClick={() => openAction("Block VPA", selected)}><Ban className="w-3.5 h-3.5 mr-1.5" />Block VPA</Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={() => openAction("Unblock VPA", selected)}><UserCheck className="w-3.5 h-3.5 mr-1.5" />Unblock VPA</Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openAction("Update Limit", selected)}>Update Limit</Button>
                    <Button variant="outline" size="sm" onClick={() => openAction("Apply Restriction", selected)}>Apply Restriction</Button>
                    <Button variant="outline" size="sm" onClick={() => openAction("Reset PIN", selected)}>Reset PIN</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Action confirmation ── */}
      <Dialog open={actionDialog.open} onOpenChange={(o) => !o && setActionDialog({ open: false, type: "", emp: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm: {actionDialog.type}</DialogTitle>
            <DialogDescription>This action will be logged in the audit trail.</DialogDescription>
          </DialogHeader>
          {actionDialog.emp && (
            <div className="space-y-3">
              <div className="p-3 bg-muted/40 rounded text-sm">
                <div className="font-medium">{actionDialog.emp.name} <span className="font-mono text-xs text-muted-foreground">({actionDialog.emp.vpa})</span></div>
                <div className="text-xs text-muted-foreground">{actionDialog.emp.corporate}</div>
              </div>
              <div><Label className="text-xs">Reason (mandatory)</Label><Textarea placeholder="Justification…" rows={3} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: "", emp: null })}>Cancel</Button>
            <Button variant="destructive" onClick={confirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Box({ label, value, tone }: any) {
  return (
    <div className="p-2 rounded-md bg-muted/40">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-bold mt-0.5", tone === "critical" ? "text-critical" : "text-foreground")}>{value}</div>
    </div>
  );
}
