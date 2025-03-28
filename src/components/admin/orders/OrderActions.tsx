
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle, XCircle, Save } from "lucide-react";
import { Order } from "@/types/order";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface OrderActionsProps {
  order: Order;
  editingOrderId: string | null;
  toggleEditStatus: (id: string) => void;
  updateOrderStatus: (id: string, status: "completed" | "pending" | "cancelled") => void;
}

const OrderActions = ({ 
  order,
  editingOrderId,
  toggleEditStatus,
  updateOrderStatus 
}: OrderActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => toggleEditStatus(order.id)}
      >
        {editingOrderId === order.id ? (
          <>
            <Save className="h-4 w-4 mr-1" />
            Fermer
          </>
        ) : (
          <>
            <Edit className="h-4 w-4 mr-1" />
            Modifier statut
          </>
        )}
      </Button>
      
      {!editingOrderId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Changer statut
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem 
              className="text-green-500 cursor-pointer flex items-center gap-2" 
              onClick={() => updateOrderStatus(order.id, "completed")}
            >
              <CheckCircle className="h-4 w-4" />
              Marquer comme livré
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-amber-500 cursor-pointer flex items-center gap-2" 
              onClick={() => updateOrderStatus(order.id, "pending")}
            >
              <CheckCircle className="h-4 w-4" />
              Marquer en attente
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500 cursor-pointer flex items-center gap-2" 
              onClick={() => updateOrderStatus(order.id, "cancelled")}
            >
              <XCircle className="h-4 w-4" />
              Marquer comme annulé
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default OrderActions;
