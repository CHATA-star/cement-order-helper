
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Données simulées des commandes
const mockOrders = [
  { 
    id: "CMD-001", 
    client: "Bâtiments ModernesCO", 
    quantity: 250, 
    date: "2023-09-15", 
    status: "completed", 
    city: "Dakar"
  },
  { 
    id: "CMD-002", 
    client: "Construction Rapide SARL", 
    quantity: 500, 
    date: "2023-09-18", 
    status: "pending", 
    city: "Thiès"
  },
  { 
    id: "CMD-003", 
    client: "EcoHabitat Inc", 
    quantity: 150, 
    date: "2023-09-20", 
    status: "cancelled", 
    city: "Saint-Louis"
  },
  { 
    id: "CMD-004", 
    client: "Immobilier Premium", 
    quantity: 1000, 
    date: "2023-09-22", 
    status: "pending", 
    city: "Mbour"
  },
];

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
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

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Gestion des commandes</CardTitle>
          <Button size="sm" className="bg-cement-600 hover:bg-cement-700">
            <FileText className="mr-2 h-4 w-4" />
            Exporter les commandes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une commande..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.client}</TableCell>
                    <TableCell>{order.city}</TableCell>
                    <TableCell>{order.quantity} tonnes</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === "pending" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-500 border-green-500"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Marquer livré
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
                        {order.status === "completed" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-amber-500 border-amber-500"
                            onClick={() => updateOrderStatus(order.id, "pending")}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Remettre en attente
                          </Button>
                        )}
                        {order.status === "cancelled" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-amber-500 border-amber-500"
                            onClick={() => updateOrderStatus(order.id, "pending")}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Réactiver
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
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
