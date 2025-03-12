
import React from "react";
import { Building, MessageCircle } from "lucide-react";
import ChataCimentLogo from "../logo/ChataCimentLogo";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-cement-50">
      <header className="bg-cement-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <ChataCimentLogo size="sm" />
            <div>
              <h1 className="text-xl font-bold">CHATA CIMENT</h1>
              <p className="text-xs text-cement-200">Une filiale de CHATA GLOBAL</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-cement-100 hover:text-white transition-colors">
              Accueil
            </Link>
            <Link to="/reviews" className="text-cement-100 hover:text-white transition-colors flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              Avis Clients
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
      <footer className="bg-cement-800 text-cement-100 p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} CHATA GLOBAL - Tous droits réservés
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
