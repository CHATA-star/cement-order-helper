
import React from "react";
import { Building, MessageCircle, ShoppingCart, Shield, LogIn, UserPlus, User } from "lucide-react";
import ChataCimentLogo from "../logo/ChataCimentLogo";
import { Link, useLocation } from "react-router-dom";
import { getCurrentUser } from "@/services/registrationService";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // Récupérer l'utilisateur courant
  const currentUser = getCurrentUser();
  const location = useLocation();
  
  // Déterminer si le lien est actif
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="bg-gradient-to-r from-cement-700 to-cement-800 text-white p-4 shadow-lg border-b-2 border-amber-400">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-3">
            <ChataCimentLogo size="sm" />
            <div>
              <h1 className="text-xl font-bold tracking-wide text-amber-100">CHATA CIMENT</h1>
              <p className="text-xs text-amber-300">Une filiale de CHATA GLOBAL</p>
            </div>
          </Link>
          
          <NavigationMenu className="max-w-full overflow-x-auto">
            <NavigationMenuList className="flex flex-wrap gap-1 md:gap-2">
              <NavigationMenuItem>
                <Link to="/" className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive("/") 
                    ? "bg-amber-600 text-white" 
                    : "text-amber-100 hover:bg-cement-600 hover:text-white"
                )}>
                  <Building className="h-4 w-4 mr-1" />
                  <span>Accueil</span>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/commande" className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive("/commande") 
                    ? "bg-amber-600 text-white" 
                    : "text-amber-100 hover:bg-cement-600 hover:text-white"
                )}>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  <span>Commander</span>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/reviews" className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive("/reviews") 
                    ? "bg-amber-600 text-white" 
                    : "text-amber-100 hover:bg-cement-600 hover:text-white"
                )}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>Avis Clients</span>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/admin" className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive("/admin") 
                    ? "bg-amber-600 text-white" 
                    : "text-amber-100 hover:bg-cement-600 hover:text-white"
                )}>
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Admin</span>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <Link to="/commande">
                <Button variant="outline" className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">{currentUser.name || currentUser.email}</span>
                </Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="text-amber-100 border-amber-500 hover:bg-cement-600">
                    <LogIn className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Connexion</span>
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    <UserPlus className="h-4 w-4 mr-1" />
                    <span className="hidden md:inline">Inscription</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
      
      <footer className="bg-gradient-to-r from-cement-700 to-cement-800 text-amber-100 p-4 mt-8 border-t-2 border-amber-400">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              &copy; {new Date().getFullYear()} CHATA GLOBAL - Tous droits réservés
            </div>
            <div className="flex gap-6">
              <Link to="/" className="text-amber-200 hover:text-white transition-colors text-sm">Conditions d'utilisation</Link>
              <Link to="/" className="text-amber-200 hover:text-white transition-colors text-sm">Politique de confidentialité</Link>
              <Link to="/" className="text-amber-200 hover:text-white transition-colors text-sm">Contactez-nous</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
