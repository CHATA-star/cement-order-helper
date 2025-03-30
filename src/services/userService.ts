
import { supabase } from "@/lib/supabase";
import { getAllUsers } from "./registrationService";

export interface SupabaseUser {
  id: number;
  email: string;
  phone_number: string;
  name?: string;
  registration_date: string;
  created_at: string;
}

export const fetchRegisteredUsers = async (): Promise<SupabaseUser[]> => {
  try {
    const { data, error } = await supabase
      .from('registered_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return []; // Return empty array instead of throwing
    }

    return data || [];
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    return []; // Return empty array in case of connection error
  }
};

export const syncLocalUsersToSupabase = async (): Promise<void> => {
  try {
    // Récupérer les utilisateurs du localStorage via la fonction getAllUsers
    const localUsers = getAllUsers();
    if (localUsers.length === 0) return;
    
    // Pour chaque utilisateur local, vérifier s'il existe dans Supabase
    for (const user of localUsers) {
      try {
        // Vérifier si l'utilisateur existe déjà dans Supabase
        const { data } = await supabase
          .from('registered_users')
          .select('*')
          .eq('email', user.email)
          .single();
        
        // Si l'utilisateur n'existe pas, l'ajouter à Supabase
        if (!data) {
          await supabase
            .from('registered_users')
            .insert([
              {
                email: user.email,
                phone_number: user.phoneNumber || '',
                name: user.name || '',
                registration_date: user.date
              }
            ]);
        }
      } catch (error) {
        console.warn(`Erreur lors de la synchronisation pour l'utilisateur ${user.email}:`, error);
        // Continue with other users even if one fails
        continue;
      }
    }
    
    console.log('Synchronisation des utilisateurs terminée');
  } catch (error) {
    console.error('Erreur lors de la synchronisation des utilisateurs:', error);
    // Do not rethrow to prevent app from crashing
  }
};
