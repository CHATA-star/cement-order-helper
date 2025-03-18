
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, User, Lock, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

interface RegisteredUser {
  id: number;
  name: string;
  email: string;
  date: string;
}

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !name || !password) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur de validation",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    
    if (!acceptTerms) {
      toast({
        title: "Conditions d'utilisation",
        description: "Veuillez accepter les conditions d'utilisation pour continuer.",
        variant: "destructive"
      });
      return;
    }
    
    // Enregistrer l'utilisateur dans localStorage
    try {
      // Récupérer les utilisateurs existants
      const existingUsersData = localStorage.getItem('registeredUsers');
      const existingUsers: RegisteredUser[] = existingUsersData ? JSON.parse(existingUsersData) : [];
      
      // Générer un ID unique
      const maxId = existingUsers.length > 0 
        ? Math.max(...existingUsers.map(user => user.id)) 
        : 0;
      
      // Créer le nouvel utilisateur
      const newUser: RegisteredUser = {
        id: maxId + 1,
        name: name,
        email: email,
        date: new Date().toISOString().split('T')[0]
      };
      
      // Ajouter l'utilisateur à la liste
      const updatedUsers = [...existingUsers, newUser];
      
      // Enregistrer dans localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Show success message and reset form
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant passer votre commande.",
      });
      
      setIsSubmitted(true);
      
      // Rediriger vers la page de commande après 2 secondes
      setTimeout(() => {
        navigate('/commande');
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-cement-800 mb-2">Inscription réussie !</h3>
        <p className="text-cement-600 mb-4">
          Votre compte a été créé avec succès. Vous allez être redirigé vers la page de commande...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="h-4 w-4 text-cement-400" />
          </div>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Adresse email</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-4 w-4 text-cement-400" />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@gmail.com"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="h-4 w-4 text-cement-400" />
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="h-4 w-4 text-cement-400" />
          </div>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="terms" 
          checked={acceptTerms}
          onCheckedChange={setAcceptTerms}
        />
        <Label htmlFor="terms" className="text-sm text-cement-600">
          J'accepte les conditions d'utilisation et la politique de confidentialité
        </Label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-cement-600 hover:bg-cement-700"
      >
        Créer un compte
      </Button>
    </form>
  );
};

export default SignUpForm;
