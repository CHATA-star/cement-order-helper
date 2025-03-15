
import React from "react";
import { Building, MessageCircle, ShoppingCart, Shield } from "lucide-react";
import ChataCimentLogo from "../logo/ChataCimentLogo";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="bg-gradient-to-r from-cement-700 to-cement-800 text-white p-4 shadow-lg border-b-2 border-amber-400">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <ChataCimentLogo size="sm" />
            <div>
              <h1 className="text-xl font-bold tracking-wide text-amber-100">CHATA CIMENT</h1>
              <p className="text-xs text-amber-300">Une filiale de CHATA GLOBAL</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-amber-100 hover:text-white transition-colors hover:underline">
              Accueil
            </Link>
            <Link to="/commande" className="text-amber-100 hover:text-white transition-colors hover:underline flex items-center">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Commander
            </Link>
            <Link to="/reviews" className="text-amber-100 hover:text-white transition-colors hover:underline flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              Avis Clients
            </Link>
            <Link to="/admin" className="text-amber-100 hover:text-white transition-colors hover:underline flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
      <footer className="bg-gradient-to-r from-cement-700 to-cement-800 text-amber-100 p-4 mt-8 border-t-2 border-amber-400">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} CHATA GLOBAL - Tous droits réservés
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
