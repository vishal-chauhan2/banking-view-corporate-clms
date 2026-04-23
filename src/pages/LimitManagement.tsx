import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowUp, ArrowDown, Search, Filter, TrendingUp, TrendingDown, AlertTriangle, ShieldAlert,
  CheckCircle2, XCircle, Clock, ChevronLeft, Lightbulb, Lock, Unlock, UserX, CreditCard, History
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── Data ──────────────────────────────────────────────
interface Corporate {
  id: string;
  name: string;
  industry: string;
  sanctioned: number;
  utilized: number;
  riskScore: number;
  riskStatus: "Low" | "Medium" | "High";
  status: "Active" | "Restricted" | "Frozen";
  lastLimitChange: string;
  recommendedLimit: number | null;
  dpd: number;
  missedRepayments: number;
  anomalyFlags: number;
  velocityAlerts: number;
  peakUtil30d: number;
  avgUtil: number;
  topEmployees: { name: string; spent: number; pct: number }[];
  limitHistory: { date: string; oldLimit: number; newLimit: number; changedBy: string; role: string; reason: string }[];
  utilizationTrend: { day: string; pct: number }[];
}

const fmtCr = (v: number) => `₹${(v / 10000000).toFixed(1)} Cr`;
const fmtLakh = (v: number) => `₹${(v / 100000).toFixed(1)} L`;

