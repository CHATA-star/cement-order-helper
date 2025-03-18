
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActions from "./OrderActions";

interface OrdersTableProps {
  orders: Order[];
  editingOrderId: string | null;
  toggleEditStatus: (id: string) => void;
  updateOrderStatus: (id: string, status: "completed" | "pending" | "cancelled") => void;
}

const OrdersTable = ({ 
  orders, 
  editingOrderId, 
  toggleEditStatus, 
  updateOrderStatus 
}: OrdersTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
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
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="completed">Livré</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <OrderStatusBadge status={order.status} />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <OrderActions 
                    order={order} 
                    editingOrderId={editingOrderId}
                    toggleEditStatus={toggleEditStatus}
                    updateOrderStatus={updateOrderStatus}
                  />
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
