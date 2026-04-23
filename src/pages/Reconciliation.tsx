import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IndianRupee, ArrowDownLeft, ArrowUpRight, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";

/* ─── Pool Account Summary ─── */
const poolSummary = {
  openingBalance: "₹142.5Cr",
  totalDebits: "₹18.4Cr",
  totalCredits: "₹22.1Cr",
  closingBalance: "₹146.2Cr",
};

/* ─── Recon Exception Items ─── */
interface ReconException {
  txnId: string;
  corporate: string;
  employeeVpa: string;
  merchantVpa: string;
  amount: string;
  npciAmount: string;
  cbsAmount: string;
  mismatchReason: string;
  time: string;
  slaBreaching?: boolean;
}

const initialExceptions: ReconException[] = [
  { txnId: "UPI260422-003", corporate: "Indo Amines Ltd.", employeeVpa: "emp_2041@upi", merchantVpa: "flipkart@hdfcupi", amount: "₹14,500", npciAmount: "₹14,500", cbsAmount: "₹14,050", mismatchReason: "Amount mismatch ₹14,500 vs ₹14,050", time: "09:22:11", slaBreaching: true },
  { txnId: "UPI260422-007", corporate: "Ksolves India Ltd.", employeeVpa: "emp_0812@upi", merchantVpa: "amazon@icici", amount: "₹34,500", npciAmount: "₹34,500", cbsAmount: "₹34,050", mismatchReason: "Amount mismatch ₹34,500 vs ₹34,050", time: "09:25:33" },
  { txnId: "UPI260422-012", corporate: "V2 Retail Ltd.", employeeVpa: "emp_1190@upi", merchantVpa: "swiggy@axisbank", amount: "₹8,900", npciAmount: "₹8,900", cbsAmount: "Pending", mismatchReason: "CBS posting delayed", time: "09:31:07", slaBreaching: true },
  { txnId: "UPI260422-018", corporate: "Fermenta Biotech Ltd.", employeeVpa: "emp_0567@upi", merchantVpa: "irctc@sbi", amount: "₹22,000", npciAmount: "₹22,000", cbsAmount: "Not Found", mismatchReason: "CBS record missing", time: "09:38:44" },
  { txnId: "UPI260422-024", corporate: "Globus Power Generation Ltd.", employeeVpa: "emp_3341@upi", merchantVpa: "unknown@upi", amount: "₹5,600", npciAmount: "DEEMED", cbsAmount: "Not Found", mismatchReason: "Merchant VPA unregistered", time: "09:42:18", slaBreaching: true },
  { txnId: "UPI260422-031", corporate: "Thangamayil Jewellery Ltd.", employeeVpa: "emp_4821@upi", merchantVpa: "hpcl@sbi", amount: "₹1,850", npciAmount: "₹1,850", cbsAmount: "₹1,850", mismatchReason: "Duplicate NPCI entry", time: "09:55:02" },
];

export default function Reconciliation() {
  const [exceptions, setExceptions] = useState(initialExceptions);

  const markResolved = (txnId: string) => {
    setExceptions((prev) => prev.filter((e) => e.txnId !== txnId));
  };

  return (
    <DashboardLayout title="Reconciliation & Settlements" subtitle="NPCI Settlement Cycle — 22 Apr 2026">
      {/* Pool Account Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiTile label="Opening Balance" value={poolSummary.openingBalance} icon={<Wallet className="w-4 h-4" />} />
        <KpiTile label="Total Debits" value={poolSummary.totalDebits} subtitle="Today's outflows" icon={<ArrowUpRight className="w-4 h-4 text-critical" />} />
        <KpiTile label="Total Credits" value={poolSummary.totalCredits} subtitle="Today's inflows" icon={<ArrowDownLeft className="w-4 h-4 text-success" />} />
        <KpiTile label="Closing Balance" value={poolSummary.closingBalance} change={{ value: "2.6%", positive: true }} icon={<IndianRupee className="w-4 h-4" />} />
      </div>

      {/* Recon Exception Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recon Exceptions</h3>
            <p className="text-xs text-muted-foreground">{exceptions.length} unresolved mismatches</p>
          </div>
          <span className="status-badge-warning text-[10px]">{exceptions.filter((e) => e.slaBreaching).length} SLA Breaching</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {["Txn ID", "Corporate", "Employee VPA", "Merchant VPA", "NPCI Amt", "CBS Amt", "Reason", "Time", "Action"].map((h) => (
                  <th key={h} className="data-table-header text-left px-3 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {exceptions.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-success" />
                    All exceptions resolved
                  </td>
                </tr>
              )}
              {exceptions.map((item) => (
                <tr
                  key={item.txnId}
                  className={cn(
                    "hover:bg-muted/30 transition-colors",
                    item.slaBreaching && "bg-critical/5"
                  )}
                >
                  <td className="px-3 py-3 font-mono text-primary">{item.txnId}</td>
                  <td className="px-3 py-3 text-foreground">{item.corporate}</td>
                  <td className="px-3 py-3 font-mono text-muted-foreground">{item.employeeVpa}</td>
                  <td className="px-3 py-3 font-mono text-muted-foreground">{item.merchantVpa}</td>
                  <td className="px-3 py-3 font-mono font-medium text-foreground">{item.npciAmount}</td>
                  <td className="px-3 py-3 font-mono text-muted-foreground">{item.cbsAmount}</td>
                  <td className="px-3 py-3 text-muted-foreground max-w-[200px] truncate">{item.mismatchReason}</td>
                  <td className="px-3 py-3 text-muted-foreground">{item.time}</td>
                  <td className="px-3 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[10px] gap-1"
                      onClick={() => markResolved(item.txnId)}
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                    </Button>
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
