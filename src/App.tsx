
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Commande from "./pages/Commande";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import Reviews from "./pages/Reviews";
import Admin from "./pages/Admin";
import { syncLocalUsersToSupabase } from "./services/userService";
import { forceSyncAllPlatforms, recalculateOrderTotals } from "./services/orderService";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Créer une instance de QueryClient avec une configuration pour la mise en cache
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  useEffect(() => {
    // Fonction pour synchroniser toutes les données
    const syncAllData = async () => {
      try {
        // Recalculer d'abord les totaux basés sur les commandes existantes
        recalculateOrderTotals();
        
        // Synchroniser les utilisateurs
        await syncLocalUsersToSupabase();
        
        // Forcer la synchronisation des données entre les plateformes
        await forceSyncAllPlatforms();
        
        console.log("Synchronisation complète des données terminée");
      } catch (err) {
        console.error("Erreur lors de la synchronisation des données:", err);
      }
    };
    
    // Synchroniser les données au démarrage
    syncAllData();
    
    // Synchroniser périodiquement (toutes les 10 minutes)
    const syncInterval = setInterval(syncAllData, 10 * 60 * 1000);
    
    return () => clearInterval(syncInterval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/commande" 
              element={
                <ProtectedRoute>
                  <Commande />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/confirmation" 
              element={
                <ProtectedRoute>
                  <Confirmation />
                </ProtectedRoute>
              } 
            />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
