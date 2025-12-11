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
} from "lucide-react";

export default function TopNav({ selectedNav, setSelectedNav, status = {} }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // nav items with optional route targets (frontdesk module)
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Gauge, to: "/frontdesk/dashboard" },
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
      className={`sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-all`}
    >
      {/* Top container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-base sm:text-lg truncate">Z360 POS</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = selectedNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1
                      ${active
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Status + Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Status Badges */}
            <div className="hidden sm:flex items-center gap-2">
              <StatusBadge label="Z360" ok={status.pts2} Icon={Server} />
              <StatusBadge label="Payment" ok={status.payment} Icon={CreditCard} />
              <StatusBadge label="Network" ok={status.network} Icon={Wifi} />
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={toggleMobile}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-6 h-6 text-slate-700 dark:text-slate-200" /> : <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-[400px]" : "max-h-0"}`}>
        <div className="px-4 pt-3 pb-4 space-y-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = selectedNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md transition focus:outline-none
                    ${active
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                      : "text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                >
                  <Icon className="w-5 h-5" />
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
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm ${ok ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"}`}
      role="status"
    >
      <span className={`w-2 h-2 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`} />
      {Icon ? <Icon className="w-4 h-4 opacity-80" /> : null}
      <span className="hidden sm:inline-block">{label}</span>
    </div>
  );
}
