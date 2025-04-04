
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/services/registrationService";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import ChataCimentLogo from "../logo/ChataCimentLogo";

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
    // Afficher une interface conviviale au lieu de rediriger immédiatement
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-md border-cement-300">
          <CardHeader className="bg-gradient-to-r from-cement-700 to-cement-800 text-white rounded-t-lg">
            <div className="flex justify-center mb-2">
              <ChataCimentLogo size="md" />
            </div>
            <CardTitle className="text-center text-xl">Accès Restreint</CardTitle>
            <CardDescription className="text-center text-amber-100">
              Cette section nécessite un compte utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-2 text-center">
            <p className="text-cement-700 mb-4">
              Pour accéder à cette page, veuillez vous connecter ou créer un compte.
              Cette restriction permet de vous offrir une expérience personnalisée.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-6">
            <Link to="/login" state={{ from: location.pathname }}>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-cement-600 text-cement-700 hover:bg-cement-100"
              >
                <LogIn className="mr-2 h-4 w-4" /> Se connecter
              </Button>
            </Link>
            <Link to="/" state={{ from: location.pathname }}>
              <Button className="w-full sm:w-auto bg-cement-700 hover:bg-cement-800 text-white">
                <UserPlus className="mr-2 h-4 w-4" /> Créer un compte
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
