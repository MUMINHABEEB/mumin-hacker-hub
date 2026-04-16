import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import ProjectsPage from "./pages/ProjectsPage";
import SocialMediaPage from "./pages/SocialMediaPage";
import AchievementsPage from "./pages/AchievementsPage";
import { TestingDashboard } from "./pages/TestingDashboard";
import { SupabaseAdmin } from "./components/SupabaseAdmin";
import AIChatBot from "./components/AIChatBot";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/social-media" element={<SocialMediaPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/testing" element={<TestingDashboard />} />
            <Route path="/admin" element={<SupabaseAdmin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* AI Assistant - Available on all pages */}
          <AIChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
