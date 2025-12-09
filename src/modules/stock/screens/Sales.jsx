import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import SalesTable from "../components/sales/SalesTable"; // ✅ import SalesTable component

export default function Sales() {
  const [search, setSearch] = useState("");

  // Mock sales data (aligned with your stock_sales table)
  const mockSales = [
    {
      id: "1",
      product_name: "Coca-Cola 500ml",
      quantity: 12,
      total_amount: 72.0,
      sold_by: "John Doe",
      station_name: "Downtown Station",
      sold_at: "2025-10-16 09:30",
    },
    {
      id: "2",
      product_name: "Bread - Brown",
      quantity: 5,
      total_amount: 50.0,
      sold_by: "Jane Smith",
      station_name: "Airport Station",
      sold_at: "2025-10-16 10:15",
    },
  ];

  const filteredSales = mockSales.filter((sale) =>
    sale.product_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-md border border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">
            Sales Transactions
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Input
              placeholder="Search by product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <SalesTable sales={filteredSales} />
        </CardContent>
      </Card>
    </div>
  );
}

