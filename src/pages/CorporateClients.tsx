import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, Download, Plus, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CorporateProfile } from "@/components/corporate/CorporateProfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Corporate {
  id: string;
  name: string;
  industry: string;
  rm: string;
  sanctioned: string;
  sanctionedNum: number;
  utilized: string;
  utilizationPct: number;
  healthScore: number;
  status: "Active" | "Frozen" | "Under Review";
  lastTxn: string;
  lastTxnMins: number;
  kycExpiryDays: number;
  npaWarning: boolean;
}

const seed: Corporate[] = [
  { id: "1", name: "Indo Amines Ltd.", industry: "Chemicals / Pharma", rm: "Priya Sharma", sanctioned: "₹12Cr", sanctionedNum: 12, utilized: "₹11.2Cr", utilizationPct: 93, healthScore: 62, status: "Active", lastTxn: "2 min ago", lastTxnMins: 2, kycExpiryDays: 120, npaWarning: true },
  { id: "2", name: "Fermenta Biotech Ltd.", industry: "Chemicals / Pharma", rm: "Amit Kumar", sanctioned: "₹10Cr", sanctionedNum: 10, utilized: "₹6.5Cr", utilizationPct: 65, healthScore: 88, status: "Active", lastTxn: "15 min ago", lastTxnMins: 15, kycExpiryDays: 200, npaWarning: false },
  { id: "3", name: "Bajaj Healthcare Ltd.", industry: "Chemicals / Pharma", rm: "Neha Gupta", sanctioned: "₹8Cr", sanctionedNum: 8, utilized: "₹5.2Cr", utilizationPct: 65, healthScore: 91, status: "Active", lastTxn: "1 hr ago", lastTxnMins: 60, kycExpiryDays: 25, npaWarning: false },
  { id: "4", name: "Trident Lifeline Ltd.", industry: "Chemicals / Pharma", rm: "Rajiv Menon", sanctioned: "₹6Cr", sanctionedNum: 6, utilized: "₹3.8Cr", utilizationPct: 63, healthScore: 79, status: "Active", lastTxn: "3 hr ago", lastTxnMins: 180, kycExpiryDays: 95, npaWarning: false },
  { id: "5", name: "Aayush Wellness Ltd.", industry: "Chemicals / Pharma", rm: "Priya Sharma", sanctioned: "₹5Cr", sanctionedNum: 5, utilized: "₹1.2Cr", utilizationPct: 24, healthScore: 85, status: "Active", lastTxn: "45 min ago", lastTxnMins: 45, kycExpiryDays: 150, npaWarning: false },
  { id: "6", name: "Innovana Thinklabs Ltd.", industry: "Tech / IT / Digital", rm: "Amit Kumar", sanctioned: "₹8Cr", sanctionedNum: 8, utilized: "₹7.1Cr", utilizationPct: 89, healthScore: 58, status: "Under Review", lastTxn: "5 min ago", lastTxnMins: 5, kycExpiryDays: 18, npaWarning: true },
  { id: "7", name: "Ksolves India Ltd.", industry: "Tech / IT / Digital", rm: "Neha Gupta", sanctioned: "₹6Cr", sanctionedNum: 6, utilized: "₹4.3Cr", utilizationPct: 72, healthScore: 83, status: "Active", lastTxn: "30 min ago", lastTxnMins: 30, kycExpiryDays: 220, npaWarning: false },
  { id: "8", name: "Chatterbox Technologies Ltd.", industry: "Tech / IT / Digital", rm: "Rajiv Menon", sanctioned: "₹4Cr", sanctionedNum: 4, utilized: "₹2.1Cr", utilizationPct: 53, healthScore: 76, status: "Active", lastTxn: "2 hr ago", lastTxnMins: 120, kycExpiryDays: 50, npaWarning: false },
  { id: "9", name: "Optivalue Tek Consulting Ltd.", industry: "Tech / IT / Digital", rm: "Priya Sharma", sanctioned: "₹3Cr", sanctionedNum: 3, utilized: "₹1.4Cr", utilizationPct: 47, healthScore: 81, status: "Active", lastTxn: "1 hr ago", lastTxnMins: 60, kycExpiryDays: 28, npaWarning: false },
  { id: "10", name: "V2 Retail Ltd.", industry: "Consumer / Retail", rm: "Amit Kumar", sanctioned: "₹15Cr", sanctionedNum: 15, utilized: "₹12.6Cr", utilizationPct: 84, healthScore: 71, status: "Active", lastTxn: "10 min ago", lastTxnMins: 10, kycExpiryDays: 300, npaWarning: false },
  { id: "11", name: "Thangamayil Jewellery Ltd.", industry: "Consumer / Retail", rm: "Neha Gupta", sanctioned: "₹20Cr", sanctionedNum: 20, utilized: "₹11Cr", utilizationPct: 55, healthScore: 92, status: "Active", lastTxn: "20 min ago", lastTxnMins: 20, kycExpiryDays: 180, npaWarning: false },
  { id: "12", name: "Cupid Ltd.", industry: "Consumer / Retail", rm: "Rajiv Menon", sanctioned: "₹4Cr", sanctionedNum: 4, utilized: "₹2.8Cr", utilizationPct: 70, healthScore: 77, status: "Active", lastTxn: "4 hr ago", lastTxnMins: 240, kycExpiryDays: 12, npaWarning: false },
  { id: "13", name: "Connplex Cinemas Ltd.", industry: "Industrial / Manufacturing", rm: "Priya Sharma", sanctioned: "₹7Cr", sanctionedNum: 7, utilized: "₹4.9Cr", utilizationPct: 70, healthScore: 74, status: "Active", lastTxn: "1 hr ago", lastTxnMins: 60, kycExpiryDays: 80, npaWarning: false },
  { id: "14", name: "Chemkart India Ltd.", industry: "Industrial / Manufacturing", rm: "Amit Kumar", sanctioned: "₹5Cr", sanctionedNum: 5, utilized: "₹3.2Cr", utilizationPct: 64, healthScore: 80, status: "Active", lastTxn: "2 hr ago", lastTxnMins: 120, kycExpiryDays: 200, npaWarning: false },
  { id: "15", name: "Bhadora Industries Ltd.", industry: "Industrial / Manufacturing", rm: "Neha Gupta", sanctioned: "₹9Cr", sanctionedNum: 9, utilized: "₹2.7Cr", utilizationPct: 30, healthScore: 89, status: "Active", lastTxn: "5 hr ago", lastTxnMins: 300, kycExpiryDays: 240, npaWarning: false },
  { id: "16", name: "Hardwyn India Ltd.", industry: "Industrial / Manufacturing", rm: "Rajiv Menon", sanctioned: "₹5Cr", sanctionedNum: 5, utilized: "₹2.1Cr", utilizationPct: 42, healthScore: 82, status: "Active", lastTxn: "3 hr ago", lastTxnMins: 180, kycExpiryDays: 70, npaWarning: false },
  { id: "17", name: "Globus Power Generation Ltd.", industry: "Energy / Infrastructure", rm: "Priya Sharma", sanctioned: "₹20Cr", sanctionedNum: 20, utilized: "₹15.4Cr", utilizationPct: 77, healthScore: 68, status: "Active", lastTxn: "8 min ago", lastTxnMins: 8, kycExpiryDays: 100, npaWarning: false },
  { id: "18", name: "India Power Corporation Ltd.", industry: "Energy / Infrastructure", rm: "Amit Kumar", sanctioned: "₹25Cr", sanctionedNum: 25, utilized: "₹14Cr", utilizationPct: 56, healthScore: 90, status: "Active", lastTxn: "25 min ago", lastTxnMins: 25, kycExpiryDays: 320, npaWarning: false },
  { id: "19", name: "Dhanlaxmi Bank Ltd.", industry: "Financial / Misc", rm: "Neha Gupta", sanctioned: "₹25Cr", sanctionedNum: 25, utilized: "₹14Cr", utilizationPct: 56, healthScore: 94, status: "Active", lastTxn: "12 min ago", lastTxnMins: 12, kycExpiryDays: 270, npaWarning: false },
  { id: "20", name: "Crest Ventures Ltd.", industry: "Financial / Misc", rm: "Rajiv Menon", sanctioned: "₹10Cr", sanctionedNum: 10, utilized: "₹3.2Cr", utilizationPct: 32, healthScore: 58, status: "Frozen", lastTxn: "14 days ago", lastTxnMins: 20160, kycExpiryDays: 8, npaWarning: true },
];

