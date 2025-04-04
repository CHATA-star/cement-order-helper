
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  // Check if user was previously authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = (username: string, password: string) => {
    // Simple authentication for demo purposes
    // In a real app, this would be handled securely
    if ((username === "admin@chata.com" && password === "chata123") || 
        (username === "nabiletamou@gmail.com" && password === "Dieu@1999")) {
      setIsAuthenticated(true);
      // Save authentication state
      localStorage.setItem('admin_authenticated', 'true');
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration de CHATA CIMENT.",
      });
      
      return true;
    }
    return false;
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de l'interface d'administration.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cement-800 mb-6 text-center">
          Administration CHATA CIMENT
        </h1>
        
        {isAuthenticated ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </div>
    </MainLayout>
  );
};

export default Admin;
