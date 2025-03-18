
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface OrderStatusBadgeProps {
  status: "completed" | "pending" | "cancelled";
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Livré</span>
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>En attente</span>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          <span>Annulé</span>
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default OrderStatusBadge;
