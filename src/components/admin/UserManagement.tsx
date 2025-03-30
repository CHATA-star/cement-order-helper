
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers, RegisteredUser } from "@/services/registrationService";
import { fetchRegisteredUsers, SupabaseUser } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

// Interface combinée pour traiter les deux sources de données
interface DisplayUser {
  id: number;
  name?: string;
  email: string;
  phoneNumber?: string;
  date: string;
  source: 'local' | 'supabase';
}

const UserManagement = () => {
  const [localUsers, setLocalUsers] = useState<RegisteredUser[]>([]);
  const [displayUsers, setDisplayUsers] = useState<DisplayUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Récupérer les utilisateurs de Supabase
  const { data: supabaseUsers = [] } = useQuery({
    queryKey: ['supabaseUsers'],
    queryFn: fetchRegisteredUsers,
  });

  useEffect(() => {
    // Récupérer les utilisateurs locaux
    const users = getAllUsers();
    setLocalUsers(users);

    // Combiner les utilisateurs locaux et Supabase tout en évitant les doublons
    const combinedUsers: DisplayUser[] = [];
    const emailsAdded = new Set<string>();

    // Ajouter d'abord les utilisateurs locaux
    users.forEach(user => {
      emailsAdded.add(user.email);
      combinedUsers.push({
        id: user.id,
        name: user.name || 'Utilisateur',
        email: user.email,
        phoneNumber: user.phoneNumber,
        date: user.date,
        source: 'local'
      });
    });

    // Ajouter les utilisateurs Supabase qui ne sont pas déjà dans la liste
    supabaseUsers.forEach((user: SupabaseUser) => {
      if (!emailsAdded.has(user.email)) {
        emailsAdded.add(user.email);
        combinedUsers.push({
          id: user.id,
          email: user.email,
          phoneNumber: user.phone_number,
          date: user.registration_date || user.created_at.split('T')[0],
          source: 'supabase'
        });
      }
    });

    setDisplayUsers(combinedUsers);
  }, [supabaseUsers]);

  const filteredUsers = displayUsers.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchTerm))
  );

  const handleDeleteUser = (id: number, source: 'local' | 'supabase') => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      if (source === 'local') {
        // Supprimer de localStorage
        const updatedUsers = localUsers.filter(user => user.id !== id);
        setLocalUsers(updatedUsers);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        
        // Mettre à jour la liste d'affichage
        setDisplayUsers(displayUsers.filter(user => !(user.id === id && user.source === 'local')));
        
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé du stockage local."
        });
      } else {
        // Pour les utilisateurs Supabase, informer que la suppression n'est pas supportée dans cette interface
        toast({
          title: "Action limitée",
          description: "La suppression des utilisateurs Supabase n'est pas supportée dans cette interface.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <Button size="sm" className="bg-cement-600 hover:bg-cement-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={`${user.source}-${user.id}`}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                    <TableCell>{new Date(user.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.source === 'local' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.source === 'local' ? 'Local' : 'Supabase'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-red-500"
                          onClick={() => handleDeleteUser(user.id, user.source)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
