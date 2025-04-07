
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActions from "./OrderActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Plus, Save, Trash, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrdersTableProps {
  orders: Order[];
  editingOrderId: string | null;
  toggleEditStatus: (id: string) => void;
  updateOrderStatus: (id: string, status: "completed" | "pending" | "cancelled") => void;
  deleteOrder?: (id: string) => void;
  addOrder?: (order: Omit<Order, "id">) => void;
  updateOrderDetails?: (id: string, updates: Partial<Order>) => void;
}

const OrdersTable = ({ 
  orders, 
  editingOrderId, 
  toggleEditStatus, 
  updateOrderStatus,
  deleteOrder,
  addOrder,
  updateOrderDetails
}: OrdersTableProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const form = useForm({
    defaultValues: {
      client: "",
      city: "",
      quantity: 0,
      status: "pending" as const,
    }
  });
  
  // État pour suivre quelle commande est en cours d'édition complète
  const [editingFullOrderId, setEditingFullOrderId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Order>>({});
  
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
  
  // Fonction pour commencer l'édition complète d'une commande
  const startEditOrder = (order: Order) => {
    setEditingFullOrderId(order.id);
    setEditFormData({
      client: order.client,
      city: order.city,
      quantity: order.quantity,
      date: order.date
    });
  };
  
  // Fonction pour annuler l'édition
  const cancelEditOrder = () => {
    setEditingFullOrderId(null);
    setEditFormData({});
  };
  
  // Fonction pour mettre à jour les données du formulaire d'édition
  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Fonction pour sauvegarder les modifications
  const saveOrderChanges = (id: string) => {
    if (updateOrderDetails && editFormData) {
      updateOrderDetails(id, editFormData);
      setEditingFullOrderId(null);
      setEditFormData({});
      
      toast({
        title: "Commande mise à jour",
        description: "Les détails de la commande ont été mis à jour avec succès"
      });
    }
  };
  
  const renderMobileOrderCard = (order: Order) => (
    <div className="border rounded-lg mb-3 overflow-hidden bg-white">
      <div className="bg-cement-100 p-2 flex items-center justify-between">
        <div>
          <span className="text-xs text-cement-500">ID: </span>
          <span className="font-semibold text-sm">{order.id}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <div className="p-3 space-y-2 text-sm">
        {editingFullOrderId === order.id ? (
          <>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium">Client:</label>
                <Input 
                  value={editFormData.client || ''}
                  onChange={(e) => handleEditFormChange('client', e.target.value)}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Ville:</label>
                <Input 
                  value={editFormData.city || ''}
                  onChange={(e) => handleEditFormChange('city', e.target.value)}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Quantité (tonnes):</label>
                <Input 
                  type="number"
                  value={editFormData.quantity || 0}
                  onChange={(e) => handleEditFormChange('quantity', Number(e.target.value))}
                  className="h-8 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Date:</label>
                <Input 
                  type="date"
                  value={editFormData.date ? editFormData.date.split('T')[0] : ''}
                  onChange={(e) => handleEditFormChange('date', e.target.value)}
                  className="h-8 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={cancelEditOrder}
                className="h-7 text-xs"
              >
                <X className="h-3 w-3 mr-1" /> Annuler
              </Button>
              <Button 
                size="sm" 
                onClick={() => saveOrderChanges(order.id)}
                className="h-7 text-xs"
              >
                <Save className="h-3 w-3 mr-1" /> Enregistrer
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="font-medium">Client:</span> 
              <span>{order.client}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ville:</span> 
              <span>{order.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Quantité:</span> 
              <span>{order.quantity} tonnes</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span> 
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
          </>
        )}
      </div>
      {!editingFullOrderId && (
        <div className="border-t p-2 flex justify-between gap-2">
          {editingOrderId === order.id ? (
            <Select 
              defaultValue={order.status}
              onValueChange={(value) => updateOrderStatus(order.id, value as "completed" | "pending" | "cancelled")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Changer le statut" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="completed">Livré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <>
              <div className="flex gap-2">
                <OrderActions 
                  order={order} 
                  editingOrderId={editingOrderId}
                  toggleEditStatus={toggleEditStatus}
                  updateOrderStatus={updateOrderStatus}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => startEditOrder(order)}
                  className="text-xs px-2 py-1 h-8"
                >
                  <Pencil className="h-3 w-3 mr-1" /> Modifier
                </Button>
              </div>
              {deleteOrder && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteOrder(order.id)}
                  className="text-xs px-2 py-1 h-8"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
  
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
      
      {isMobile ? (
        <div className="p-2">
          {orders.length > 0 ? (
            orders.map((order) => renderMobileOrderCard(order))
          ) : (
            <div className="text-center py-4 text-gray-500">
              Aucune commande trouvée
            </div>
          )}
        </div>
      ) : (
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
                  <TableCell>
                    {editingFullOrderId === order.id ? (
                      <Input 
                        value={editFormData.client || ''} 
                        onChange={(e) => handleEditFormChange('client', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      order.client
                    )}
                  </TableCell>
                  <TableCell>
                    {editingFullOrderId === order.id ? (
                      <Input 
                        value={editFormData.city || ''} 
                        onChange={(e) => handleEditFormChange('city', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      order.city
                    )}
                  </TableCell>
                  <TableCell>
                    {editingFullOrderId === order.id ? (
                      <Input 
                        type="number" 
                        value={editFormData.quantity || 0} 
                        onChange={(e) => handleEditFormChange('quantity', Number(e.target.value))}
                        className="h-8 w-24"
                      />
                    ) : (
                      `${order.quantity} tonnes`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingFullOrderId === order.id ? (
                      <Input 
                        type="date" 
                        value={editFormData.date ? editFormData.date.split('T')[0] : ''} 
                        onChange={(e) => handleEditFormChange('date', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      new Date(order.date).toLocaleDateString()
                    )}
                  </TableCell>
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
                    {editingFullOrderId === order.id ? (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={cancelEditOrder}
                        >
                          <X className="h-4 w-4 mr-1" /> Annuler
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => saveOrderChanges(order.id)}
                        >
                          <Save className="h-4 w-4 mr-1" /> Enregistrer
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <OrderActions 
                          order={order} 
                          editingOrderId={editingOrderId}
                          toggleEditStatus={toggleEditStatus}
                          updateOrderStatus={updateOrderStatus}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => startEditOrder(order)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Modifier
                        </Button>
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
                    )}
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
      )}
    </div>
  );
};

export default OrdersTable;
