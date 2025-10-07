import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import DashboardTest from "./pages/DashboardTest";
import Campaign from "./pages/Campaign";
import BrandHub from "./pages/BrandHubNew";
import Campaigns from "./pages/Campaigns";
import Settings from "./pages/Settings";
import CampaignTest from "./pages/CampaignTest";
import CampaignSimple from "./pages/CampaignSimple";
import CampaignWorking from "./pages/CampaignWorking";
import CampaignResults from "./pages/CampaignResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-test" element={<DashboardTest />} />
          <Route path="/campaign" element={<CampaignWorking />} />
          <Route path="/campaign-full" element={<Campaign />} />
          <Route path="/brand-hub" element={<BrandHub />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/campaign-results" element={<CampaignResults />} />
          <Route path="/campaign-test" element={<CampaignTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
