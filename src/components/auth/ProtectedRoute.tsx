
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-interview-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-interview-text">Loading your profile...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    // Store attempted URL for redirect after login
    const redirectUrl = location.pathname !== '/' ? location.pathname : '/dashboard';
    
    // Don't show toast for home page navigation
    if (location.pathname !== '/') {
      toast({
        title: "Authentication required",
        description: "Please login to access this page",
        variant: "destructive"
      });
    }
    
    // Redirect to login page and save the attempted URL
    return <Navigate to="/login" state={{ from: redirectUrl }} replace />;
  }

  // Render children routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
