
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";
import ChataCimentLogo from "../logo/ChataCimentLogo";

interface AdminLoginProps {
  onLogin: (username: string, password: string) => boolean;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = onLogin(username, password);

      if (!success) {
        toast({
          title: "Échec de connexion",
          description: "Identifiant ou mot de passe incorrect",
          variant: "destructive",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full border-cement-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cement-700 to-cement-800 text-white rounded-t-lg">
        <div className="flex justify-center mb-4">
          <ChataCimentLogo size="md" />
        </div>
        <CardTitle className="text-center text-xl">Connexion Administrateur</CardTitle>
        <CardDescription className="text-center text-amber-100">
          Entrez vos identifiants pour accéder à l'interface d'administration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Identifiant</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 text-cement-400" />
              </div>
              <Input
                id="username"
                type="email"
                placeholder="admin@chata.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-cement-400" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-cement-600 hover:bg-cement-700"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLogin;
