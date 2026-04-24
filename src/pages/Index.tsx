import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import {
  IndianRupee,
  Building2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
  Wallet,
  Target,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

/* ───────── Sample data ───────── */
const utilizationTrend6m = [
  { period: "Nov", util: 58 },
  { period: "Dec", util: 61 },
  { period: "Jan", util: 63 },
  { period: "Feb", util: 64 },
  { period: "Mar", util: 66 },
  { period: "Apr", util: 67.4 },
];

const utilizationTrendWeekly = [
  { period: "W1", util: 64 },
  { period: "W2", util: 65 },
  { period: "W3", util: 66 },
  { period: "W4", util: 65.5 },
  { period: "W5", util: 66.8 },
  { period: "W6", util: 67.4 },
];

const spendDaily = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}`,
  spend: Math.round(12 + Math.sin(i / 3) * 3 + (i / 6) + Math.random() * 1.5),
}));

const spendWeekly = [
  { d: "W-5", spend: 92 },
  { d: "W-4", spend: 98 },
  { d: "W-3", spend: 104 },
  { d: "W-2", spend: 112 },
  { d: "W-1", spend: 118 },
  { d: "This", spend: 124 },
];

const topPortfolio = [
  { name: "Indo Amines Ltd.", utilized: "₹11.2Cr", limit: "₹12Cr", utilPct: 93, risk: "High" as const },
  { name: "Innovana Thinklabs Ltd.", utilized: "₹7.1Cr", limit: "₹8Cr", utilPct: 89, risk: "High" as const },
  { name: "V2 Retail Ltd.", utilized: "₹12.6Cr", limit: "₹15Cr", utilPct: 84, risk: "Medium" as const },
  { name: "Globus Power Generation Ltd.", utilized: "₹15.4Cr", limit: "₹20Cr", utilPct: 77, risk: "Medium" as const },
  { name: "Ksolves India Ltd.", utilized: "₹4.3Cr", limit: "₹6Cr", utilPct: 72, risk: "Low" as const },
];

const lowUtilization = [
  { name: "Bhadora Industries Ltd.", utilPct: 30, headroom: "₹6.3Cr" },
  { name: "Aayush Wellness Ltd.", utilPct: 24, headroom: "₹3.8Cr" },
  { name: "Crest Ventures Ltd.", utilPct: 32, headroom: "₹6.8Cr" },
];

const riskBadge = (r: string) => {
  if (r === "High") return "status-badge-critical";
  if (r === "Medium") return "status-badge-warning";
  return "status-badge-success";
};

/* ───────── Reusable bits ───────── */
function CockpitKpi({
  label,
  value,
  sub,
  icon,
  trend,
  accent,
  children,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: "default" | "success" | "warning" | "critical";
  children?: React.ReactNode;
}) {
  const accentBorder =
    accent === "success"
      ? "border-l-success"
      : accent === "warning"
        ? "border-l-warning"
        : accent === "critical"
          ? "border-l-critical"
          : "border-l-primary";
  return (
    <div className={cn("kpi-tile border-l-2", accentBorder)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground leading-tight">{value}</span>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium mb-1",
              trend.positive ? "text-success" : "text-critical",
            )}
          >
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      {children}
    </div>
  );
}

/* ───────── Page ───────── */
const Index = () => {
  const [utilRange, setUtilRange] = useState<"weekly" | "monthly">("monthly");
  const [spendRange, setSpendRange] = useState<"weekly" | "monthly">("monthly");

  const utilData = useMemo(() => (utilRange === "weekly" ? utilizationTrendWeekly : utilizationTrend6m), [utilRange]);
  const spendData = useMemo(() => (spendRange === "weekly" ? spendWeekly : spendDaily), [spendRange]);

  return (
    <DashboardLayout title="Business Command Center" subtitle="Credit Line on UPI — Executive Overview">
      {/* ────── 1. BUSINESS SNAPSHOT ────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-3">
        <CockpitKpi
          label="Total Book"
          value="₹842Cr"
          sub={
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Sanctioned ₹1,250Cr</span>
                <span className="font-semibold text-foreground">67.4%</span>
              </div>
              <Progress value={67.4} className="h-1.5" />
            </div>
          }
          icon={<IndianRupee className="w-4 h-4" />}
          trend={{ value: "2.1% MoM", positive: true }}
        />
        <CockpitKpi
          label="Revenue (MTD)"
          value="₹14.6Cr"
          sub={<>Yield <span className="text-foreground font-medium">11.4%</span> · vs ₹13.2Cr last mo</>}
          icon={<Wallet className="w-4 h-4" />}
          trend={{ value: "10.6%", positive: true }}
          accent="success"
        />
        <CockpitKpi
          label="Growth"
          value="+8.4%"
          sub={<>Utilized MoM · Spend <span className="text-success font-medium">+12.1%</span></>}
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: "MoM", positive: true }}
        />
        <CockpitKpi
          label="Active Corporates"
          value="20"
          sub={<>+2 new this mo · Activation <span className="text-foreground font-medium">87%</span></>}
          icon={<Building2 className="w-4 h-4" />}
          trend={{ value: "2", positive: true }}
        />
        <CockpitKpi
          label="Risk Exposure"
          value="₹68Cr"
          sub={<>8.1% of book · <span className="text-critical font-medium">3 corporates</span> high risk</>}
          icon={<ShieldAlert className="w-4 h-4" />}
          accent="critical"
          trend={{ value: "0.4%", positive: false }}
        />
      </div>

      {/* Micro metrics strip */}
      <div className="bg-card border rounded-xl px-4 py-2.5 mb-6 flex flex-wrap items-center gap-x-8 gap-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Avg Ticket Size</span>
          <span className="font-semibold text-foreground">₹4,820</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Target className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Txn Success Rate</span>
          <span className="font-semibold text-success">98.6%</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Failed Txn Value (Today)</span>
          <span className="font-semibold text-critical">₹24.1L</span>
        </div>
        <div className="flex items-center gap-2 text-xs ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground">Live · updated just now</span>
        </div>
      </div>

      {/* ────── 2. TRENDS ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard
          title="Utilization Trend"
          subtitle="Portfolio-level utilization %"
          range={utilRange}
          setRange={setUtilRange}
        >
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={utilData} margin={{ top: 5, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[50, 80]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, "Utilization"]}
              />
              <Area type="monotone" dataKey="util" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#utilGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Spend Trend"
          subtitle={spendRange === "weekly" ? "Weekly spend (₹Cr)" : "Daily spend last 30 days (₹Cr)"}
          range={spendRange}
          setRange={setSpendRange}
        >
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={spendData} margin={{ top: 5, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`₹${v}Cr`, "Spend"]}
              />
              <Line type="monotone" dataKey="spend" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ────── 3. OPPORTUNITY + RISK ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* LEFT: Growth Opportunities */}
        <div className="bg-card rounded-xl border">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">Growth Opportunities</h3>
            </div>
            <Link to="/corporates">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                View All <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-success-muted/40 border border-success/20 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Unused Limits</div>
                <div className="text-xl font-bold text-foreground mt-0.5">₹408Cr</div>
                <div className="text-[11px] text-muted-foreground">32.6% of total book</div>
              </div>
              <div className="rounded-lg bg-info-muted/40 border border-info/20 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Low Util &lt;50%</div>
                <div className="text-xl font-bold text-foreground mt-0.5">7</div>
                <div className="text-[11px] text-muted-foreground">corporates eligible for review</div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Top 3 — Lowest Utilization
              </div>
              <div className="divide-y border rounded-lg">
                {lowUtilization.map((c) => (
                  <div key={c.name} className="flex items-center justify-between px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">Headroom {c.headroom}</p>
                    </div>
                    <span className="text-xs font-semibold text-success">{c.utilPct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Risk Overview */}
        <div className="bg-card rounded-xl border">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-critical" />
              <h3 className="text-sm font-semibold text-foreground">Risk Overview</h3>
            </div>
            <Link to="/risk">
              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary">
                View Alerts <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-critical-muted/40 border border-critical/20 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">High Risk</div>
                <div className="text-xl font-bold text-foreground mt-0.5">3</div>
                <div className="text-[11px] text-muted-foreground">₹68Cr exposure</div>
              </div>
              <div className="rounded-lg bg-warning-muted/40 border border-warning/20 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Medium Risk</div>
                <div className="text-xl font-bold text-foreground mt-0.5">5</div>
                <div className="text-[11px] text-muted-foreground">₹142Cr exposure</div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Key Alerts Summary
              </div>
              <div className="space-y-1.5">
                <AlertSummaryRow label="Velocity breaches" count={4} severity="critical" />
                <AlertSummaryRow label="SLA risks" count={2} severity="warning" />
                <AlertSummaryRow label="Policy violations" count={6} severity="critical" />
                <AlertSummaryRow label="KYC expiring (30d)" count={3} severity="info" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────── 4. PORTFOLIO BREAKDOWN ────── */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Top Corporates by Utilization</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Showing 5 of 20 · sorted by utilization %</p>
          </div>
          <Link to="/corporates">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              View Full Portfolio <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Corporate", "Utilized", "Limit", "Util %", "Risk"].map((h) => (
                  <th key={h} className="data-table-header text-left px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {topPortfolio.map((c) => (
                <tr key={c.name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-foreground">{c.utilized}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{c.limit}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            c.utilPct > 85 ? "bg-critical" : c.utilPct > 70 ? "bg-warning" : "bg-primary",
                          )}
                          style={{ width: `${c.utilPct}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground font-medium">{c.utilPct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={riskBadge(c.risk)}>{c.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ───────── helpers ───────── */
function ChartCard({
  title,
  subtitle,
  range,
  setRange,
  children,
}: {
  title: string;
  subtitle: string;
  range: "weekly" | "monthly";
  setRange: (r: "weekly" | "monthly") => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className="inline-flex bg-muted rounded-md p-0.5">
          {(["weekly", "monthly"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded capitalize transition-colors",
                range === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function AlertSummaryRow({
  label,
  count,
  severity,
}: {
  label: string;
  count: number;
  severity: "critical" | "warning" | "info";
}) {
  const dot =
    severity === "critical" ? "bg-critical" : severity === "warning" ? "bg-warning" : "bg-info";
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 hover:bg-muted/70 transition-colors">
      <div className="flex items-center gap-2">
        <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
        <span className="text-xs text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">{count}</span>
        <ArrowDownRight className="w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  );
}

export default Index;