const CORPORATES: Corporate[] = [
  {
    id: "1", name: "Indo Amines Ltd.", industry: "Chemicals / Pharma",
    sanctioned: 500000000, utilized: 465000000, riskScore: 82, riskStatus: "High", status: "Active",
    lastLimitChange: "2025-12-10", recommendedLimit: 600000000, dpd: 0, missedRepayments: 0,
    anomalyFlags: 2, velocityAlerts: 3, peakUtil30d: 95, avgUtil: 88,
    topEmployees: [
      { name: "R. Sharma", spent: 12500000, pct: 2.7 }, { name: "A. Patel", spent: 9800000, pct: 2.1 },
      { name: "K. Reddy", spent: 8200000, pct: 1.8 }, { name: "S. Gupta", spent: 7100000, pct: 1.5 },
      { name: "M. Joshi", spent: 6500000, pct: 1.4 },
    ],
    limitHistory: [
      { date: "2025-12-10", oldLimit: 400000000, newLimit: 500000000, changedBy: "Vikram S.", role: "Credit Officer", reason: "Business expansion approved" },
      { date: "2025-06-01", oldLimit: 300000000, newLimit: 400000000, changedBy: "Anita K.", role: "RM", reason: "Consistent utilization >85%" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 80 + Math.random() * 15 })),
  },
  {
    id: "2", name: "Fermenta Biotech Ltd.", industry: "Chemicals / Pharma",
    sanctioned: 300000000, utilized: 195000000, riskScore: 45, riskStatus: "Low", status: "Active",
    lastLimitChange: "2025-11-20", recommendedLimit: null, dpd: 0, missedRepayments: 0,
    anomalyFlags: 0, velocityAlerts: 0, peakUtil30d: 70, avgUtil: 62,
    topEmployees: [
      { name: "P. Desai", spent: 8500000, pct: 4.4 }, { name: "V. Mehta", spent: 6200000, pct: 3.2 },
      { name: "L. Iyer", spent: 5100000, pct: 2.6 }, { name: "H. Shah", spent: 4800000, pct: 2.5 },
      { name: "D. Nair", spent: 3900000, pct: 2.0 },
    ],
    limitHistory: [
      { date: "2025-11-20", oldLimit: 250000000, newLimit: 300000000, changedBy: "Sunil M.", role: "RM", reason: "Quarterly review increase" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 55 + Math.random() * 15 })),
  },
  {
    id: "3", name: "Bajaj Healthcare Ltd.", industry: "Chemicals / Pharma",
    sanctioned: 200000000, utilized: 178000000, riskScore: 78, riskStatus: "High", status: "Active",
    lastLimitChange: "2026-01-15", recommendedLimit: 250000000, dpd: 5, missedRepayments: 1,
    anomalyFlags: 1, velocityAlerts: 2, peakUtil30d: 92, avgUtil: 86,
    topEmployees: [
      { name: "T. Verma", spent: 9200000, pct: 5.2 }, { name: "N. Kumar", spent: 7800000, pct: 4.4 },
      { name: "B. Rao", spent: 5500000, pct: 3.1 }, { name: "G. Singh", spent: 4200000, pct: 2.4 },
      { name: "C. Das", spent: 3800000, pct: 2.1 },
    ],
    limitHistory: [
      { date: "2026-01-15", oldLimit: 180000000, newLimit: 200000000, changedBy: "Ravi P.", role: "Credit Officer", reason: "Seasonal demand increase" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 82 + Math.random() * 10 })),
  },
  {
    id: "4", name: "Innovana Thinklabs Ltd.", industry: "Tech / IT",
    sanctioned: 150000000, utilized: 42000000, riskScore: 22, riskStatus: "Low", status: "Active",
    lastLimitChange: "2025-09-01", recommendedLimit: 100000000, dpd: 0, missedRepayments: 0,
    anomalyFlags: 0, velocityAlerts: 0, peakUtil30d: 32, avgUtil: 25,
    topEmployees: [
      { name: "J. Kapoor", spent: 4200000, pct: 10 }, { name: "F. Ali", spent: 3100000, pct: 7.4 },
      { name: "E. Thomas", spent: 2800000, pct: 6.7 }, { name: "I. Bhat", spent: 2200000, pct: 5.2 },
      { name: "O. Pillai", spent: 1800000, pct: 4.3 },
    ],
    limitHistory: [],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 20 + Math.random() * 12 })),
  },
  {
    id: "5", name: "Ksolves India Ltd.", industry: "Tech / IT",
    sanctioned: 250000000, utilized: 210000000, riskScore: 65, riskStatus: "Medium", status: "Active",
    lastLimitChange: "2026-02-28", recommendedLimit: 300000000, dpd: 0, missedRepayments: 0,
    anomalyFlags: 1, velocityAlerts: 1, peakUtil30d: 88, avgUtil: 80,
    topEmployees: [
      { name: "W. Khan", spent: 11000000, pct: 5.2 }, { name: "Q. Saxena", spent: 8900000, pct: 4.2 },
      { name: "Z. Fernandez", spent: 7200000, pct: 3.4 }, { name: "U. Chopra", spent: 5500000, pct: 2.6 },
      { name: "Y. Banerjee", spent: 4100000, pct: 2.0 },
    ],
    limitHistory: [
      { date: "2026-02-28", oldLimit: 200000000, newLimit: 250000000, changedBy: "Meera L.", role: "RM", reason: "Headcount growth — 200 new employees" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 75 + Math.random() * 12 })),
  },
  {
    id: "6", name: "V2 Retail Ltd.", industry: "Consumer / Retail",
    sanctioned: 400000000, utilized: 348000000, riskScore: 72, riskStatus: "Medium", status: "Active",
    lastLimitChange: "2026-03-05", recommendedLimit: 450000000, dpd: 0, missedRepayments: 0,
    anomalyFlags: 0, velocityAlerts: 1, peakUtil30d: 90, avgUtil: 84,
    topEmployees: [
      { name: "S. Agarwal", spent: 15000000, pct: 4.3 }, { name: "D. Mishra", spent: 12000000, pct: 3.4 },
      { name: "R. Tiwari", spent: 9500000, pct: 2.7 }, { name: "K. Pandey", spent: 8000000, pct: 2.3 },
      { name: "L. Jain", spent: 6500000, pct: 1.9 },
    ],
    limitHistory: [
      { date: "2026-03-05", oldLimit: 350000000, newLimit: 400000000, changedBy: "Amit R.", role: "Credit Officer", reason: "Festive season expansion" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 78 + Math.random() * 12 })),
  },
  {
    id: "7", name: "Connplex Cinemas Ltd.", industry: "Industrial / Manufacturing",
    sanctioned: 100000000, utilized: 18000000, riskScore: 15, riskStatus: "Low", status: "Active",
    lastLimitChange: "2025-07-01", recommendedLimit: 60000000, dpd: 0, missedRepayments: 0,
    anomalyFlags: 0, velocityAlerts: 0, peakUtil30d: 22, avgUtil: 17,
    topEmployees: [
      { name: "A. Roy", spent: 2200000, pct: 12.2 }, { name: "B. Sen", spent: 1800000, pct: 10.0 },
      { name: "C. Pal", spent: 1500000, pct: 8.3 }, { name: "D. Bose", spent: 1200000, pct: 6.7 },
      { name: "E. Dey", spent: 900000, pct: 5.0 },
    ],
    limitHistory: [],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 12 + Math.random() * 10 })),
  },
  {
    id: "8", name: "Globus Power Generation Ltd.", industry: "Energy / Infrastructure",
    sanctioned: 600000000, utilized: 522000000, riskScore: 88, riskStatus: "High", status: "Restricted",
    lastLimitChange: "2026-04-01", recommendedLimit: null, dpd: 15, missedRepayments: 2,
    anomalyFlags: 4, velocityAlerts: 5, peakUtil30d: 92, avgUtil: 85,
    topEmployees: [
      { name: "G. Prasad", spent: 25000000, pct: 4.8 }, { name: "H. Yadav", spent: 18000000, pct: 3.4 },
      { name: "I. Sinha", spent: 14000000, pct: 2.7 }, { name: "J. Dubey", spent: 11000000, pct: 2.1 },
      { name: "K. Chauhan", spent: 8500000, pct: 1.6 },
    ],
    limitHistory: [
      { date: "2026-04-01", oldLimit: 600000000, newLimit: 600000000, changedBy: "System", role: "Risk Officer", reason: "Restriction applied — DPD 15, missed repayments" },
      { date: "2025-10-15", oldLimit: 500000000, newLimit: 600000000, changedBy: "Deepa N.", role: "Credit Officer", reason: "Infrastructure project funding" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 82 + Math.random() * 10 })),
  },
  {
    id: "9", name: "Dhanlaxmi Bank Ltd.", industry: "Financial / Misc",
    sanctioned: 350000000, utilized: 280000000, riskScore: 58, riskStatus: "Medium", status: "Active",
    lastLimitChange: "2026-03-20", recommendedLimit: null, dpd: 0, missedRepayments: 0,
    anomalyFlags: 1, velocityAlerts: 0, peakUtil30d: 84, avgUtil: 78,
    topEmployees: [
      { name: "M. Nambiar", spent: 14000000, pct: 5.0 }, { name: "N. Kurup", spent: 10000000, pct: 3.6 },
      { name: "O. Menon", spent: 8500000, pct: 3.0 }, { name: "P. Pillai", spent: 6200000, pct: 2.2 },
      { name: "Q. Nair", spent: 5000000, pct: 1.8 },
    ],
    limitHistory: [
      { date: "2026-03-20", oldLimit: 300000000, newLimit: 350000000, changedBy: "Sanjay D.", role: "RM", reason: "Portfolio growth target" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 72 + Math.random() * 12 })),
  },
  {
    id: "10", name: "Crest Ventures Ltd.", industry: "Financial / Misc",
    sanctioned: 450000000, utilized: 135000000, riskScore: 30, riskStatus: "Low", status: "Active",
    lastLimitChange: "2025-12-01", recommendedLimit: 300000000, dpd: 0, missedRepayments: 0,
    anomalyFlags: 0, velocityAlerts: 0, peakUtil30d: 35, avgUtil: 28,
    topEmployees: [
      { name: "R. Jha", spent: 7500000, pct: 5.6 }, { name: "S. Tripathi", spent: 5800000, pct: 4.3 },
      { name: "T. Shukla", spent: 4200000, pct: 3.1 }, { name: "U. Pandey", spent: 3100000, pct: 2.3 },
      { name: "V. Tiwari", spent: 2500000, pct: 1.9 },
    ],
    limitHistory: [],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 24 + Math.random() * 10 })),
  },
  {
    id: "11", name: "Hardwyn India Ltd.", industry: "Industrial / Manufacturing",
    sanctioned: 180000000, utilized: 162000000, riskScore: 76, riskStatus: "High", status: "Active",
    lastLimitChange: "2026-02-10", recommendedLimit: 220000000, dpd: 3, missedRepayments: 0,
    anomalyFlags: 2, velocityAlerts: 1, peakUtil30d: 94, avgUtil: 88,
    topEmployees: [
      { name: "W. Malik", spent: 8200000, pct: 5.1 }, { name: "X. Saini", spent: 6800000, pct: 4.2 },
      { name: "Y. Hooda", spent: 5100000, pct: 3.1 }, { name: "Z. Gill", spent: 4000000, pct: 2.5 },
      { name: "A. Grewal", spent: 3200000, pct: 2.0 },
    ],
    limitHistory: [
      { date: "2026-02-10", oldLimit: 150000000, newLimit: 180000000, changedBy: "Priya V.", role: "RM", reason: "Capacity expansion" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 84 + Math.random() * 10 })),
  },
  {
    id: "12", name: "Thangamayil Jewellery Ltd.", industry: "Consumer / Retail",
    sanctioned: 280000000, utilized: 238000000, riskScore: 68, riskStatus: "Medium", status: "Active",
    lastLimitChange: "2026-01-08", recommendedLimit: 320000000, dpd: 0, missedRepayments: 0,
    anomalyFlags: 0, velocityAlerts: 1, peakUtil30d: 89, avgUtil: 82,
    topEmployees: [
      { name: "B. Murugan", spent: 12000000, pct: 5.0 }, { name: "C. Selvam", spent: 9500000, pct: 4.0 },
      { name: "D. Rajan", spent: 7200000, pct: 3.0 }, { name: "E. Krishnan", spent: 5800000, pct: 2.4 },
      { name: "F. Bala", spent: 4500000, pct: 1.9 },
    ],
    limitHistory: [
      { date: "2026-01-08", oldLimit: 250000000, newLimit: 280000000, changedBy: "Gopal T.", role: "Credit Officer", reason: "Wedding season demand" },
    ],
    utilizationTrend: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, pct: 76 + Math.random() * 12 })),
  },
];

