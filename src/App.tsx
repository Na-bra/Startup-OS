import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardRouter from "@/pages/dashboard/DashboardRouter";
import MyStartup from "@/pages/student/MyStartup";
import Milestones from "@/pages/student/Milestones";
import Documents from "@/pages/student/Documents";
import AssignedStartups from "@/pages/mentor/AssignedStartups";
import FeedbackPage from "@/pages/mentor/Feedback";
import AllStartups from "@/pages/admin/AllStartups";
import UserManagement from "@/pages/admin/UserManagement";
import Analytics from "@/pages/admin/Analytics";
import Showcase from "@/pages/showcase/Showcase";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardRouter />} />
              {/* Student */}
              <Route path="/startup" element={<MyStartup />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/documents" element={<Documents />} />
              {/* Mentor */}
              <Route path="/assigned-startups" element={<AssignedStartups />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              {/* Admin */}
              <Route path="/all-startups" element={<AllStartups />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              {/* Shared */}
              <Route path="/showcase" element={<Showcase />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
