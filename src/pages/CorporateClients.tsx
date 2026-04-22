import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Plus, ChevronRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CorporateProfile } from "@/components/corporate/CorporateProfile";

interface Corporate {
  id: string;
  name: string;
  industry: string;
  rm: string;
  sanctioned: string;
  utilized: string;
  utilizationPct: number;
  healthScore: number;
  status: "Active" | "Frozen" | "Under Review";
  lastTxn: string;
}

const corporates: Corporate[] = [
  { id: "1", name: "Tata Consultancy Services", industry: "IT Services", rm: "Priya Sharma", sanctioned: "₹50Cr", utilized: "₹46Cr", utilizationPct: 92, healthScore: 88, status: "Active", lastTxn: "2 min ago" },
  { id: "2", name: "Infosys Limited", industry: "IT Services", rm: "Amit Kumar", sanctioned: "₹40Cr", utilized: "₹34.8Cr", utilizationPct: 87, healthScore: 91, status: "Active", lastTxn: "15 min ago" },
  { id: "3", name: "Wipro Technologies", industry: "IT Services", rm: "Neha Gupta", sanctioned: "₹35Cr", utilized: "₹28.3Cr", utilizationPct: 81, healthScore: 42, status: "Under Review", lastTxn: "3 hr ago" },
  { id: "4", name: "HCL Technologies", industry: "IT Services", rm: "Rajiv Menon", sanctioned: "₹30Cr", utilized: "₹22.2Cr", utilizationPct: 74, healthScore: 76, status: "Active", lastTxn: "1 hr ago" },
  { id: "5", name: "Tech Mahindra", industry: "IT Services", rm: "Priya Sharma", sanctioned: "₹25Cr", utilized: "₹17Cr", utilizationPct: 68, healthScore: 83, status: "Active", lastTxn: "45 min ago" },
  { id: "6", name: "Larsen & Toubro", industry: "Engineering", rm: "Amit Kumar", sanctioned: "₹60Cr", utilized: "₹37.8Cr", utilizationPct: 63, healthScore: 94, status: "Active", lastTxn: "30 min ago" },
  { id: "7", name: "Mindtree Ltd", industry: "IT Services", rm: "Neha Gupta", sanctioned: "₹15Cr", utilized: "₹8.5Cr", utilizationPct: 57, healthScore: 71, status: "Active", lastTxn: "2 hr ago" },
  { id: "8", name: "Reliance Industries", industry: "Conglomerate", rm: "Rajiv Menon", sanctioned: "₹100Cr", utilized: "₹48Cr", utilizationPct: 48, healthScore: 96, status: "Active", lastTxn: "5 min ago" },
  { id: "9", name: "Bajaj Finance", industry: "NBFC", rm: "Priya Sharma", sanctioned: "₹20Cr", utilized: "₹3.2Cr", utilizationPct: 16, healthScore: 58, status: "Frozen", lastTxn: "14 days ago" },
];

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = corporates.find((c) => c.id === selectedId);

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

  return (
    <DashboardLayout title="Corporate Client Management" subtitle="147 active corporates across portfolio">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search by name, CIN, RM..." className="pl-8 h-9 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Filters
        </Button>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
        <Button size="sm" className="h-9 text-xs gap-1.5 ml-auto">
          <Plus className="w-3.5 h-3.5" /> Onboard Corporate
        </Button>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 mb-4">
        {["All (147)", "Utilization > 80%", "NPA Warning", "KYC Expiring"].map((f, i) => (
          <button
            key={f}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Corporate Name", "Industry", "Assigned RM", "Sanctioned", "Utilized", "Util %", "Health", "Status", "Last Txn", ""].map((h) => (
                  <th key={h} className="data-table-header text-left px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{h} {h && <ArrowUpDown className="w-3 h-3 opacity-30" />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {corporates.map((c) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
