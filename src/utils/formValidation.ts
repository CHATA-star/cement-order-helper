
import { toast } from "@/hooks/use-toast";

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateSignUpForm = (
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
  acceptTerms: boolean
): ValidationResult => {
  // Check required fields
  if (!email || !password || !phoneNumber) {
    return {
      isValid: false,
      errorMessage: "Veuillez remplir tous les champs obligatoires."
    };
  }
  
  // Check password match
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errorMessage: "Les mots de passe ne correspondent pas."
    };
  }
  
  // Check terms
  if (!acceptTerms) {
    return {
      isValid: false,
      errorMessage: "Veuillez accepter les conditions d'utilisation pour continuer."
    };
  }
  
  return { isValid: true };
};

export const showValidationError = (errorMessage: string) => {
  toast({
    title: "Erreur de validation",
    description: errorMessage,
    variant: "destructive"
  });
};
