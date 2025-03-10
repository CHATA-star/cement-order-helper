
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPieIcon, TrendingUpIcon } from "lucide-react";
import { getWeeklyTotal, getMonthlyTotal } from "@/services/orderService";

const OrderStats = () => {
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    setWeeklyTotal(getWeeklyTotal());
    setMonthlyTotal(getMonthlyTotal());
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes de la semaine</CardTitle>
          <ChartPieIcon className="h-4 w-4 text-cement-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyTotal} tonnes</div>
          <p className="text-xs text-muted-foreground">Total des commandes cette semaine</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes du mois</CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-cement-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyTotal} tonnes</div>
          <p className="text-xs text-muted-foreground">Total des commandes ce mois</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStats;
