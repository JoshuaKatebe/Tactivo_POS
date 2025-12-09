import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { motion } from "framer-motion";

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sticky Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="
          pt-[72px]               /* space for navbar */
          md:ml-64                /* push content aside for sidebar on desktop */
          p-6
          overflow-y-auto
          transition-all
          duration-300
          relative
          z-0
        "
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
