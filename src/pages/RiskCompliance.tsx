import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ShieldAlert, AlertTriangle, Zap, MapPin, CreditCard, Clock, Eye, CheckCircle2,
  XCircle, TrendingDown, TrendingUp, Search, Filter, Snowflake, ShieldOff,
  ArrowUpRight, FileText, Activity, AlertOctagon, Network, History, Shield,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// ── Types & data ───────────────────────────────────────────
type Severity = "critical" | "high" | "medium" | "low";
type Status = "Open" | "Under Review" | "Resolved" | "Dismissed";
type Category = "Fraud" | "Credit" | "Compliance" | "Behavioral";

interface Alert {
  id: string;
  severity: Severity;
  category: Category;
  signalType: string;
  description: string;
  corporate: string;
  vpa: string;
  exposure: number;       // ₹ Lakh
  creditLimit: number;    // ₹ Lakh
  utilization: number;    // %
  riskScore: number;      // 0-100
  time: string;
  status: Status;
  rule: string;
  recent: { ts: string; amount: number; merchant: string }[];
  beneficiaries: string[];
}

const ALERTS: Alert[] = [
  { id: "RA-001", severity: "critical", category: "Fraud", signalType: "Velocity Breach", description: "47 transactions in 5 min from single VPA", corporate: "Infosys Ltd.", vpa: "emp_4821@upi", exposure: 245, creditLimit: 800, utilization: 87, riskScore: 94, time: "2 min ago", status: "Open", rule: "VEL-001: >20 txns / 5 min", recent: [{ ts: "−1m", amount: 12500, merchant: "Amazon Pay" }, { ts: "−2m", amount: 9800, merchant: "Flipkart" }, { ts: "−3m", amount: 14200, merchant: "Swiggy" }], beneficiaries: ["merchant_xyz@upi", "agg_pay@hdfc"] },
  { id: "RA-002", severity: "critical", category: "Behavioral", signalType: "Geo Anomaly", description: "Txn Chennai, last txn 3m ago Mumbai (impossible travel)", corporate: "TCS", vpa: "emp_1190@upi", exposure: 180, creditLimit: 500, utilization: 72, riskScore: 91, time: "8 min ago", status: "Under Review", rule: "GEO-002: >500km / 10 min", recent: [{ ts: "−3m", amount: 8500, merchant: "Apollo Pharmacy" }, { ts: "−6m", amount: 22000, merchant: "BigBasket" }], beneficiaries: ["pharma_aplo@axis"] },
  { id: "RA-003", severity: "high", category: "Compliance", signalType: "MCC Violation", description: "Attempted purchase at MCC 7995 (Gambling)", corporate: "Wipro", vpa: "emp_0567@upi", exposure: 92, creditLimit: 400, utilization: 23, riskScore: 78, time: "34 min ago", status: "Open", rule: "MCC-007: blocked categories", recent: [{ ts: "−34m", amount: 5000, merchant: "Dream11 (blocked)" }], beneficiaries: ["dream11_pay@icici"] },
  { id: "RA-004", severity: "high", category: "Credit", signalType: "Limit Spike", description: "85% utilization in single 2-hour session", corporate: "Mindtree", vpa: "emp_7712@upi", exposure: 340, creditLimit: 400, utilization: 85, riskScore: 82, time: "1 hr ago", status: "Open", rule: "LIM-003: >50% in 2h", recent: [{ ts: "−1h", amount: 145000, merchant: "Amazon Business" }, { ts: "−1.5h", amount: 195000, merchant: "Reliance Digital" }], beneficiaries: ["amzbiz@yes", "reliance@idfc"] },
  { id: "RA-005", severity: "high", category: "Credit", signalType: "Repayment Default", description: "Payment overdue 5 days, DPD risk escalating", corporate: "Bajaj Finance Ltd.", vpa: "—", exposure: 1240, creditLimit: 1500, utilization: 83, riskScore: 76, time: "3 hr ago", status: "Open", rule: "DPD-001: >3 days overdue", recent: [], beneficiaries: [] },
  { id: "RA-006", severity: "medium", category: "Behavioral", signalType: "Dormant Reactivation", description: "VPA inactive 90 days, sudden ₹2.4L spend", corporate: "Tech Mahindra", vpa: "emp_1002@upi", exposure: 240, creditLimit: 600, utilization: 40, riskScore: 64, time: "5 hr ago", status: "Under Review", rule: "DOR-001: spend after 60d dormant", recent: [{ ts: "−5h", amount: 240000, merchant: "Croma" }], beneficiaries: ["croma_pay@hdfc"] },
  { id: "RA-007", severity: "medium", category: "Fraud", signalType: "Beneficiary Risk", description: "Payment to flagged beneficiary cluster", corporate: "Reliance Industries", vpa: "emp_5512@upi", exposure: 88, creditLimit: 700, utilization: 35, riskScore: 68, time: "6 hr ago", status: "Open", rule: "BEN-002: blacklisted UPI handles", recent: [{ ts: "−6h", amount: 88000, merchant: "Unknown VPA" }], beneficiaries: ["sus_handle@paytm"] },
  { id: "RA-008", severity: "medium", category: "Compliance", signalType: "KYC Expiry", description: "Corporate KYC expired 2 days ago", corporate: "Aayush Wellness Ltd.", vpa: "—", exposure: 310, creditLimit: 350, utilization: 89, riskScore: 60, time: "8 hr ago", status: "Open", rule: "KYC-001: expired credentials", recent: [], beneficiaries: [] },
  { id: "RA-009", severity: "low", category: "Behavioral", signalType: "Failed PIN", description: "3 consecutive failed PIN attempts", corporate: "HCL Technologies", vpa: "emp_3341@upi", exposure: 0, creditLimit: 300, utilization: 12, riskScore: 32, time: "12 hr ago", status: "Resolved", rule: "AUTH-001: 3+ failures", recent: [], beneficiaries: [] },
  { id: "RA-010", severity: "low", category: "Fraud", signalType: "Transaction Splitting", description: "5 txns of ₹49,500 in 30 min (under reporting threshold)", corporate: "Tata Steel", vpa: "emp_8821@upi", exposure: 248, creditLimit: 800, utilization: 45, riskScore: 55, time: "1 day ago", status: "Resolved", rule: "SPLT-001: structured transactions", recent: [], beneficiaries: [] },
];