interface PendingApproval {
  id: string;
  corporateId: string;
  corporateName: string;
  type: "increase" | "decrease" | "freeze" | "override";
  currentLimit: number;
  requestedLimit: number;
  requestedBy: string;
  role: string;
  reason: string;
  date: string;
  utilization: number;
  riskStatus: "Low" | "Medium" | "High";
}

const PENDING_APPROVALS: PendingApproval[] = [
  { id: "pa1", corporateId: "1", corporateName: "Indo Amines Ltd.", type: "increase", currentLimit: 500000000, requestedLimit: 600000000, requestedBy: "Anita K.", role: "RM", reason: "Consistent 90%+ utilization for 15 days, business expansion", date: "2026-04-20", utilization: 93, riskStatus: "High" },
  { id: "pa2", corporateId: "5", corporateName: "Ksolves India Ltd.", type: "increase", currentLimit: 250000000, requestedLimit: 300000000, requestedBy: "Meera L.", role: "RM", reason: "Headcount growth — 200 new employees onboarded", date: "2026-04-19", utilization: 84, riskStatus: "Medium" },
  { id: "pa3", corporateId: "8", corporateName: "Globus Power Generation Ltd.", type: "freeze", currentLimit: 600000000, requestedLimit: 600000000, requestedBy: "System", role: "Risk Engine", reason: "DPD 15 days, 2 missed repayments, 4 anomaly flags", date: "2026-04-18", utilization: 87, riskStatus: "High" },
  { id: "pa4", corporateId: "11", corporateName: "Hardwyn India Ltd.", type: "override", currentLimit: 180000000, requestedLimit: 220000000, requestedBy: "Priya V.", role: "RM", reason: "Temporary 30-day override for project procurement", date: "2026-04-17", utilization: 90, riskStatus: "High" },
];

