
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TermsAndConditionsProps {
  acceptTerms: boolean;
  setAcceptTerms: (acceptTerms: boolean) => void;
}

const TermsAndConditions = ({
  acceptTerms,
  setAcceptTerms,
}: TermsAndConditionsProps) => {
  return (
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
  );
};

export default TermsAndConditions;