const SEV_CFG: Record<Severity, { cls: string; dot: string }> = {
  critical: { cls: "status-badge-critical", dot: "bg-critical" },
  high:     { cls: "status-badge-warning",  dot: "bg-warning" },
  medium:   { cls: "status-badge-info",     dot: "bg-info" },
  low:      { cls: "bg-muted text-muted-foreground inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", dot: "bg-muted-foreground" },
};

const STATUS_CFG: Record<Status, string> = {
  "Open":         "status-badge-critical",
  "Under Review": "status-badge-warning",
  "Resolved":     "status-badge-success",
  "Dismissed":    "bg-muted text-muted-foreground inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
};

const SIGNAL_ICONS: Record<string, React.ElementType> = {
  "Velocity Breach": Zap, "Geo Anomaly": MapPin, "MCC Violation": CreditCard,
  "Limit Spike": AlertTriangle, "Repayment Default": Clock, "Dormant Reactivation": Eye,
  "Failed PIN": ShieldAlert, "Beneficiary Risk": Network, "KYC Expiry": FileText,
  "Transaction Splitting": Activity,
};

const ALL_SIGNALS = ["All", "Velocity Breach", "Geo Anomaly", "MCC Violation", "Limit Spike", "Dormant Reactivation", "Failed PIN", "Beneficiary Risk", "Transaction Splitting", "Credit Cycling", "Repayment Default", "KYC Expiry", "Network Risk"];

const RISK_TREND = [
  { day: "Mon", alerts: 18, exposure: 8.4 }, { day: "Tue", alerts: 22, exposure: 9.1 },
  { day: "Wed", alerts: 28, exposure: 11.2 }, { day: "Thu", alerts: 24, exposure: 10.5 },
  { day: "Fri", alerts: 31, exposure: 12.4 }, { day: "Sat", alerts: 19, exposure: 9.8 },
  { day: "Sun", alerts: 23, exposure: 12.4 },
];

const RISK_DIST = [
  { name: "Fraud", value: 38, color: "hsl(var(--critical))" },
  { name: "Credit", value: 27, color: "hsl(var(--warning))" },
  { name: "Compliance", value: 18, color: "hsl(var(--info))" },
  { name: "Behavioral", value: 17, color: "hsl(var(--chart-4))" },
];

