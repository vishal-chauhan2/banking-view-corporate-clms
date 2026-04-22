import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Construction } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
}

export default function PlaceholderPage({ title, subtitle }: Props) {
  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          This module is under development. The full specification includes detailed widget inventory, 
          interaction patterns, and role-gated actions.
        </p>
      </div>
    </DashboardLayout>
  );
}
