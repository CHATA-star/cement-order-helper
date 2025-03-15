
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleLogin = (username: string, password: string) => {
    // Simple authentication for demo purposes
    // In a real app, this would be handled securely
    if (username === "admin@chata.com" && password === "chata123") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cement-800 mb-6 text-center">
          Administration CHATA CIMENT
        </h1>
        
        {isAuthenticated ? (
          <AdminDashboard />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </div>
    </MainLayout>
  );
};

export default Admin;