const FP_TREND = [{ d: 1, v: 2.1 }, { d: 2, v: 1.9 }, { d: 3, v: 2.0 }, { d: 4, v: 1.8 }, { d: 5, v: 1.7 }, { d: 6, v: 1.8 }];

const TOP_RISKY = [
  { name: "Bajaj Finance Ltd.", exposure: 12.4, score: 88 },
  { name: "Aayush Wellness Ltd.", exposure: 3.1, score: 76 },
  { name: "Infosys Ltd.", exposure: 2.45, score: 72 },
  { name: "Mindtree", exposure: 3.4, score: 68 },
  { name: "TCS", exposure: 1.8, score: 64 },
];

const SECTOR_RISK = [
  { sector: "Pharma", risk: 78 }, { sector: "Tech/IT", risk: 62 },
  { sector: "Retail", risk: 51 }, { sector: "Manufacturing", risk: 44 },
  { sector: "Energy", risk: 38 }, { sector: "Financial", risk: 71 },
];

const AUDIT = [
  { ts: "2 min ago", who: "Vikram Patel (Risk Officer)", action: "Froze VPA emp_4821@upi", reason: "Velocity breach RA-001" },
  { ts: "18 min ago", who: "Suresh Iyer (Credit Officer)", action: "Reduced limit Mindtree ₹400L → ₹300L", reason: "Limit spike RA-004" },
  { ts: "45 min ago", who: "Pooja Bhatt (AML Analyst)", action: "Escalated RA-007 to FIU", reason: "Suspicious beneficiary cluster" },
  { ts: "2 hr ago", who: "Vikram Patel", action: "Blocked MCC 7995 globally", reason: "Compliance — gambling category" },
  { ts: "5 hr ago", who: "System (auto)", action: "Auto-froze emp_3341@upi", reason: "3 failed PIN — AUTH-001" },
];

