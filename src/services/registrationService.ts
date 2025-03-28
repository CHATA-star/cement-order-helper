
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface RegisteredUser {
  id: number;
  email: string;
  date: string;
  phoneNumber?: string;
}

export const registerUser = async (
  email: string,
  phoneNumber: string
): Promise<boolean> => {
  try {
    // Save user to localStorage
    const existingUsersData = localStorage.getItem('registeredUsers');
    const existingUsers: RegisteredUser[] = existingUsersData ? JSON.parse(existingUsersData) : [];
    
    const maxId = existingUsers.length > 0 
      ? Math.max(...existingUsers.map(user => user.id)) 
      : 0;
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const newUser: RegisteredUser = {
      id: maxId + 1,
      email: email,
      phoneNumber: phoneNumber,
      date: currentDate
    };
    
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Store user's current session info
    sessionStorage.setItem('currentUser', JSON.stringify({
      email: email,
      phoneNumber: phoneNumber
    }));
    
    // Save user to Supabase
    const { error } = await supabase
      .from('registered_users')
      .insert([
        {
          email: email,
          phone_number: phoneNumber,
          registration_date: currentDate,
        }
      ]);
      
    if (error) {
      console.error("Erreur Supabase:", error);
      // Continue even if Supabase fails, as user is saved locally
      toast({
        title: "Avertissement",
        description: "Inscription réussie, mais une erreur de synchronisation est survenue.",
      });
    }
    
    toast({
      title: "Inscription réussie",
      description: "Votre compte a été créé avec succès. Vous pouvez maintenant passer votre commande.",
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.",
      variant: "destructive"
    });
    return false;
  }
};
