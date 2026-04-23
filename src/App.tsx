import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import SelectRole from "@/pages/auth/SelectRole";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

/**
 * Wrapper that checks auth before rendering AppLayout.
 * AppLayout uses <Outlet /> internally, so we render it as a layout route element.
 */
function ProtectedAppLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public auth routes */}
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
            <Route path="/select-role" element={<SelectRole />} />

            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<ProtectedAppLayout />}>
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/startup" element={<MyStartup />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/assigned-startups" element={<AssignedStartups />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/all-startups" element={<AllStartups />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/analytics" element={<Analytics />} />
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
