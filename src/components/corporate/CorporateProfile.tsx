import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Building2, User, CreditCard, TrendingUp, Users, ShieldAlert,
  FileText, Clock, AlertTriangle, CheckCircle2,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const healthHistory = [
  { month: "Oct", score: 78 },
  { month: "Nov", score: 82 },
  { month: "Dec", score: 75 },
  { month: "Jan", score: 80 },
  { month: "Feb", score: 85 },
  { month: "Mar", score: 88 },
];

interface Props {
  corporate: {
    name: string;
    industry: string;
    rm: string;
    sanctioned: string;
    utilized: string;
    utilizationPct: number;
    healthScore: number;
    status: string;
  };
}

export function CorporateProfile({ corporate }: Props) {
  return (
    <div className="space-y-4">
      {/* Identity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Entity Info */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{corporate.name}</h3>
              <p className="text-xs text-muted-foreground">{corporate.industry}</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">CIN</span><span className="font-mono text-foreground">U72200MH2004PLC148410</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GSTIN</span><span className="font-mono text-foreground">27AABCT1234F1ZH</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">KYC Status</span><span className="status-badge-success">Verified</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">KYC Expiry</span><span className="text-foreground">15 Aug 2025</span></div>
          </div>
        </div>

        {/* RM & Relationship */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Relationship Manager</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium text-foreground">{corporate.rm}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tenure</span><span className="text-foreground">2 yrs 4 months</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Last Interaction</span><span className="text-foreground">3 days ago</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-primary text-[11px]">{corporate.rm.split(" ")[0].toLowerCase()}@bank.com</span></div>
          </div>
        </div>

        {/* Credit Summary */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Credit Summary</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Utilization</span>
                <span className="font-bold text-foreground">{corporate.utilizationPct}%</span>
              </div>
              <Progress value={corporate.utilizationPct} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-muted-foreground block">Sanctioned</span><span className="font-bold text-foreground text-base">{corporate.sanctioned}</span></div>
              <div><span className="text-muted-foreground block">Utilized</span><span className="font-bold text-foreground text-base">{corporate.utilized}</span></div>
              <div><span className="text-muted-foreground block">Available</span><span className="font-bold text-success text-base">₹{(parseFloat(corporate.sanctioned.replace(/[₹Cr]/g, "")) - parseFloat(corporate.utilized.replace(/[₹Cr]/g, ""))).toFixed(1)}Cr</span></div>
              <div><span className="text-muted-foreground block">Blocked</span><span className="font-bold text-warning text-base">₹1.2Cr</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Score + VPA Summary + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health Score */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Health Score</h3>
            <span className={cn(
              "text-2xl font-bold",
              corporate.healthScore >= 75 ? "text-success" : corporate.healthScore >= 50 ? "text-warning" : "text-critical"
            )}>
              {corporate.healthScore}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={healthHistory}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220, 9%, 46%)" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Area type="monotone" dataKey="score" stroke="hsl(142, 76%, 36%)" fill="url(#healthGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
            <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" /> Repayment: On-time</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" /> Dispute rate: 0.1%</div>
            <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-warning" /> Failed txns: 2.3%</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" /> Util consistency: High</div>
          </div>
        </div>

        {/* VPA Summary */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Employee & VPA Summary</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <span className="text-lg font-bold text-foreground block">842</span>
              <span className="text-[10px] text-muted-foreground">Active VPAs</span>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <span className="text-lg font-bold text-muted-foreground block">156</span>
              <span className="text-[10px] text-muted-foreground">Dormant</span>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <span className="text-lg font-bold text-critical block">3</span>
              <span className="text-[10px] text-muted-foreground">Blocked</span>
            </div>
          </div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Top 5 Spenders</h4>
          <div className="space-y-1.5">
            {["emp_4821 — ₹4.2L", "emp_1190 — ₹3.8L", "emp_0567 — ₹3.1L", "emp_2234 — ₹2.9L", "emp_7712 — ₹2.4L"].map((s) => (
              <div key={s} className="text-xs font-mono text-muted-foreground flex justify-between">
                <span>{s.split(" — ")[0]}</span>
                <span className="text-foreground font-medium">{s.split(" — ")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-card rounded-xl border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
              <CreditCard className="w-3.5 h-3.5" /> Request Limit Change
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
              <TrendingUp className="w-3.5 h-3.5" /> View Spend Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
              <FileText className="w-3.5 h-3.5" /> Download Statement
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9">
              <Clock className="w-3.5 h-3.5" /> View Limit History
            </Button>
            <div className="pt-2 border-t mt-3">
              <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9 text-warning border-warning/30 hover:bg-warning/5">
                <ShieldAlert className="w-3.5 h-3.5" /> Flag for Review
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-xs h-9 mt-2 text-critical border-critical/30 hover:bg-critical/5">
                <AlertTriangle className="w-3.5 h-3.5" /> Freeze Credit Line
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
