
import React from "react";
import { CheckCircle2 } from "lucide-react";

const SuccessMessage = () => {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 rounded-full p-3">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-cement-800 mb-2">
        Inscription réussie !
      </h3>
      <p className="text-cement-600 mb-4">
        Votre compte a été créé avec succès. Vous allez être redirigé vers la page de commande...
      </p>
    </div>
  );
};

export default SuccessMessage;