const INDUSTRIES = [
  "All",
  "Chemicals / Pharma",
  "Tech / IT / Digital",
  "Consumer / Retail",
  "Industrial / Manufacturing",
  "Energy / Infrastructure",
  "Financial / Misc",
];
const RMS = ["All", "Priya Sharma", "Amit Kumar", "Neha Gupta", "Rajiv Menon"];
const STATUSES = ["All", "Active", "Under Review", "Frozen"] as const;

type QuickFilter = "all" | "high-util" | "npa" | "kyc";
type SortKey = "name" | "industry" | "rm" | "sanctionedNum" | "utilizationPct" | "healthScore" | "status" | "lastTxnMins";

function healthColor(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-critical";
}

function statusBadge(status: Corporate["status"]) {
  switch (status) {
    case "Active": return "status-badge-success";
    case "Frozen": return "status-badge-critical";
    case "Under Review": return "status-badge-warning";
  }
}

export default function CorporateClients() {
  const { toast } = useToast();
  const [list, setList] = useState<Corporate[]>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [quick, setQuick] = useState<QuickFilter>("all");

  // advanced filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [fIndustry, setFIndustry] = useState("All");
  const [fRm, setFRm] = useState("All");
  const [fStatus, setFStatus] = useState<(typeof STATUSES)[number]>("All");
  const [fMinUtil, setFMinUtil] = useState("");
  const [fMaxUtil, setFMaxUtil] = useState("");

  // onboard
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [oName, setOName] = useState("");
  const [oIndustry, setOIndustry] = useState("Chemicals / Pharma");
  const [oRm, setORm] = useState("Priya Sharma");
  const [oSanctioned, setOSanctioned] = useState("");

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("utilizationPct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let rows = list;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (c) => c.name.toLowerCase().includes(q) || c.rm.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q),
      );
    }
    if (quick === "high-util") rows = rows.filter((c) => c.utilizationPct > 80);
    if (quick === "npa") rows = rows.filter((c) => c.npaWarning);
    if (quick === "kyc") rows = rows.filter((c) => c.kycExpiryDays <= 30);

    if (fIndustry !== "All") rows = rows.filter((c) => c.industry === fIndustry);
    if (fRm !== "All") rows = rows.filter((c) => c.rm === fRm);
    if (fStatus !== "All") rows = rows.filter((c) => c.status === fStatus);
    const minU = parseFloat(fMinUtil);
    const maxU = parseFloat(fMaxUtil);
    if (!Number.isNaN(minU)) rows = rows.filter((c) => c.utilizationPct >= minU);
    if (!Number.isNaN(maxU)) rows = rows.filter((c) => c.utilizationPct <= maxU);

    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return sorted;
  }, [list, search, quick, fIndustry, fRm, fStatus, fMinUtil, fMaxUtil, sortKey, sortDir]);

  const counts = useMemo(
    () => ({
      all: list.length,
      highUtil: list.filter((c) => c.utilizationPct > 80).length,
      npa: list.filter((c) => c.npaWarning).length,
      kyc: list.filter((c) => c.kycExpiryDays <= 30).length,
    }),
    [list],
  );

  const activeFilterCount =
    (fIndustry !== "All" ? 1 : 0) + (fRm !== "All" ? 1 : 0) + (fStatus !== "All" ? 1 : 0) + (fMinUtil ? 1 : 0) + (fMaxUtil ? 1 : 0);

  const selected = list.find((c) => c.id === selectedId);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  };

  const sortIcon = (k: SortKey) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />;
  };

  const exportCsv = () => {
    const headers = ["Name", "Industry", "RM", "Sanctioned", "Utilized", "Utilization %", "Health", "Status", "Last Txn"];
    const rows = filtered.map((c) =>
      [c.name, c.industry, c.rm, c.sanctioned, c.utilized, c.utilizationPct, c.healthScore, c.status, c.lastTxn]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `corporates-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export complete", description: `${filtered.length} corporates exported as CSV.` });
  };

  const resetFilters = () => {
    setFIndustry("All");
    setFRm("All");
    setFStatus("All");
    setFMinUtil("");
    setFMaxUtil("");
  };

  const submitOnboard = () => {
    if (!oName.trim() || !oSanctioned.trim()) {
      toast({ title: "Missing fields", description: "Corporate name and sanctioned limit are required.", variant: "destructive" });
      return;
    }
    const num = parseFloat(oSanctioned);
    if (Number.isNaN(num) || num <= 0) {
      toast({ title: "Invalid limit", description: "Enter sanctioned amount in ₹Cr (number).", variant: "destructive" });
      return;
    }
    const newC: Corporate = {
      id: String(Date.now()),
      name: oName.trim(),
      industry: oIndustry,
      rm: oRm,
      sanctioned: `₹${num}Cr`,
      sanctionedNum: num,
      utilized: "₹0Cr",
      utilizationPct: 0,
      healthScore: 85,
      status: "Under Review",
      lastTxn: "—",
      lastTxnMins: 99999,
      kycExpiryDays: 365,
      npaWarning: false,
    };
    setList((prev) => [newC, ...prev]);
    setOnboardOpen(false);
    setOName("");
    setOSanctioned("");
    toast({ title: "Corporate onboarded", description: `${newC.name} added · status Under Review.` });
  };

  if (selected) {
    return (
      <DashboardLayout title="Corporate 360°" subtitle={selected.name}>
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => setSelectedId(null)}>
          ← Back to Corporates
        </Button>
        <CorporateProfile corporate={selected} />
      </DashboardLayout>
    );
  }

  const quickFilters: { key: QuickFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "high-util", label: "Utilization > 80%", count: counts.highUtil },
    { key: "npa", label: "NPA Warning", count: counts.npa },
    { key: "kyc", label: "KYC Expiring", count: counts.kyc },
  ];

  return (
    <DashboardLayout title="Corporate Client Management" subtitle={`${filtered.length} of ${list.length} corporates`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, industry, RM..."
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 relative" onClick={() => setFiltersOpen(true)}>
          <Filter className="w-3.5 h-3.5" /> Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5" onClick={exportCsv}>
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
        <Button size="sm" className="h-9 text-xs gap-1.5 ml-auto" onClick={() => setOnboardOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Onboard Corporate
        </Button>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setQuick(f.key)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              quick === f.key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent",
            )}
          >
            {f.label} ({f.count})
          </button>
        ))}
        {(activeFilterCount > 0 || quick !== "all" || search) && (
          <button
            onClick={() => {
              setQuick("all");
              setSearch("");
              resetFilters();
            }}
            className="px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {([
                  { l: "Corporate Name", k: "name" as SortKey },
                  { l: "Industry", k: "industry" as SortKey },
                  { l: "Assigned RM", k: "rm" as SortKey },
                  { l: "Sanctioned", k: "sanctionedNum" as SortKey },
                  { l: "Utilized", k: null },
                  { l: "Util %", k: "utilizationPct" as SortKey },
                  { l: "Health", k: "healthScore" as SortKey },
                  { l: "Status", k: "status" as SortKey },
                  { l: "Last Txn", k: "lastTxnMins" as SortKey },
                  { l: "", k: null },
                ] as { l: string; k: SortKey | null }[]).map((h) => (
                  <th key={h.l || "act"} className="data-table-header text-left px-4 py-3 whitespace-nowrap">
                    {h.k ? (
                      <button
                        onClick={() => toggleSort(h.k!)}
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        {h.l} {sortIcon(h.k)}
                      </button>
                    ) : (
                      <span>{h.l}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No corporates match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedId(c.id)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.industry}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.rm}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{c.sanctioned}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{c.utilized}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", c.utilizationPct > 85 ? "bg-critical" : c.utilizationPct > 70 ? "bg-warning" : "bg-primary")}
                            style={{ width: `${c.utilizationPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{c.utilizationPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-sm font-bold", healthColor(c.healthScore))}>{c.healthScore}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={statusBadge(c.status)}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{c.lastTxn}</td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters dialog */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>Narrow down the corporate list by specific attributes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Industry</Label>
              <Select value={fIndustry} onValueChange={setFIndustry}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Relationship Manager</Label>
              <Select value={fRm} onValueChange={setFRm}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RMS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={fStatus} onValueChange={(v) => setFStatus(v as typeof fStatus)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Min Util %</Label>
                <Input type="number" min="0" max="100" value={fMinUtil} onChange={(e) => setFMinUtil(e.target.value)} className="h-9 text-sm" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Max Util %</Label>
                <Input type="number" min="0" max="100" value={fMaxUtil} onChange={(e) => setFMaxUtil(e.target.value)} className="h-9 text-sm" placeholder="100" />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={resetFilters}>Reset</Button>
            <Button onClick={() => setFiltersOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Onboard dialog */}
      <Dialog open={onboardOpen} onOpenChange={setOnboardOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Onboard New Corporate</DialogTitle>
            <DialogDescription>The corporate will be added with status “Under Review” for KYC verification.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Corporate Name *</Label>
              <Input value={oName} onChange={(e) => setOName(e.target.value)} className="h-9 text-sm" placeholder="Acme Industries Ltd." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Industry</Label>
              <Select value={oIndustry} onValueChange={setOIndustry}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.filter((i) => i !== "All").map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Assigned RM</Label>
              <Select value={oRm} onValueChange={setORm}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RMS.filter((r) => r !== "All").map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sanctioned Limit (₹ in Cr) *</Label>
              <Input type="number" min="0" step="0.5" value={oSanctioned} onChange={(e) => setOSanctioned(e.target.value)} className="h-9 text-sm" placeholder="10" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOnboardOpen(false)}>Cancel</Button>
            <Button onClick={submitOnboard}>Onboard Corporate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
