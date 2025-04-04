
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActions from "./OrderActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface OrdersTableProps {
  orders: Order[];
  editingOrderId: string | null;
  toggleEditStatus: (id: string) => void;
  updateOrderStatus: (id: string, status: "completed" | "pending" | "cancelled") => void;
  deleteOrder?: (id: string) => void;
  addOrder?: (order: Omit<Order, "id">) => void;
}

const OrdersTable = ({ 
  orders, 
  editingOrderId, 
  toggleEditStatus, 
  updateOrderStatus,
  deleteOrder,
  addOrder
}: OrdersTableProps) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      client: "",
      city: "",
      quantity: 0,
      status: "pending" as const,
    }
  });

  const onSubmit = (data) => {
    if (addOrder) {
      // Add current date to the order
      const newOrder = {
        ...data,
        date: new Date().toISOString().split('T')[0]
      };
      
      addOrder(newOrder);
      
      // Reset form
      form.reset();
      
      // Show success toast
      toast({
        title: "Commande ajoutée",
        description: "La nouvelle commande a été ajoutée avec succès"
      });
    }
  };
  
  const handleDeleteOrder = (id: string) => {
    if (deleteOrder) {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
        deleteOrder(id);
        toast({
          title: "Commande supprimée",
          description: "La commande a été supprimée avec succès"
        });
      }
    }
  };
  
  return (
    <div className="border rounded-md">
      {addOrder && (
        <div className="p-4 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une commande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle commande</DialogTitle>
                <DialogDescription>
                  Complétez les détails de la commande ci-dessous et cliquez sur Enregistrer.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du client" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Ville de livraison" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantité (tonnes)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="completed">Livré</SelectItem>
                              <SelectItem value="cancelled">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Enregistrer la commande</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[180px]">Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>{order.city}</TableCell>
                <TableCell>{order.quantity} tonnes</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {editingOrderId === order.id ? (
                    <Select 
                      defaultValue={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value as "completed" | "pending" | "cancelled")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Changer le statut" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="completed">Livré</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div onClick={() => toggleEditStatus(order.id)} className="cursor-pointer">
                      <OrderStatusBadge status={order.status} />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <OrderActions 
                      order={order} 
                      editingOrderId={editingOrderId}
                      toggleEditStatus={toggleEditStatus}
                      updateOrderStatus={updateOrderStatus}
                    />
                    {deleteOrder && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Aucune commande trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
