
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle, XCircle } from "lucide-react";
import { Order } from "@/types/order";

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
        <Edit className="h-4 w-4 mr-1" />
        {editingOrderId === order.id ? "Annuler" : "Modifier statut"}
      </Button>
      
      {!editingOrderId && order.status === "pending" && (
        <>
          <Button 
            variant="outline" 
            size="sm"
            className="text-green-500 border-green-500"
            onClick={() => updateOrderStatus(order.id, "completed")}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Livré
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-500"
            onClick={() => updateOrderStatus(order.id, "cancelled")}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Annuler
          </Button>
        </>
      )}
    </div>
  );
};

export default OrderActions;
