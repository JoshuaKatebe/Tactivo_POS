import React from "react";
import { useNavigate } from "react-router-dom";
import StockOverviewCards from "../components/dashboard/StockOverviewCards";
import LowStockAlert from "../components/dashboard/LowStockAlert";
import { Button } from "@/components/ui/button";
import { PlusCircle, Truck, PackagePlus } from "lucide-react";

export default function StockDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Stock Management Dashboard
        </h1>

        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/stock/restock")}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <Truck className="w-4 h-4 mr-2" />
            Stock In (Restock)
          </Button>
          <Button
            onClick={() => navigate("/stock/products")}
            variant="outline"
            className="border-slate-300 dark:border-slate-600"
          >
            <PackagePlus className="w-4 h-4 mr-2" />
            Manage Products
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <StockOverviewCards />

      {/* Low Stock Table */}
      <LowStockAlert />
    </div>
  );
}

