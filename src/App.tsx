
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewInterview from "./pages/NewInterview";
import InterviewSession from "./pages/InterviewSession";
import Roadmap from "./pages/Roadmap";
import Features from "./pages/Features";
import Categories from "./pages/Categories";
import SubjectQuestions from "./pages/SubjectQuestions";
import NotFound from "./pages/NotFound";
import PhoneSignIn from "./components/auth/PhoneSignIn";
import "@/lib/firebase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/phone-signin" element={<PhoneSignIn />} />
            <Route path="/features" element={<Features />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/subject-questions" element={<SubjectQuestions />} />
              <Route path="/interview/new" element={<NewInterview />} />
              <Route path="/interview/session" element={<InterviewSession />} />
              <Route path="/roadmap" element={<Roadmap />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
