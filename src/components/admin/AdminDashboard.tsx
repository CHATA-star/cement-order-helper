
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStats from "@/components/dashboard/OrderStats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Package, Settings, TrendingUp, ExternalLink } from "lucide-react";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminLink, setAdminLink] = useState("");

  useEffect(() => {
    // Générer le lien d'accès administrateur
    const baseUrl = window.location.origin;
    setAdminLink(`${baseUrl}/commande?adminToken=chata123`);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adminLink);
    toast({
      title: "Lien copié",
      description: "Le lien d'accès administrateur a été copié dans le presse-papiers."
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Commandes</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tableau de bord CHATA CIMENT</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cement-600 mb-4">
                Bienvenue dans l'interface d'administration de CHATA CIMENT. Vous pouvez gérer les commandes, 
                les utilisateurs et configurer les paramètres du site.
              </p>
              
              <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-amber-600" />
                  Lien d'accès administrateur
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  Ce lien vous permet d'accéder à la page de commande avec des droits d'administrateur pour modifier les statistiques et le stock.
                </p>
                <div className="flex gap-2">
                  <Input value={adminLink} readOnly className="bg-white" />
                  <Button onClick={copyToClipboard}>Copier</Button>
                </div>
                <div className="mt-2">
                  <a href={adminLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> Ouvrir dans un nouvel onglet
                  </a>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Statistiques des commandes</h3>
                <OrderStats isAdmin={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2">Informations de l'entreprise</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nom de l'entreprise</label>
                      <Input defaultValue="CHATA CIMENT" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Contact WhatsApp</label>
                      <Input defaultValue="0161080251" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email de contact</label>
                      <Input defaultValue="contact@chataciment.com" />
                    </div>
                  </div>
                  <Button className="mt-4 bg-cement-600 hover:bg-cement-700" onClick={() => {
                    toast({
                      title: "Paramètres sauvegardés",
                      description: "Les modifications ont été enregistrées avec succès."
                    });
                  }}>
                    Sauvegarder les modifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
