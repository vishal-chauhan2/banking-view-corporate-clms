import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import CorporateClients from "./pages/CorporateClients.tsx";
import Reconciliation from "./pages/Reconciliation.tsx";
import RiskCompliance from "./pages/RiskCompliance.tsx";
import Analytics from "./pages/Analytics.tsx";
import AuditTrail from "./pages/AuditTrail.tsx";
import PlaceholderPage from "./pages/PlaceholderPage.tsx";
import UserManagement from "./pages/UserManagement.tsx";
import LimitManagement from "./pages/LimitManagement.tsx";
import EmployeeVPA from "./pages/EmployeeVPA.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/banking-view-corporate-clms">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/corporates" element={<CorporateClients />} />
          <Route path="/reconciliation" element={<Reconciliation />} />
          <Route path="/risk" element={<RiskCompliance />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/audit" element={<AuditTrail />} />
          <Route path="/employees" element={<EmployeeVPA />} />
          <Route path="/limits" element={<LimitManagement />} />
          <Route path="/reports" element={<PlaceholderPage title="Regulatory Reports & MIS" subtitle="Pre-built RBI/NPCI report templates with scheduled delivery" />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<PlaceholderPage title="Platform Configuration" subtitle="MCC blocklists, velocity rules, and integration settings" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