// ── Component ──────────────────────────────────────────────
export default function RiskCompliance() {
  const { toast } = useToast();
  const [tab, setTab] = useState("monitor");
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState<string>("all");
  const [signalFilter, setSignalFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Alert | null>(null);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: string; alert: Alert | null }>({ open: false, type: "", alert: null });

  const filtered = useMemo(() => ALERTS.filter(a => {
    const q = search.toLowerCase();
    const ms = !q || a.corporate.toLowerCase().includes(q) || a.vpa.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const mv = sevFilter === "all" || a.severity === sevFilter;
    const mt = signalFilter === "All" || a.signalType === signalFilter;
    return ms && mv && mt;
  }), [search, sevFilter, signalFilter]);

  const totals = useMemo(() => {
    const totalExposure = ALERTS.filter(a => a.status !== "Resolved" && a.status !== "Dismissed").reduce((s, a) => s + a.exposure, 0);
    return { totalExposure: (totalExposure / 100).toFixed(1) };
  }, []);

  const openAction = (type: string, alert: Alert) => setActionDialog({ open: true, type, alert });
  const confirmAction = () => {
    toast({ title: `${actionDialog.type} executed`, description: `Action logged in audit trail for ${actionDialog.alert?.id}` });
    setActionDialog({ open: false, type: "", alert: null });
  };

  return (
    <DashboardLayout title="Risk, Fraud & Compliance Command Center" subtitle="Real-time monitoring and control for UPI Credit Line">
      {/* ── Primary risk metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <RiskKpi label="Exposure at Risk" value={`₹${totals.totalExposure} Cr`} sub="Across active alerts" trend="up" trendVal="+12%" tone="critical" icon={AlertOctagon} />
        <RiskKpi label="% Portfolio Under Alert" value="8.2%" sub="Of total credit utilized" trend="up" trendVal="+0.4pp" tone="warning" icon={Activity} />
        <RiskKpi label="Fraud Loss Today" value="₹18.2 L" sub="Confirmed cases" trend="down" trendVal="−23%" tone="critical" icon={ShieldOff} />
        <RiskKpi label="Auto-Block Success" value="92%" sub="Prevented vs attempted" trend="up" trendVal="+3pp" tone="success" icon={Shield} />
        <RiskKpi label="False Positive Rate" value="1.8%" sub="Target < 2.0%" tone="success" icon={CheckCircle2} mini={FP_TREND} />
        <RiskKpi label="KYC Risk Exposure" value="₹3.1 Cr" sub="Expired/invalid KYC" tone="warning" icon={FileText} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="monitor"><AlertTriangle className="w-3.5 h-3.5 mr-1.5" />Monitoring</TabsTrigger>
          <TabsTrigger value="policies"><FileText className="w-3.5 h-3.5 mr-1.5" />Policies & Controls</TabsTrigger>
          <TabsTrigger value="portfolio"><Activity className="w-3.5 h-3.5 mr-1.5" />Portfolio Risk</TabsTrigger>
          <TabsTrigger value="audit"><History className="w-3.5 h-3.5 mr-1.5" />Audit Trail</TabsTrigger>
        </TabsList>

        {/* ── MONITORING TAB ── */}
        <TabsContent value="monitor" className="space-y-4">
          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Risk Trend (last 7 days)</h3>
                <Badge variant="outline" className="text-[10px]">Alerts + Exposure (₹ Cr)</Badge>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={RISK_TREND}>
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--critical))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--critical))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="alerts" stroke="hsl(var(--critical))" fill="url(#ga)" strokeWidth={2} />
                  <Line type="monotone" dataKey="exposure" stroke="hsl(var(--warning))" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={RISK_DIST} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={2}>
                    {RISK_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search corporate, VPA, alert ID…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={sevFilter} onValueChange={setSevFilter}>
              <SelectTrigger className="w-[150px]"><Filter className="w-3.5 h-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={signalFilter} onValueChange={setSignalFilter}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>{ALL_SIGNALS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-auto">{filtered.length} alerts</span>
          </div>

          {/* Alerts table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="data-table-header">Alert</TableHead>
                    <TableHead className="data-table-header">Severity</TableHead>
                    <TableHead className="data-table-header">Signal</TableHead>
                    <TableHead className="data-table-header">Entity</TableHead>
                    <TableHead className="data-table-header text-right">Exposure</TableHead>
                    <TableHead className="data-table-header text-right">Limit</TableHead>
                    <TableHead className="data-table-header text-right">Risk</TableHead>
                    <TableHead className="data-table-header">Status</TableHead>
                    <TableHead className="data-table-header text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(a => {
                    const SIcon = SIGNAL_ICONS[a.signalType] || ShieldAlert;
                    return (
                      <TableRow key={a.id} className={cn("cursor-pointer hover:bg-muted/40", a.severity === "critical" && "bg-critical/5")} onClick={() => setSelected(a)}>
                        <TableCell>
                          <div className="font-mono text-xs text-primary">{a.id}</div>
                          <div className="text-xs text-muted-foreground max-w-[220px] truncate">{a.description}</div>
                        </TableCell>
                        <TableCell><span className={SEV_CFG[a.severity].cls}>{a.severity}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5"><SIcon className="w-3.5 h-3.5 text-muted-foreground" /><span className="text-xs">{a.signalType}</span></div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{a.category}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{a.corporate}</div>
                          {a.vpa !== "—" && <div className="font-mono text-[10px] text-muted-foreground">{a.vpa}</div>}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-semibold">₹{a.exposure}L</TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">₹{a.creditLimit}L</TableCell>
                        <TableCell className="text-right">
                          <span className={cn("font-mono text-sm font-bold", a.riskScore >= 80 ? "text-critical" : a.riskScore >= 60 ? "text-warning" : "text-muted-foreground")}>{a.riskScore}</span>
                        </TableCell>
                        <TableCell><span className={STATUS_CFG[a.status]}>{a.status}</span></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => openAction("Freeze VPA", a)}><Snowflake className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => openAction("Reduce Limit", a)}><TrendingDown className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={() => openAction("Escalate", a)}><ArrowUpRight className="w-3 h-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ── POLICIES TAB ── */}
        <TabsContent value="policies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PolicyCard title="Velocity Thresholds" rules={[
              { k: "Max txns / 5 min (per VPA)", v: "20", auto: true },
              { k: "Max txns / hour (per corporate)", v: "500", auto: true },
              { k: "Max amount / 24h (per VPA)", v: "₹5 L", auto: false },
            ]} />
            <PolicyCard title="MCC Restrictions" rules={[
              { k: "Gambling (MCC 7995)", v: "Blocked globally", auto: true },
              { k: "Crypto exchanges (MCC 6051)", v: "Blocked globally", auto: true },
              { k: "Cash-equivalent (MCC 6010)", v: "Per-corporate", auto: false },
            ]} />
            <PolicyCard title="Limit Triggers" rules={[
              { k: "Auto-alert at utilization", v: "80%", auto: true },
              { k: "Auto-freeze on spike (% / 2h)", v: "75%", auto: true },
              { k: "Step-up auth at single txn", v: "₹50,000", auto: true },
            ]} />
            <PolicyCard title="Auto-Actions" rules={[
              { k: "Auto-freeze on velocity breach", v: "Enabled", auto: true },
              { k: "Auto-block on geo anomaly", v: "Enabled", auto: true },
              { k: "Auto-escalate to FIU on STR signal", v: "Disabled", auto: false },
            ]} />
          </div>
        </TabsContent>

        {/* ── PORTFOLIO RISK TAB ── */}
        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Top 10 Risky Corporates (by exposure)</h3>
              <div className="space-y-2">
                {TOP_RISKY.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/40">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-semibold">₹{c.exposure} Cr</span>
                      <span className={cn("font-mono text-xs px-2 py-0.5 rounded", c.score >= 80 ? "bg-critical-muted text-critical-muted-foreground" : "bg-warning-muted text-warning-muted-foreground")}>{c.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Sector-Wise Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={SECTOR_RISK}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="sector" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="risk" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 lg:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-3">Credit Utilization Heatmap</h3>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 50 }).map((_, i) => {
                  const v = Math.random();
                  const color = v > 0.85 ? "bg-critical" : v > 0.7 ? "bg-warning" : v > 0.4 ? "bg-info/60" : "bg-success/60";
                  return <div key={i} className={cn("aspect-square rounded", color)} title={`Corp ${i + 1}: ${(v * 100).toFixed(0)}%`} />;
                })}
              </div>
              <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-success/60 rounded" />&lt;40%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-info/60 rounded" />40-70%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-warning rounded" />70-85%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-critical rounded" />&gt;85%</span>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ── AUDIT TAB ── */}
        <TabsContent value="audit">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="data-table-header w-32">Timestamp</TableHead>
                  <TableHead className="data-table-header">Action</TableHead>
                  <TableHead className="data-table-header">Performed By</TableHead>
                  <TableHead className="data-table-header">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AUDIT.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{a.ts}</TableCell>
                    <TableCell className="text-sm font-medium">{a.action}</TableCell>
                    <TableCell className="text-sm">{a.who}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Alert detail drawer ── */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4 border-b">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-primary">{selected.id}</span>
                      <span className={SEV_CFG[selected.severity].cls}>{selected.severity}</span>
                    </div>
                    <SheetTitle className="text-lg">{selected.signalType}</SheetTitle>
                    <SheetDescription>{selected.description}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-5 space-y-5">
                <SectionBlock icon={FileText} title="Summary">
                  <div className="space-y-1.5 text-sm">
                    <Row label="Rule triggered" value={selected.rule} mono />
                    <Row label="Risk score" value={
                      <span className={cn("font-mono font-bold", selected.riskScore >= 80 ? "text-critical" : "text-warning")}>{selected.riskScore} / 100</span>
                    } />
                    <Row label="Status" value={<span className={STATUS_CFG[selected.status]}>{selected.status}</span>} />
                  </div>
                </SectionBlock>

                <SectionBlock icon={AlertOctagon} title="Financial Context">
                  <div className="grid grid-cols-3 gap-3">
                    <MetricBox label="Exposure at risk" value={`₹${selected.exposure} L`} tone="critical" />
                    <MetricBox label="Credit limit" value={`₹${selected.creditLimit} L`} />
                    <MetricBox label="Utilization" value={`${selected.utilization}%`} tone={selected.utilization > 80 ? "warning" : "default"} />
                  </div>
                </SectionBlock>

                {selected.recent.length > 0 && (
                  <SectionBlock icon={Activity} title="Recent Transactions (pattern deviation)">
                    <div className="space-y-1">
                      {selected.recent.map((t, i) => (
                        <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-muted/40">
                          <div><div className="font-medium text-foreground">{t.merchant}</div><div className="text-muted-foreground">{t.ts}</div></div>
                          <span className="font-mono font-semibold">₹{t.amount.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                {selected.beneficiaries.length > 0 && (
                  <SectionBlock icon={Network} title="Network Signals — Linked Beneficiaries">
                    <div className="flex flex-wrap gap-1.5">
                      {selected.beneficiaries.map((b, i) => (
                        <span key={i} className="font-mono text-xs px-2 py-1 bg-warning-muted text-warning-muted-foreground rounded">{b}</span>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                <SectionBlock icon={Zap} title="Recommended Actions">
                  <div className="p-3 rounded-lg border border-critical/30 bg-critical-muted">
                    <div className="text-xs font-bold text-critical-muted-foreground mb-2">SUGGESTED — FREEZE IMMEDIATELY</div>
                    <p className="text-sm text-critical-muted-foreground">Pattern indicates {selected.signalType.toLowerCase()}. Recommend freezing VPA and notifying corporate RM within 5 minutes.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button size="sm" variant="destructive" onClick={() => openAction("Freeze VPA", selected)}><Snowflake className="w-3.5 h-3.5 mr-1.5" />Freeze VPA</Button>
                    <Button size="sm" variant="outline" onClick={() => openAction("Reduce Limit", selected)}><TrendingDown className="w-3.5 h-3.5 mr-1.5" />Reduce Limit</Button>
                    <Button size="sm" variant="outline" onClick={() => openAction("Block MCC", selected)}><CreditCard className="w-3.5 h-3.5 mr-1.5" />Block MCC</Button>
                    <Button size="sm" variant="outline" onClick={() => openAction("Escalate", selected)}><ArrowUpRight className="w-3.5 h-3.5 mr-1.5" />Escalate</Button>
                  </div>
                </SectionBlock>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Action confirmation dialog ── */}
      <Dialog open={actionDialog.open} onOpenChange={(o) => !o && setActionDialog({ open: false, type: "", alert: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm: {actionDialog.type}</DialogTitle>
            <DialogDescription>This action will be logged in the audit trail and cannot be undone.</DialogDescription>
          </DialogHeader>
          {actionDialog.alert && (
            <div className="space-y-3">
              <div className="p-3 bg-muted/40 rounded text-sm">
                <div className="text-muted-foreground text-xs">Target</div>
                <div className="font-medium">{actionDialog.alert.corporate} · <span className="font-mono">{actionDialog.alert.vpa}</span></div>
              </div>
              <div><Label className="text-xs">Reason (mandatory)</Label><Textarea placeholder="Justification for action…" rows={3} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: "", alert: null })}>Cancel</Button>
            <Button variant="destructive" onClick={confirmAction}>Confirm {actionDialog.type}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// ── Helpers ────────────────────────────────────────────────
function RiskKpi({ label, value, sub, trend, trendVal, tone, icon: Icon, mini }: any) {
  return (
    <Card className="kpi-tile">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={cn("w-3.5 h-3.5",
          tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-muted-foreground")} />
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-xl font-bold text-foreground">{value}</span>
        {trend && (
          <span className={cn("flex items-center text-[10px] font-medium mb-0.5",
            (trend === "up" && tone === "critical") || (trend === "up" && tone === "warning") ? "text-critical"
            : trend === "down" && tone === "critical" ? "text-success"
            : "text-success")}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{trendVal}
          </span>
        )}
        {mini && (
          <ResponsiveContainer width={50} height={20}>
            <LineChart data={mini}><Line type="monotone" dataKey="v" stroke="hsl(var(--success))" strokeWidth={1.5} dot={false} /></LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <span className="text-[10px] text-muted-foreground">{sub}</span>
    </Card>
  );
}

function PolicyCard({ title, rules }: { title: string; rules: { k: string; v: string; auto: boolean }[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2">
        {rules.map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
            <span className="text-xs text-muted-foreground">{r.k}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-foreground">{r.v}</span>
              <Switch checked={r.auto} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SectionBlock({ icon: Icon, title, children }: any) {
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

function Row({ label, value, mono }: any) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(mono && "font-mono text-xs", "text-foreground")}>{value}</span>
    </div>
  );
}

function MetricBox({ label, value, tone }: any) {
  return (
    <div className="p-2.5 rounded-md bg-muted/40">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-base font-bold mt-1",
        tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : "text-foreground")}>{value}</div>
    </div>
  );
}
