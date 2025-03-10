
import React from "react";
import { Building } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-cement-50">
      <header className="bg-cement-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building size={24} />
            <h1 className="text-xl font-bold">CementOrders</h1>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
      <footer className="bg-cement-800 text-cement-100 p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} CementOrders - Tous droits réservés
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
