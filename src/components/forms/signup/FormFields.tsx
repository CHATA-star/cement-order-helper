
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Phone } from "lucide-react";

interface FormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  name?: string;
  setName?: (name: string) => void;
}

const FormFields = ({
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name = "",
  setName,
}: FormFieldsProps) => {
  return (
    <>
      {setName && (
        <div>
          <Label htmlFor="name">Nom de l'établissement</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-cement-400" />
            </div>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de votre établissement"
              className="pl-10"
              required
            />
          </div>
        </div>
      )}
      
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
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Phone className="h-4 w-4 text-cement-400" />
          </div>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0123456789"
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
    </>
  );
};

export default FormFields;
