
import { supabase } from "@/lib/supabase";

export interface SupabaseUser {
  id: number;
  email: string;
  phone_number: string;
  registration_date: string;
  created_at: string;
}

export const fetchRegisteredUsers = async (): Promise<SupabaseUser[]> => {
  const { data, error } = await supabase
    .from('registered_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw new Error('Impossible de récupérer les utilisateurs');
  }

  return data || [];
};

export const syncLocalUsersToSupabase = async (): Promise<void> => {
  try {
    // Récupérer les utilisateurs du localStorage
    const localUsersData = localStorage.getItem('registeredUsers');
    if (!localUsersData) return;
    
    const localUsers = JSON.parse(localUsersData);
    
    // Pour chaque utilisateur local, vérifier s'il existe dans Supabase
    for (const user of localUsers) {
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
              registration_date: user.date
            }
          ]);
      }
    }
    
    console.log('Synchronisation des utilisateurs terminée');
  } catch (error) {
    console.error('Erreur lors de la synchronisation des utilisateurs:', error);
  }
};
