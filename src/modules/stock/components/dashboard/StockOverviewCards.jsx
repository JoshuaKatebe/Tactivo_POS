import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, AlertTriangle, DollarSign, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { stockApi } from "@/api/stock";
import { shopApi } from "@/api/shop";

export default function StockOverviewCards() {
  const { employee } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    salesToday: 0,
    suppliers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!employee?.station_id) return;
      try {
        // Fetch products for counting
        const productsRes = await stockApi.getProducts({ station_id: employee.station_id });
        const products = productsRes.data || productsRes || [];

        const totalProducts = products.length;
        const lowStock = products.filter(p => p.stock_qty <= (p.threshold || 10)).length;

        // Fetch sales for today
        // Assuming shopApi.getSales supports date filtering. If not, we filter client side.
        // For efficiency, a specialized 'dashboard/stats' endpoint is better, but we use what we have.
        const salesRes = await shopApi.getSales({
          station_id: employee.station_id,
          // Simple date check
          start_date: new Date().toISOString().split('T')[0]
        });
        const sales = salesRes.data || salesRes || [];
        const salesToday = sales.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);

        setStats({
          totalProducts,
          lowStock,
          salesToday,
          suppliers: 0 // Future feature
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    fetchStats();
  }, [employee?.station_id]);

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Sales Today",
      value: `ZMW ${stats.salesToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Active Suppliers",
      value: stats.suppliers,
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {cards.map(({ label, value, icon: Icon, color, bg }, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="hover:shadow-xl transition-all bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-300/20 dark:border-slate-700/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

