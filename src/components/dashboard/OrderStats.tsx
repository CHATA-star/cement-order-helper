
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPieIcon, TrendingUpIcon, Edit2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setWeeklyTotal, setMonthlyTotal } from "@/services/orderService";

const OrderStats = () => {
  const [isEditingWeekly, setIsEditingWeekly] = useState(false);
  const [isEditingMonthly, setIsEditingMonthly] = useState(false);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [tempWeekly, setTempWeekly] = useState(0);
  const [tempMonthly, setTempMonthly] = useState(0);

  const handleSaveWeekly = () => {
    setWeeklyTotal(tempWeekly);
    setIsEditingWeekly(false);
  };

  const handleSaveMonthly = () => {
    setMonthlyTotal(tempMonthly);
    setIsEditingMonthly(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes de la semaine</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setIsEditingWeekly(!isEditingWeekly);
              setTempWeekly(weeklyTotal);
            }}
          >
            <Edit2Icon className="h-4 w-4 text-cement-500" />
          </Button>
        </CardHeader>
        <CardContent>
          {isEditingWeekly ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempWeekly}
                onChange={(e) => setTempWeekly(Number(e.target.value))}
                className="text-2xl font-bold"
              />
              <Button onClick={handleSaveWeekly}>Sauvegarder</Button>
            </div>
          ) : (
            <div className="text-2xl font-bold">{weeklyTotal} tonnes</div>
          )}
          <p className="text-xs text-muted-foreground">Total des commandes cette semaine</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes du mois</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setIsEditingMonthly(!isEditingMonthly);
              setTempMonthly(monthlyTotal);
            }}
          >
            <Edit2Icon className="h-4 w-4 text-cement-500" />
          </Button>
        </CardHeader>
        <CardContent>
          {isEditingMonthly ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={tempMonthly}
                onChange={(e) => setTempMonthly(Number(e.target.value))}
                className="text-2xl font-bold"
              />
              <Button onClick={handleSaveMonthly}>Sauvegarder</Button>
            </div>
          ) : (
            <div className="text-2xl font-bold">{monthlyTotal} tonnes</div>
          )}
          <p className="text-xs text-muted-foreground">Total des commandes ce mois</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStats;