interface Recommendation {
  id: string;
  corporateId: string;
  corporateName: string;
  type: "increase" | "decrease" | "restrict";
  message: string;
  severity: "info" | "warning" | "critical";
}

const RECOMMENDATIONS: Recommendation[] = [
  { id: "r1", corporateId: "1", corporateName: "Indo Amines Ltd.", type: "increase", message: "At 93% utilization for 5+ days → Recommend limit increase to ₹60 Cr", severity: "warning" },
  { id: "r2", corporateId: "4", corporateName: "Innovana Thinklabs Ltd.", type: "decrease", message: "Low utilization (<28%) for 30+ days → Recommend limit reduction to ₹10 Cr", severity: "info" },
  { id: "r3", corporateId: "8", corporateName: "Globus Power Generation Ltd.", type: "restrict", message: "Rising DPD trend (15 days), 2 missed repayments → Recommend full restriction", severity: "critical" },
  { id: "r4", corporateId: "7", corporateName: "Connplex Cinemas Ltd.", type: "decrease", message: "Utilization consistently <20% → Recommend limit reduction to ₹6 Cr", severity: "info" },
  { id: "r5", corporateId: "3", corporateName: "Bajaj Healthcare Ltd.", type: "increase", message: "At 89% utilization, 5 DPD but recovering → Monitor before increase", severity: "warning" },
];

// ── Helpers ───────────────────────────────────────────
function riskBadge(status: "Low" | "Medium" | "High") {
  const cls = status === "Low" ? "status-badge-success" : status === "Medium" ? "status-badge-warning" : "status-badge-critical";
  return <span className={cls}>{status}</span>;
}

function statusBadge(status: "Active" | "Restricted" | "Frozen") {
  const cls = status === "Active" ? "status-badge-success" : status === "Restricted" ? "status-badge-warning" : "status-badge-critical";
  return <span className={cls}>{status}</span>;
}

function utilColor(pct: number) {
  if (pct >= 80) return "text-critical";
  if (pct >= 60) return "text-warning";
  return "text-success";
}

function progressColor(pct: number) {
  if (pct >= 80) return "[&>div]:bg-critical";
  if (pct >= 60) return "[&>div]:bg-warning";
  return "[&>div]:bg-success";
}

