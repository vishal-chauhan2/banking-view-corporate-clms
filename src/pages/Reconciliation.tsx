import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IndianRupee, ArrowDownLeft, ArrowUpRight, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";

interface ReconException {
  id: string;
  txnId: string;
  corporate: string;
  employeeVpa: string;
  merchantVpa: string;
  amount: string;
  npciAmount: string;
  cbsAmount: string;
  reason: string;
  time: string;
}

const initialExceptions: ReconException[] = [
  { id: "1", txnId: "UPI248103847203", corporate: "Innovana Thinklabs Ltd.", employeeVpa: "emp_0567@upi", merchantVpa: "irctc@sbi", amount: "₹8,920", npciAmount: "₹8,920", cbsAmount: "₹8,900", reason: "Amount mismatch ₹8,920 vs ₹8,900", time: "09:22" },
  { id: "2", txnId: "UPI248103847204", corporate: "V2 Retail Ltd.", employeeVpa: "emp_3341@upi", merchantVpa: "amazon@icici", amount: "₹34,500", npciAmount: "₹34,500", cbsAmount: "₹34,050", reason: "Amount mismatch ₹34,500 vs ₹34,050", time: "09:25" },
  { id: "3", txnId: "UPI248103847205", corporate: "Indo Amines Ltd.", employeeVpa: "emp_2234@upi", merchantVpa: "unknown@upi", amount: "₹5,600", npciAmount: "₹5,600", cbsAmount: "—", reason: "CBS entry not found", time: "09:31" },
  { id: "4", txnId: "UPI248103847210", corporate: "Globus Power Generation Ltd.", employeeVpa: "emp_8812@upi", merchantVpa: "hpcl@sbi", amount: "₹3,200", npciAmount: "₹3,200", cbsAmount: "₹3,200", reason: "Duplicate posting detected", time: "09:45" },
  { id: "5", txnId: "UPI248103847215", corporate: "Fermenta Biotech Ltd.", employeeVpa: "emp_1002@upi", merchantVpa: "ola@yesbank", amount: "₹1,850", npciAmount: "₹1,850", cbsAmount: "₹1,850", reason: "Timestamp mismatch (>5 min delta)", time: "10:02" },
];

export default function Reconciliation() {
  const [exceptions, setExceptions] = useState(initialExceptions);

  const markResolved = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <DashboardLayout title="Reconciliation & Settlements" subtitle="NPCI Settlement Cycle — 22 Apr 2026">
      {/* Summary Cards — Pool Account */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiTile
          label="Opening Balance"
          value="₹142.6Cr"
          subtitle="As of 00:00 today"
          icon={<Wallet className="w-4 h-4" />}
        />
        <KpiTile
          label="Total Debits"
          value="₹18.4Cr"
          subtitle="12,460 transactions"
          icon={<ArrowUpRight className="w-4 h-4 text-critical" />}
        />
        <KpiTile
          label="Total Credits"
          value="₹22.1Cr"
          subtitle="Repayments + settlements"
          icon={<ArrowDownLeft className="w-4 h-4 text-success" />}
        />
        <KpiTile
          label="Closing Balance"
          value="₹146.3Cr"
          subtitle="Net +₹3.7Cr"
          change={{ value: "2.6%", positive: true }}
          icon={<IndianRupee className="w-4 h-4" />}
        />
      </div>

      {/* Recon Exception Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recon Exceptions</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Showing transactions with mismatch_flag = true · {exceptions.length} remaining</p>
          </div>
          {exceptions.length === 0 && (
            <span className="status-badge-success text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All Resolved
            </span>
          )}
        </div>

        {exceptions.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">All reconciliation exceptions have been resolved.</p>
          </div>
        ) : (
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
                {exceptions.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors bg-critical/5">
                    <td className="px-3 py-3 font-mono text-primary">{item.txnId.slice(-8)}</td>
                    <td className="px-3 py-3 text-foreground">{item.corporate}</td>
                    <td className="px-3 py-3 font-mono text-muted-foreground">{item.employeeVpa}</td>
                    <td className="px-3 py-3 font-mono text-muted-foreground">{item.merchantVpa}</td>
                    <td className="px-3 py-3 font-mono font-medium text-foreground">{item.npciAmount}</td>
                    <td className="px-3 py-3 font-mono font-medium text-foreground">{item.cbsAmount}</td>
                    <td className="px-3 py-3 text-muted-foreground max-w-[200px] truncate">
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-warning shrink-0" />
                        {item.reason}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{item.time}</td>
                    <td className="px-3 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-[10px] gap-1"
                        onClick={() => markResolved(item.id)}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
