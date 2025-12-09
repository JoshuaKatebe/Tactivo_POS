import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCcw,
  Truck,
  BarChart3,
  LogOut,
  Fuel,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Sidebar({ module, isOpen, onClose }) {
  const location = useLocation();

  // Auto-detect current module (fuel or stock)
  const detectedModule =
    module ||
    localStorage.getItem("selectedModule") ||
    (location.pathname.includes("/fuel") ? "fuel" : "stock");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("selectedModule");
    window.location.href = "/login";
  };

  const stockNav = [
    { name: "Dashboard", path: "/stock/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/stock/products", icon: Package },
    { name: "Sales", path: "/stock/sales", icon: ShoppingCart },
    { name: "Restock", path: "/stock/restock", icon: RefreshCcw },
    { name: "Suppliers", path: "/stock/suppliers", icon: Truck },
    { name: "Reports", path: "/stock/reports", icon: BarChart3 },
  ];

  const fuelNav = [
    { name: "Dashboard", path: "/fuel/dashboard", icon: LayoutDashboard },
    { name: "Attendants", path: "/fuel/attendants", icon: Fuel },
    { name: "Transactions", path: "/fuel/transactions", icon: ShoppingCart },
    { name: "Tanks", path: "/fuel/tanks", icon: Package },
    { name: "Prices", path: "/fuel/prices", icon: RefreshCcw },
    { name: "Reports", path: "/fuel/reports", icon: BarChart3 },
  ];

  const navItems = detectedModule === "fuel" ? fuelNav : stockNav;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white shadow-xl flex-col border-r border-blue-800/30 z-40">
        {/* Header */}
        <div className="flex items-center justify-center h-20 border-b border-blue-800/30">
          <h1 className="text-2xl font-bold tracking-wide">
            {detectedModule === "fuel" ? "TACTIVO FUEL" : "TACTIVO STOCK"}
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map(({ name, path, icon: Icon }) => {
            const active = location.pathname.startsWith(path);
            return (
              <NavLink
                key={path}
                to={path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  active
                    ? "bg-blue-700/50 text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-blue-800/30"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-blue-800/30 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 w-full text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-red-600/40 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar + Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Slide-in Menu */}
            <motion.aside
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white shadow-2xl flex flex-col border-r border-blue-800/30 md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-blue-800/30">
                <h1 className="text-lg font-semibold tracking-wide">
                  {detectedModule === "fuel" ? "TACTIVO FUEL" : "TACTIVO STOCK"}
                </h1>
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-blue-800/40 transition"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navItems.map(({ name, path, icon: Icon }) => {
                  const active = location.pathname.startsWith(path);
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        active
                          ? "bg-blue-700/50 text-white shadow-md"
                          : "text-gray-300 hover:text-white hover:bg-blue-800/30"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="border-t border-blue-800/30 p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 w-full text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-red-600/40 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