// ── Component ─────────────────────────────────────────
export default function LimitManagement() {
  const [search, setSearch] = useState("");
  const [filterUtil, setFilterUtil] = useState<string>("all");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("corporates");

  // Action dialogs
  const [adjustDialog, setAdjustDialog] = useState<{ open: boolean; corporate: Corporate | null }>({ open: false, corporate: null });
  const [overrideDialog, setOverrideDialog] = useState<{ open: boolean; corporate: Corporate | null }>({ open: false, corporate: null });
  const [restrictDialog, setRestrictDialog] = useState<{ open: boolean; corporate: Corporate | null }>({ open: false, corporate: null });
  const [newLimit, setNewLimit] = useState("");
  const [reason, setReason] = useState("");
  const [overrideDuration, setOverrideDuration] = useState("7");
  const [restrictType, setRestrictType] = useState("freeze");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({ open: false, title: "", message: "", onConfirm: () => {} });

  // Pending approvals state
  const [pendingApprovals, setPendingApprovals] = useState(PENDING_APPROVALS);

  const selected = CORPORATES.find((c) => c.id === selectedId) || null;

  const industries = useMemo(() => [...new Set(CORPORATES.map((c) => c.industry))], []);

  const filtered = useMemo(() => {
    let list = CORPORATES;
    if (search) list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    if (filterUtil === "high") list = list.filter((c) => (c.utilized / c.sanctioned) * 100 > 80);
    if (filterUtil === "low") list = list.filter((c) => (c.utilized / c.sanctioned) * 100 < 30);
    if (filterUtil === "delinquent") list = list.filter((c) => c.dpd > 0);
    if (filterIndustry !== "all") list = list.filter((c) => c.industry === filterIndustry);
    return [...list].sort((a, b) => (b.utilized / b.sanctioned) - (a.utilized / a.sanctioned));
  }, [search, filterUtil, filterIndustry]);

  // Portfolio KPIs
  const totalSanctioned = CORPORATES.reduce((s, c) => s + c.sanctioned, 0);
  const totalUtilized = CORPORATES.reduce((s, c) => s + c.utilized, 0);
  const avgUtil = Math.round((totalUtilized / totalSanctioned) * 100);
  const above80 = CORPORATES.filter((c) => (c.utilized / c.sanctioned) * 100 > 80).length;
  const delinquent = CORPORATES.filter((c) => c.dpd > 0).length;

  const handleApprove = (id: string) => {
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
  };
  const handleReject = (id: string) => {
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
  };

  const openAdjust = (c: Corporate, prefillLimit?: number) => {
    setNewLimit(prefillLimit ? String(prefillLimit) : "");
    setReason("");
    setAdjustDialog({ open: true, corporate: c });
  };

  const submitAdjust = () => {
    if (!adjustDialog.corporate || !newLimit || !reason) return;
    const c = adjustDialog.corporate;
    const projectedUtil = Math.round((c.utilized / Number(newLimit)) * 100);
    setConfirmDialog({
      open: true,
      title: "Confirm Limit Change Request",
      message: `Change ${c.name} limit from ${fmtCr(c.sanctioned)} to ${fmtCr(Number(newLimit))}.\nProjected utilization: ${projectedUtil}%.\nThis will be sent for Credit Officer approval.`,
      onConfirm: () => {
        setAdjustDialog({ open: false, corporate: null });
        setConfirmDialog({ open: false, title: "", message: "", onConfirm: () => {} });
      },
    });
  };

  // ── Detail View ─────────────────────────────
  if (selected) {
    const utilPct = Math.round((selected.utilized / selected.sanctioned) * 100);
    const available = selected.sanctioned - selected.utilized;
    return (
      <DashboardLayout title="Limit & Credit Management" subtitle={selected.name}>
        <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)} className="mb-4 gap-1 text-muted-foreground">
          <ChevronLeft className="w-4 h-4" /> Back to Portfolio
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Credit Summary + Risk + Exposure */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Credit Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Sanctioned</span>
                    <p className="text-lg font-bold text-foreground">{fmtCr(selected.sanctioned)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Utilized</span>
                    <p className={cn("text-lg font-bold", utilColor(utilPct))}>{fmtCr(selected.utilized)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Available</span>
                    <p className="text-lg font-bold text-success">{fmtCr(available)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Utilization</span>
                    <p className={cn("text-lg font-bold", utilColor(utilPct))}>{utilPct}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Peak (30d):</span> <span className="font-medium">{selected.peakUtil30d}%</span></div>
                  <div><span className="text-muted-foreground">Average:</span> <span className="font-medium">{selected.avgUtil}%</span></div>
                  <div><span className="text-muted-foreground">Status:</span> {statusBadge(selected.status)}</div>
                </div>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selected.utilizationTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="pct" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Utilization %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Signals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Risk Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={cn("p-3 rounded-lg border", selected.dpd > 0 ? "border-critical/40 bg-critical-muted" : "")}>
                    <span className="text-xs text-muted-foreground">Days Past Due</span>
                    <p className={cn("text-xl font-bold", selected.dpd > 0 ? "text-critical" : "text-foreground")}>{selected.dpd}</p>
                  </div>
                  <div className={cn("p-3 rounded-lg border", selected.missedRepayments > 0 ? "border-critical/40 bg-critical-muted" : "")}>
                    <span className="text-xs text-muted-foreground">Missed Repayments</span>
                    <p className={cn("text-xl font-bold", selected.missedRepayments > 0 ? "text-critical" : "text-foreground")}>{selected.missedRepayments}</p>
                  </div>
                  <div className={cn("p-3 rounded-lg border", selected.anomalyFlags > 0 ? "border-warning/40 bg-warning-muted" : "")}>
                    <span className="text-xs text-muted-foreground">Anomaly Flags</span>
                    <p className={cn("text-xl font-bold", selected.anomalyFlags > 0 ? "text-warning" : "text-foreground")}>{selected.anomalyFlags}</p>
                  </div>
                  <div className={cn("p-3 rounded-lg border", selected.velocityAlerts > 0 ? "border-warning/40 bg-warning-muted" : "")}>
                    <span className="text-xs text-muted-foreground">Velocity Alerts</span>
                    <p className={cn("text-xl font-bold", selected.velocityAlerts > 0 ? "text-warning" : "text-foreground")}>{selected.velocityAlerts}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Risk Score:</span>
                  <span className={cn("text-sm font-bold", selected.riskScore >= 70 ? "text-critical" : selected.riskScore >= 40 ? "text-warning" : "text-success")}>{selected.riskScore}/100</span>
                  {riskBadge(selected.riskStatus)}
                </div>
              </CardContent>
            </Card>

            {/* Exposure Breakdown */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Top 5 Employees by Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="data-table-header">Employee</TableHead>
                      <TableHead className="data-table-header text-right">Spend</TableHead>
                      <TableHead className="data-table-header text-right">% of Utilized</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.topEmployees.map((e, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{e.name}</TableCell>
                        <TableCell className="text-right text-sm">{fmtLakh(e.spent)}</TableCell>
                        <TableCell className="text-right text-sm">{e.pct}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Limit History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4" /> Limit Change History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selected.limitHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No limit changes recorded</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="data-table-header">Date</TableHead>
                        <TableHead className="data-table-header">Old → New</TableHead>
                        <TableHead className="data-table-header">Changed By</TableHead>
                        <TableHead className="data-table-header">Role</TableHead>
                        <TableHead className="data-table-header">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.limitHistory.map((h, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{h.date}</TableCell>
                          <TableCell className="text-sm font-mono">{fmtCr(h.oldLimit)} → {fmtCr(h.newLimit)}</TableCell>
                          <TableCell className="text-sm">{h.changedBy}</TableCell>
                          <TableCell className="text-sm">{h.role}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{h.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Actions Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2" onClick={() => openAdjust(selected)}>
                  <TrendingUp className="w-4 h-4" /> Adjust Limit
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { setOverrideDuration("7"); setReason(""); setOverrideDialog({ open: true, corporate: selected }); }}>
                  <Clock className="w-4 h-4" /> Temporary Override
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 text-critical hover:text-critical" onClick={() => { setRestrictType("freeze"); setReason(""); setRestrictDialog({ open: true, corporate: selected }); }}>
                  <Lock className="w-4 h-4" /> Restrict / Freeze
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" disabled>
                  <UserX className="w-4 h-4" /> Employee Controls
                </Button>
              </CardContent>
            </Card>

            {/* Recommendations for this corporate */}
            {RECOMMENDATIONS.filter((r) => r.corporateId === selected.id).map((r) => (
              <Card key={r.id} className={cn("border-l-4", r.severity === "critical" ? "border-l-critical" : r.severity === "warning" ? "border-l-warning" : "border-l-info")}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className={cn("w-4 h-4 mt-0.5 shrink-0", r.severity === "critical" ? "text-critical" : r.severity === "warning" ? "text-warning" : "text-info")} />
                    <div>
                      <p className="text-sm">{r.message}</p>
                      {r.type === "increase" && (
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => openAdjust(selected, selected.sanctioned * 1.2)}>
                          Apply Recommendation
                        </Button>
                      )}
                      {r.type === "restrict" && (
                        <Button size="sm" variant="outline" className="mt-2 text-critical hover:text-critical" onClick={() => { setRestrictType("freeze"); setReason(r.message); setRestrictDialog({ open: true, corporate: selected }); }}>
                          Apply Restriction
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Adjust Limit Dialog */}
        <Dialog open={adjustDialog.open} onOpenChange={(o) => setAdjustDialog({ open: o, corporate: adjustDialog.corporate })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust Credit Limit</DialogTitle>
              <DialogDescription>{adjustDialog.corporate?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Current Limit:</span> <span className="font-medium">{adjustDialog.corporate ? fmtCr(adjustDialog.corporate.sanctioned) : ""}</span></div>
                <div><span className="text-muted-foreground">Current Util:</span> <span className="font-medium">{adjustDialog.corporate ? Math.round((adjustDialog.corporate.utilized / adjustDialog.corporate.sanctioned) * 100) : 0}%</span></div>
              </div>
              <div>
                <label className="text-sm font-medium">New Limit (₹)</label>
                <Input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} placeholder="e.g. 600000000" />
                {newLimit && adjustDialog.corporate && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    Projected utilization: <span className={cn("font-medium", utilColor(Math.round((adjustDialog.corporate.utilized / Number(newLimit)) * 100)))}>{Math.round((adjustDialog.corporate.utilized / Number(newLimit)) * 100)}%</span>
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Reason (mandatory)</label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Business justification for limit change..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAdjustDialog({ open: false, corporate: null })}>Cancel</Button>
              <Button onClick={submitAdjust} disabled={!newLimit || !reason}>Submit for Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Override Dialog */}
        <Dialog open={overrideDialog.open} onOpenChange={(o) => setOverrideDialog({ open: o, corporate: overrideDialog.corporate })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Temporary Limit Override</DialogTitle>
              <DialogDescription>{overrideDialog.corporate?.name} — auto-reverts after expiry</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Override Duration</label>
                <Select value={overrideDuration} onValueChange={setOverrideDuration}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="15">15 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Override Limit (₹)</label>
                <Input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} placeholder="Temporary limit amount" />
              </div>
              <div>
                <label className="text-sm font-medium">Reason</label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Justification for temporary override..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOverrideDialog({ open: false, corporate: null })}>Cancel</Button>
              <Button onClick={() => { setOverrideDialog({ open: false, corporate: null }); }} disabled={!newLimit || !reason}>Submit Override</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Restrict/Freeze Dialog */}
        <Dialog open={restrictDialog.open} onOpenChange={(o) => setRestrictDialog({ open: o, corporate: restrictDialog.corporate })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restrict / Freeze Corporate</DialogTitle>
              <DialogDescription>{restrictDialog.corporate?.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Restriction Type</label>
                <Select value={restrictType} onValueChange={setRestrictType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freeze">Full Freeze</SelectItem>
                    <SelectItem value="max_txn">Limit Max Transaction Amount</SelectItem>
                    <SelectItem value="mcc_restrict">Restrict Merchant Categories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Reason (mandatory)</label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for restriction..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRestrictDialog({ open: false, corporate: null })}>Cancel</Button>
              <Button variant="destructive" onClick={() => { setRestrictDialog({ open: false, corporate: null }); }} disabled={!reason}>Submit for Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onOpenChange={(o) => setConfirmDialog({ ...confirmDialog, open: o })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{confirmDialog.title}</DialogTitle>
              <DialogDescription className="whitespace-pre-line">{confirmDialog.message}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>Cancel</Button>
              <Button onClick={confirmDialog.onConfirm}>Confirm & Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    );
  }

  // ── Main List View ──────────────────────────
  return (
    <DashboardLayout title="Limit & Credit Management" subtitle="Portfolio credit exposure, limit adjustments & approval workflows">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="kpi-tile">
          <span className="text-kpi-label uppercase text-muted-foreground">Total Sanctioned</span>
          <span className="text-kpi text-foreground">{fmtCr(totalSanctioned)}</span>
        </div>
        <div className="kpi-tile">
          <span className="text-kpi-label uppercase text-muted-foreground">Total Utilized</span>
          <span className="text-kpi text-foreground">{fmtCr(totalUtilized)}</span>
          <Progress value={avgUtil} className={cn("h-2 mt-1", progressColor(avgUtil))} />
        </div>
        <div className="kpi-tile">
          <span className="text-kpi-label uppercase text-muted-foreground">Available Headroom</span>
          <span className="text-kpi text-success">{fmtCr(totalSanctioned - totalUtilized)}</span>
        </div>
        <div className="kpi-tile">
          <span className="text-kpi-label uppercase text-muted-foreground">Avg Utilization</span>
          <span className={cn("text-kpi", utilColor(avgUtil))}>{avgUtil}%</span>
        </div>
        <div className="kpi-tile border-warning/30">
          <span className="text-kpi-label uppercase text-muted-foreground">Above 80% Util</span>
          <span className="text-kpi text-warning">{above80}</span>
          <span className="text-xs text-muted-foreground">corporates</span>
        </div>
        <div className={cn("kpi-tile", delinquent > 0 && "border-critical/30")}>
          <span className="text-kpi-label uppercase text-muted-foreground">Delinquent</span>
          <span className={cn("text-kpi", delinquent > 0 ? "text-critical" : "text-foreground")}>{delinquent}</span>
          <span className="text-xs text-muted-foreground">corporates</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="corporates">Corporate Limits</TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-1">
            Recommendations <Badge variant="secondary" className="ml-1 text-xs">{RECOMMENDATIONS.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1">
            Pending Approvals <Badge variant="destructive" className="ml-1 text-xs">{pendingApprovals.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Corporate Limits Tab */}
        <TabsContent value="corporates" className="mt-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search corporate..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterUtil} onValueChange={setFilterUtil}>
              <SelectTrigger className="w-[160px]"><Filter className="w-3 h-3 mr-1" /><SelectValue placeholder="Utilization" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Utilization</SelectItem>
                <SelectItem value="high">High (&gt;80%)</SelectItem>
                <SelectItem value="low">Low (&lt;30%)</SelectItem>
                <SelectItem value="delinquent">Delinquent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterIndustry} onValueChange={setFilterIndustry}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((ind) => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="data-table-header">Corporate</TableHead>
                    <TableHead className="data-table-header text-right">Sanctioned</TableHead>
                    <TableHead className="data-table-header text-right">Utilized</TableHead>
                    <TableHead className="data-table-header text-right">Available</TableHead>
                    <TableHead className="data-table-header text-right">Util %</TableHead>
                    <TableHead className="data-table-header">Risk</TableHead>
                    <TableHead className="data-table-header">Last Change</TableHead>
                    <TableHead className="data-table-header text-right">Recommended</TableHead>
                    <TableHead className="data-table-header">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const utilPct = Math.round((c.utilized / c.sanctioned) * 100);
                    return (
                      <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedId(c.id)}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.industry}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm font-mono">{fmtCr(c.sanctioned)}</TableCell>
                        <TableCell className="text-right text-sm font-mono">{fmtCr(c.utilized)}</TableCell>
                        <TableCell className="text-right text-sm font-mono text-success">{fmtCr(c.sanctioned - c.utilized)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={utilPct} className={cn("h-1.5 w-16", progressColor(utilPct))} />
                            <span className={cn("text-sm font-medium w-10 text-right", utilColor(utilPct))}>{utilPct}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{riskBadge(c.riskStatus)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{c.lastLimitChange}</TableCell>
                        <TableCell className="text-right text-sm font-mono">{c.recommendedLimit ? fmtCr(c.recommendedLimit) : "—"}</TableCell>
                        <TableCell>{statusBadge(c.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-4 space-y-3">
          {RECOMMENDATIONS.map((r) => (
            <Card key={r.id} className={cn("border-l-4 cursor-pointer hover:shadow-md transition-shadow", r.severity === "critical" ? "border-l-critical" : r.severity === "warning" ? "border-l-warning" : "border-l-info")} onClick={() => setSelectedId(r.corporateId)}>
              <CardContent className="py-4 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Lightbulb className={cn("w-5 h-5 mt-0.5 shrink-0", r.severity === "critical" ? "text-critical" : r.severity === "warning" ? "text-warning" : "text-info")} />
                  <div>
                    <p className="text-sm font-medium">{r.corporateName}</p>
                    <p className="text-sm text-muted-foreground">{r.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Badge variant={r.severity === "critical" ? "destructive" : "secondary"} className="capitalize">{r.type}</Badge>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedId(r.corporateId); }}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Pending Approvals Tab */}
        <TabsContent value="approvals" className="mt-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">All approval requests have been processed</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((pa) => (
                <Card key={pa.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-sm">{pa.corporateName}</p>
                          <Badge variant={pa.type === "freeze" ? "destructive" : "secondary"} className="capitalize">{pa.type === "override" ? "Temp Override" : pa.type}</Badge>
                          {riskBadge(pa.riskStatus)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-2">
                          <div><span className="text-muted-foreground">Current:</span> <span className="font-mono">{fmtCr(pa.currentLimit)}</span></div>
                          <div><span className="text-muted-foreground">Requested:</span> <span className="font-mono font-medium">{fmtCr(pa.requestedLimit)}</span></div>
                          <div><span className="text-muted-foreground">Utilization:</span> <span className={cn("font-medium", utilColor(pa.utilization))}>{pa.utilization}%</span></div>
                          <div><span className="text-muted-foreground">Date:</span> {pa.date}</div>
                        </div>
                        <p className="text-sm text-muted-foreground"><span className="text-foreground font-medium">{pa.requestedBy}</span> ({pa.role}): {pa.reason}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="sm" onClick={() => handleApprove(pa.id)} className="gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 text-critical hover:text-critical" onClick={() => handleReject(pa.id)}>
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
