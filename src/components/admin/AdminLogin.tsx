
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, User } from "lucide-react";
import ChataCimentLogo from "../logo/ChataCimentLogo";
import { Textarea } from "@/components/ui/textarea";

interface AdminLoginProps {
  onLogin: (username: string, password: string) => boolean;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailRequest, setShowEmailRequest] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Bonjour, je souhaite obtenir un accès administrateur pour la plateforme CHATA CIMENT.");
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

  const handleEmailRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simuler l'envoi d'un email
    setTimeout(() => {
      const mailtoLink = `mailto:admin@chataciment.com?subject=Demande d'accès administrateur&body=${encodeURIComponent(message)}`;
      window.open(mailtoLink, '_blank');
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande d'accès a été envoyée avec succès. Vous serez contacté prochainement.",
      });
      
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
        {showEmailRequest ? (
          <form onSubmit={handleEmailRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Votre adresse email</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-cement-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre-email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (facultatif)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-cement-600 hover:bg-cement-700"
              disabled={isLoading}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>

            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setShowEmailRequest(false)} 
                className="text-cement-600 hover:text-cement-800 text-sm underline"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        ) : (
          <>
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
                    placeholder="nabiletamou@gmail.com"
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
            
            <div className="pt-4 text-center border-t border-gray-200">
              <p className="text-sm text-cement-600 mb-2">Vous n'avez pas d'identifiants ?</p>
              <Button 
                variant="outline" 
                className="w-full border-cement-600 text-cement-700 hover:bg-cement-50"
                onClick={() => setShowEmailRequest(true)}
              >
                Demander un accès administrateur
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminLogin;
