import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  { id: "1", name: "Indo Amines Ltd.", industry: "Chemicals / Pharma", rm: "Priya Sharma", sanctioned: "₹12Cr", utilized: "₹11.2Cr", utilizationPct: 93, healthScore: 62, status: "Active", lastTxn: "2 min ago" },
  { id: "2", name: "Fermenta Biotech Ltd.", industry: "Chemicals / Pharma", rm: "Amit Kumar", sanctioned: "₹10Cr", utilized: "₹6.5Cr", utilizationPct: 65, healthScore: 88, status: "Active", lastTxn: "15 min ago" },
  { id: "3", name: "Bajaj Healthcare Ltd.", industry: "Chemicals / Pharma", rm: "Neha Gupta", sanctioned: "₹8Cr", utilized: "₹5.2Cr", utilizationPct: 65, healthScore: 91, status: "Active", lastTxn: "1 hr ago" },
  { id: "4", name: "Trident Lifeline Ltd.", industry: "Chemicals / Pharma", rm: "Rajiv Menon", sanctioned: "₹6Cr", utilized: "₹3.8Cr", utilizationPct: 63, healthScore: 79, status: "Active", lastTxn: "3 hr ago" },
  { id: "5", name: "Aayush Wellness Ltd.", industry: "Chemicals / Pharma", rm: "Priya Sharma", sanctioned: "₹5Cr", utilized: "₹1.2Cr", utilizationPct: 24, healthScore: 85, status: "Active", lastTxn: "45 min ago" },
  { id: "6", name: "Innovana Thinklabs Ltd.", industry: "Tech / IT / Digital", rm: "Amit Kumar", sanctioned: "₹8Cr", utilized: "₹7.1Cr", utilizationPct: 89, healthScore: 58, status: "Under Review", lastTxn: "5 min ago" },
  { id: "7", name: "Ksolves India Ltd.", industry: "Tech / IT / Digital", rm: "Neha Gupta", sanctioned: "₹6Cr", utilized: "₹4.3Cr", utilizationPct: 72, healthScore: 83, status: "Active", lastTxn: "30 min ago" },
  { id: "8", name: "Chatterbox Technologies Ltd.", industry: "Tech / IT / Digital", rm: "Rajiv Menon", sanctioned: "₹4Cr", utilized: "₹2.1Cr", utilizationPct: 53, healthScore: 76, status: "Active", lastTxn: "2 hr ago" },
  { id: "9", name: "Optivalue Tek Consulting Ltd.", industry: "Tech / IT / Digital", rm: "Priya Sharma", sanctioned: "₹3Cr", utilized: "₹1.4Cr", utilizationPct: 47, healthScore: 81, status: "Active", lastTxn: "1 hr ago" },
  { id: "10", name: "V2 Retail Ltd.", industry: "Consumer / Retail", rm: "Amit Kumar", sanctioned: "₹15Cr", utilized: "₹12.6Cr", utilizationPct: 84, healthScore: 71, status: "Active", lastTxn: "10 min ago" },
  { id: "11", name: "Thangamayil Jewellery Ltd.", industry: "Consumer / Retail", rm: "Neha Gupta", sanctioned: "₹20Cr", utilized: "₹11Cr", utilizationPct: 55, healthScore: 92, status: "Active", lastTxn: "20 min ago" },
  { id: "12", name: "Cupid Ltd.", industry: "Consumer / Retail", rm: "Rajiv Menon", sanctioned: "₹4Cr", utilized: "₹2.8Cr", utilizationPct: 70, healthScore: 77, status: "Active", lastTxn: "4 hr ago" },
  { id: "13", name: "Connplex Cinemas Ltd.", industry: "Industrial / Manufacturing", rm: "Priya Sharma", sanctioned: "₹7Cr", utilized: "₹4.9Cr", utilizationPct: 70, healthScore: 74, status: "Active", lastTxn: "1 hr ago" },
  { id: "14", name: "Chemkart India Ltd.", industry: "Industrial / Manufacturing", rm: "Amit Kumar", sanctioned: "₹5Cr", utilized: "₹3.2Cr", utilizationPct: 64, healthScore: 80, status: "Active", lastTxn: "2 hr ago" },
  { id: "15", name: "Bhadora Industries Ltd.", industry: "Industrial / Manufacturing", rm: "Neha Gupta", sanctioned: "₹9Cr", utilized: "₹2.7Cr", utilizationPct: 30, healthScore: 89, status: "Active", lastTxn: "5 hr ago" },
  { id: "16", name: "Hardwyn India Ltd.", industry: "Industrial / Manufacturing", rm: "Rajiv Menon", sanctioned: "₹5Cr", utilized: "₹2.1Cr", utilizationPct: 42, healthScore: 82, status: "Active", lastTxn: "3 hr ago" },
  { id: "17", name: "Globus Power Generation Ltd.", industry: "Energy / Infrastructure", rm: "Priya Sharma", sanctioned: "₹20Cr", utilized: "₹15.4Cr", utilizationPct: 77, healthScore: 68, status: "Active", lastTxn: "8 min ago" },
  { id: "18", name: "India Power Corporation Ltd.", industry: "Energy / Infrastructure", rm: "Amit Kumar", sanctioned: "₹25Cr", utilized: "₹14Cr", utilizationPct: 56, healthScore: 90, status: "Active", lastTxn: "25 min ago" },
  { id: "19", name: "Dhanlaxmi Bank Ltd.", industry: "Financial / Misc", rm: "Neha Gupta", sanctioned: "₹25Cr", utilized: "₹14Cr", utilizationPct: 56, healthScore: 94, status: "Active", lastTxn: "12 min ago" },
  { id: "20", name: "Crest Ventures Ltd.", industry: "Financial / Misc", rm: "Rajiv Menon", sanctioned: "₹10Cr", utilized: "₹3.2Cr", utilizationPct: 32, healthScore: 58, status: "Frozen", lastTxn: "14 days ago" },
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
    <DashboardLayout title="Corporate Client Management" subtitle={`${corporates.length} corporates across portfolio`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search by name, CIN, RM..." className="pl-8 h-9 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"><Filter className="w-3.5 h-3.5" /> Filters</Button>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"><Download className="w-3.5 h-3.5" /> Export</Button>
        <Button size="sm" className="h-9 text-xs gap-1.5 ml-auto"><Plus className="w-3.5 h-3.5" /> Onboard Corporate</Button>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 mb-4">
        {[`All (${corporates.length})`, "Utilization > 80%", "NPA Warning", "KYC Expiring"].map((f, i) => (
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
