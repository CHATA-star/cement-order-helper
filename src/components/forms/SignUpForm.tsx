
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, CheckCircle2 } from "lucide-react";

const SignUpForm = () => {
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (contactType === "email" && !email) return;
    if (contactType === "phone" && !phone) return;
    if (!name) return;
    
    // Show success message and reset form
    toast({
      title: "Inscription réussie",
      description: "Merci de vous être inscrit. Vous recevrez nos messages prochainement.",
    });
    
    setIsSubmitted(true);
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
          Merci de vous être inscrit. Vous recevrez nos messages prochainement.
        </p>
        <Button 
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Nouvelle inscription
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Votre nom</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jean Dupont"
          required
        />
      </div>

      <div className="flex items-center space-x-4 mb-2">
        <button
          type="button"
          onClick={() => setContactType("email")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md flex-1 ${
            contactType === "email"
              ? "bg-cement-600 text-white"
              : "bg-cement-100 text-cement-800"
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setContactType("phone")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md flex-1 ${
            contactType === "phone"
              ? "bg-cement-600 text-white"
              : "bg-cement-100 text-cement-800"
          }`}
        >
          <Phone className="h-4 w-4" />
          Téléphone
        </button>
      </div>

      {contactType === "email" ? (
        <div>
          <Label htmlFor="email">Votre email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@gmail.com"
            required
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="phone">Votre numéro de téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+237 612345678"
            required
          />
        </div>
      )}

      <div className="text-sm text-cement-500 italic">
        En vous inscrivant, vous acceptez de recevoir nos messages concernant nos produits,
        promotions et actualités. Vous pourrez vous désinscrire à tout moment.
      </div>

      <Button 
        type="submit" 
        className="w-full bg-cement-600 hover:bg-cement-700"
      >
        S'inscrire
      </Button>
    </form>
  );
};

export default SignUpForm;
