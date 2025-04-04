
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OrderSearchProps {
  searchTerm?: string;
  onSearch: (term: string) => void;
}

const OrderSearch = ({ searchTerm = "", onSearch }: OrderSearchProps) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Rechercher une commande..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default OrderSearch;
