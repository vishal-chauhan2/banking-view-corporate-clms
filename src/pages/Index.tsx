import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import {
  UtilizationTrend,
  TopCorporatesChart,
  MccBreakdown,
  SettlementTimeline,
} from "@/components/dashboard/PortfolioCharts";
import {
  IndianRupee,
  Building2,
  Zap,
  AlertTriangle,
  ClipboardCheck,
  ArrowLeftRight,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout title="Portfolio Dashboard" subtitle="Credit Line on UPI — Bank Command Center">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiTile
          label="Sanctioned / Utilized"
          value="₹842Cr"
          subtitle="67.4% of ₹1,250Cr sanctioned"
          change={{ value: "3.2%", positive: true }}
          icon={<IndianRupee className="w-4 h-4" />}
        />
        <KpiTile
          label="Active Corporates"
          value="147"
          subtitle="12 onboarding · 3 frozen"
          change={{ value: "5", positive: true }}
          icon={<Building2 className="w-4 h-4" />}
        />
        <KpiTile
          label="Today's UPI Spends"
          value="₹18.4Cr"
          subtitle="vs ₹16.1Cr 30-day avg"
          change={{ value: "14.3%", positive: true }}
          icon={<Zap className="w-4 h-4" />}
        />
        <KpiTile
          label="Pending Recon"
          value="48"
          subtitle="SLA breach in 2h 15m"
          alert
          icon={<ArrowLeftRight className="w-4 h-4" />}
        />
        <KpiTile
          label="Open Risk Alerts"
          value="23"
          subtitle="3 critical · 8 high · 12 medium"
          alert
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <KpiTile
          label="Pending Approvals"
          value="6"
          subtitle="Awaiting your action"
          icon={<ClipboardCheck className="w-4 h-4" />}
        />
      </div>

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Charts 3-col */}
        <div className="xl:col-span-3 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <UtilizationTrend />
            <TopCorporatesChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MccBreakdown />
            <SettlementTimeline />
          </div>
        </div>

        {/* Alerts sidebar */}
        <div className="xl:col-span-1">
          <AlertsFeed />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
