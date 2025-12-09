import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { stockApi } from "@/api/stock";
import { useAuth } from "@/context/AuthContext";

export default function LowStockAlert() {
  const { employee } = useAuth();
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      if (!employee?.station_id) return;
      try {
        setLoading(true);
        const response = await stockApi.getLowStock(employee.station_id, 10);
        // Ensure we handle both wrapped response {data: ...} and direct array
        const data = response.data || response;
        setLowStock(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch low stock:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, [employee?.station_id]);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading alerts...</div>;
  }

  if (lowStock.length === 0) {
    return null; // Hide if no low stock items
  }

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-300/20 dark:border-slate-700/40 shadow-md">
        <CardHeader className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Low Stock Alerts
            </CardTitle>
          </div>
          <p className="text-xs text-slate-400">Items below threshold (10)</p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-600 dark:text-slate-400">Product</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-right">
                    Stock Qty
                  </TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-100/40 dark:hover:bg-slate-700/40">
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                      {item.name}
                      {item.sku && <span className="block text-xs text-slate-400">{item.sku}</span>}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-red-500">
                      {item.stock_qty}
                    </TableCell>
                    <TableCell className="text-right text-xs text-amber-600 font-medium">
                      Low Stock
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

