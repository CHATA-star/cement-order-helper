
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/services/registrationService";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setIsAuthenticated(true);
      } else {
        toast({
          title: "Accès restreint",
          description: "Veuillez créer un compte pour accéder à cette page",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    // Show a loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cement-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to the signup page with a return URL
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
