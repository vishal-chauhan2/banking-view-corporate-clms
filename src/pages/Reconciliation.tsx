import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, Filter, Download, Upload, Eye, ArrowUpDown, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface ReconItem {
  txnId: string;
  corporate: string;
  employeeVpa: string;
  merchantVpa: string;
  amount: string;
  mcc: string;
  time: string;
  npciStatus: string;
  cbsStatus: string;
  matchStatus: "Matched" | "Exception" | "Disputed" | "Pending";
  reason?: string;
  slaBreaching?: boolean;
}

const reconItems: ReconItem[] = [
  { txnId: "UPI248103847201", corporate: "TCS", employeeVpa: "emp_4821@upi", merchantVpa: "flipkart@hdfcupi", amount: "₹12,450", mcc: "5411", time: "09:14:22", npciStatus: "SUCCESS", cbsStatus: "Posted", matchStatus: "Matched" },
  { txnId: "UPI248103847202", corporate: "Infosys", employeeVpa: "emp_1190@upi", merchantVpa: "swiggy@axisbank", amount: "₹2,340", mcc: "5812", time: "09:18:45", npciStatus: "SUCCESS", cbsStatus: "Posted", matchStatus: "Matched" },
  { txnId: "UPI248103847203", corporate: "Wipro", employeeVpa: "emp_0567@upi", merchantVpa: "irctc@sbi", amount: "₹8,920", mcc: "4112", time: "09:22:11", npciStatus: "SUCCESS", cbsStatus: "Pending", matchStatus: "Exception", reason: "CBS posting delayed", slaBreaching: true },
  { txnId: "UPI248103847204", corporate: "HCL", employeeVpa: "emp_3341@upi", merchantVpa: "amazon@icici", amount: "₹34,500", mcc: "5999", time: "09:25:33", npciStatus: "SUCCESS", cbsStatus: "Mismatch", matchStatus: "Exception", reason: "Amount mismatch ₹34,500 vs ₹34,050" },
  { txnId: "UPI248103847205", corporate: "TCS", employeeVpa: "emp_2234@upi", merchantVpa: "unknown@upi", amount: "₹5,600", mcc: "7995", time: "09:31:07", npciStatus: "DEEMED", cbsStatus: "Not Found", matchStatus: "Disputed", reason: "Merchant VPA unregistered" },
  { txnId: "UPI248103847206", corporate: "L&T", employeeVpa: "emp_8812@upi", merchantVpa: "hpcl@sbi", amount: "₹3,200", mcc: "5541", time: "09:35:18", npciStatus: "SUCCESS", cbsStatus: "Pending", matchStatus: "Pending" },
  { txnId: "UPI248103847207", corporate: "Mindtree", employeeVpa: "emp_1002@upi", merchantVpa: "ola@yesbank", amount: "₹1,850", mcc: "4121", time: "09:38:44", npciStatus: "SUCCESS", cbsStatus: "Posted", matchStatus: "Matched" },
];

function matchBadge(status: ReconItem["matchStatus"]) {
  switch (status) {
    case "Matched": return "status-badge-success";
    case "Exception": return "status-badge-warning";
    case "Disputed": return "status-badge-critical";
    case "Pending": return "status-badge-info";
  }
}

export default function Reconciliation() {
  return (
    <DashboardLayout title="Reconciliation & Settlements" subtitle="NPCI Settlement Cycle — 22 Apr 2026">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KpiTile label="Auto-Matched" value="12,340" subtitle="99.5% match rate" icon={<CheckCircle2 className="w-4 h-4 text-success" />} />
        <KpiTile label="Manual Match" value="60" subtitle="Resolved today" icon={<Eye className="w-4 h-4" />} />
        <KpiTile label="Exceptions" value="48" subtitle="SLA: 2h 15m remaining" alert icon={<AlertTriangle className="w-4 h-4" />} />
        <KpiTile label="Disputed" value="12" subtitle="₹4.2L total value" alert icon={<AlertTriangle className="w-4 h-4" />} />
        <KpiTile label="CBS Posted" value="12,280" subtitle="₹18.2Cr settled" icon={<CheckCircle2 className="w-4 h-4 text-success" />} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search by Txn ID, VPA, amount..." className="pl-8 h-9 text-sm" />
        </div>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"><Filter className="w-3.5 h-3.5" /> Filters</Button>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"><Upload className="w-3.5 h-3.5" /> Upload NPCI File</Button>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"><Download className="w-3.5 h-3.5" /> Export</Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { label: "All (12,460)", active: true },
          { label: "Exceptions (48)", active: false },
          { label: "Disputed (12)", active: false },
          { label: "Pending (60)", active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              tab.active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Txn ID", "Corporate", "Employee VPA", "Merchant VPA", "Amount", "MCC", "Time", "NPCI", "CBS", "Match", "Reason"].map((h) => (
                  <th key={h} className="data-table-header text-left px-3 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {reconItems.map((item) => (
                <tr
                  key={item.txnId}
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    item.slaBreaching && "bg-critical/5"
                  )}
                >
                  <td className="px-3 py-3 font-mono text-primary">{item.txnId.slice(-8)}</td>
                  <td className="px-3 py-3 text-foreground">{item.corporate}</td>
                  <td className="px-3 py-3 font-mono text-muted-foreground">{item.employeeVpa}</td>
                  <td className="px-3 py-3 font-mono text-muted-foreground">{item.merchantVpa}</td>
                  <td className="px-3 py-3 font-mono font-medium text-foreground">{item.amount}</td>
                  <td className="px-3 py-3 text-muted-foreground">{item.mcc}</td>
                  <td className="px-3 py-3 text-muted-foreground">{item.time}</td>
                  <td className="px-3 py-3"><span className="status-badge-success">{item.npciStatus}</span></td>
                  <td className="px-3 py-3 text-muted-foreground">{item.cbsStatus}</td>
                  <td className="px-3 py-3"><span className={matchBadge(item.matchStatus)}>{item.matchStatus}</span></td>
                  <td className="px-3 py-3 text-muted-foreground max-w-[200px] truncate">{item.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
