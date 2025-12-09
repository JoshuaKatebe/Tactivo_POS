import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Radio,
  Server,
  Wifi,
  CreditCard,
  Gauge,
  Droplet,
  FileText,
  Clock,
  Settings,
  Menu,
  X,
  Play,
} from "lucide-react";

export default function TopNav({ selectedNav, setSelectedNav, status = {} }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // nav items with optional route targets (frontdesk module)
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Gauge, to: "/frontdesk/dashboard" },
    { id: "simulator", label: "Pump Simulator", icon: Play, to: "/frontdesk/simulator" },
    { id: "pumps", label: "Forecourt", icon: Droplet, to: "/frontdesk/pumps" },
    { id: "tanks", label: "Tanks", icon: Droplet, to: "/frontdesk/tanks" },
    { id: "pos", label: "POS", icon: CreditCard, to: "/frontdesk/pos" },
    { id: "shifts", label: "Shifts", icon: Clock, to: "/frontdesk/shifts" },
    { id: "reports", label: "Reports", icon: FileText, to: "/frontdesk/reports" },
    { id: "settings", label: "Settings", icon: Settings, to: "/frontdesk/settings" },
  ];

  const toggleMobile = () => setMobileOpen((s) => !s);

  // Sync selectedNav with current URL (so active state reflects route)
  useEffect(() => {
    const match = navItems.find((n) => location.pathname.startsWith(n.to));
    if (match) setSelectedNav?.(match.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleNavClick = (item) => {
    setSelectedNav?.(item.id);
    setMobileOpen(false);
    if (item.to) navigate(item.to);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-700/50 dark:border-slate-800 shadow-lg backdrop-blur-sm transition-all`}
    >
      {/* Top container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-lg">
                  <Radio className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl text-white tracking-tight">Tactivo</span>
                <span className="text-xs text-blue-400 font-medium -mt-1">POS System</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1 bg-slate-800/50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = selectedNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                      ${active
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50 dark:hover:bg-slate-800/50"
                      }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-white" : ""}`} />
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Status + Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Status Badges */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <StatusBadge label="PTS2" ok={status.pts2} Icon={Server} />
              <StatusBadge label="Payment" ok={status.payment} Icon={CreditCard} />
              <StatusBadge label="Network" ok={status.network} Icon={Wifi} />
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-lg bg-slate-800/50 dark:bg-slate-900/50 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={toggleMobile}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-slate-800/95 dark:bg-slate-900/95 border-t border-slate-700/50 overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-sm ${mobileOpen ? "max-h-[400px]" : "max-h-0"}`}>
        <div className="px-4 pt-3 pb-4 space-y-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = selectedNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${active
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50 dark:hover:bg-slate-800/50"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-white" : ""}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({ label, ok, Icon }) {
  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${ok
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}
      role="status"
    >
      <span className={`w-2 h-2 rounded-full ${ok ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
      {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
      <span className="hidden sm:inline-block">{label}</span>
    </div>
  );
}
