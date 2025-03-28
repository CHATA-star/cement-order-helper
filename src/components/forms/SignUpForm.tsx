
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FormFields from "./signup/FormFields";
import TermsAndConditions from "./signup/TermsAndConditions";
import SuccessMessage from "./signup/SuccessMessage";
import { validateSignUpForm, showValidationError } from "@/utils/formValidation";
import { registerUser, getCurrentUser } from "@/services/registrationService";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      // If user is already logged in, redirect to order page
      navigate('/commande');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    const validation = validateSignUpForm(
      email, 
      phoneNumber, 
      password, 
      confirmPassword, 
      acceptTerms,
      name
    );
    
    if (!validation.isValid) {
      showValidationError(validation.errorMessage || "Erreur de validation");
      setIsLoading(false);
      return;
    }
    
    // Register user with name
    const success = await registerUser(email, phoneNumber, name);
    
    if (success) {
      setIsSubmitted(true);
      
      // Redirect to order page after 2 seconds
      setTimeout(() => {
        navigate('/commande');
      }, 2000);
    }
    
    setIsLoading(false);
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormFields
        email={email}
        setEmail={setEmail}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        name={name}
        setName={setName}
      />

      <TermsAndConditions
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
      />

      <Button 
        type="submit" 
        className="w-full bg-cement-600 hover:bg-cement-700"
        disabled={isLoading}
      >
        {isLoading ? 'Création en cours...' : 'Créer un compte'}
      </Button>
    </form>
  );
};

export default SignUpForm;
