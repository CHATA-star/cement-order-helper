import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface RegisteredUser {
  id: number;
  email: string;
  date: string;
  phoneNumber?: string;
  name?: string;
  password?: string;
}

export const registerUser = async (
  email: string,
  phoneNumber: string,
  name?: string,
  password?: string
): Promise<boolean> => {
  try {
    // Save user to localStorage
    const existingUsersData = localStorage.getItem('registeredUsers');
    const existingUsers: RegisteredUser[] = existingUsersData ? JSON.parse(existingUsersData) : [];
    
    // Vérifier si l'email existe déjà
    const existingUser = existingUsers.find(user => user.email === email);
    if (existingUser) {
      toast({
        title: "Erreur",
        description: "Cette adresse email est déjà utilisée. Veuillez vous connecter.",
        variant: "destructive"
      });
      return false;
    }
    
    const maxId = existingUsers.length > 0 
      ? Math.max(...existingUsers.map(user => user.id)) 
      : 0;
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const newUser: RegisteredUser = {
      id: maxId + 1,
      email: email,
      phoneNumber: phoneNumber,
      name: name,
      password: password,
      date: currentDate
    };
    
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Store user's session info more persistently
    localStorage.setItem('currentUser', JSON.stringify({
      email: email,
      phoneNumber: phoneNumber,
      name: name
    }));
    
    // Also keep in sessionStorage for current session
    sessionStorage.setItem('currentUser', JSON.stringify({
      email: email,
      phoneNumber: phoneNumber,
      name: name
    }));
    
    // Try to save user to Supabase if it's configured
    try {
      const { error } = await supabase
        .from('registered_users')
        .insert([
          {
            email: email,
            phone_number: phoneNumber,
            name: name,
            registration_date: currentDate,
          }
        ]);
        
      if (error) {
        console.error("Erreur Supabase:", error);
        // Continue even if Supabase fails, as user is saved locally
      }
    } catch (supabaseError) {
      console.error("Erreur de connexion Supabase:", supabaseError);
      // This catch specifically handles Supabase connection errors
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

export const loginUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    // Récupérer les utilisateurs du localStorage
    const existingUsersData = localStorage.getItem('registeredUsers');
    
    if (!existingUsersData) {
      toast({
        title: "Erreur",
        description: "Aucun utilisateur trouvé. Veuillez créer un compte.",
        variant: "destructive"
      });
      return false;
    }
    
    const existingUsers: RegisteredUser[] = JSON.parse(existingUsersData);
    
    // Rechercher l'utilisateur par email
    const user = existingUsers.find(user => user.email === email);
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Adresse email non trouvée. Veuillez vérifier vos identifiants.",
        variant: "destructive"
      });
      return false;
    }
    
    // Vérifier le mot de passe (dans un environnement réel, nous utiliserions une méthode sécurisée)
    if (user.password && user.password !== password) {
      toast({
        title: "Erreur",
        description: "Mot de passe incorrect. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    }
    
    // Stocker les informations de l'utilisateur dans la session
    localStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name
    }));
    
    sessionStorage.setItem('currentUser', JSON.stringify({
      email: user.email,
      phoneNumber: user.phoneNumber,
      name: user.name
    }));
    
    toast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté. Vous pouvez passer votre commande.",
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
      variant: "destructive"
    });
    return false;
  }
};

export const getCurrentUser = () => {
  // First check sessionStorage (current session)
  const sessionUser = sessionStorage.getItem('currentUser');
  if (sessionUser) {
    return JSON.parse(sessionUser);
  }
  
  // If not in session, check localStorage (persistent)
  const localUser = localStorage.getItem('currentUser');
  if (localUser) {
    // Also set in sessionStorage for this session
    sessionStorage.setItem('currentUser', localUser);
    return JSON.parse(localUser);
  }
  
  return null;
};

export const logoutUser = () => {
  sessionStorage.removeItem('currentUser');
  localStorage.removeItem('currentUser');
  
  toast({
    title: "Déconnexion réussie",
    description: "Vous avez été déconnecté avec succès.",
  });
  
  return true;
};

export const getAllUsers = (): RegisteredUser[] => {
  try {
    const usersData = localStorage.getItem('registeredUsers');
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return [];
  }
};
