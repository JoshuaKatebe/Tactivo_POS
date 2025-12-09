import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Fuel, Package, Boxes, Layers, LogOut, LayoutGrid, Settings, Power, ScanLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HandoverNotificationBadge from "./HandoverNotificationBadge";

export default function Header({
  currentCategory,
  setCurrentCategory,
  ptsConnected = true, // optional prop - default disconnected
  onLogout = null,
  onBackOfficeRequest = null, // optional logout handler
  onScannerRequest = null, // optional scanner handler
  stationName = null,
  companyName = null,
  userName = null,
  handoverCount = 0, // handover count
  onHandoverClick = null, // handover click handler
}) {
  const navigate = useNavigate();

  const categories = [
    { name: "all", label: "All Products", icon: LayoutGrid },
    { name: "pump", label: "Pumps", icon: Fuel },
    { name: "stock", label: "Stock", icon: Boxes },
    { name: "backoffice", label: "Back Office", icon: Settings },
  ];

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
      return;
    }
    // default logout behaviour
    localStorage.removeItem("authToken");
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-30 shadow-md">
      {/* LEFT: Branding & Navigation */}
      <div className="flex items-center gap-8">

        {/* Brand */}
        <div className="flex flex-col leading-none select-none">
          <span className="text-xl font-black text-white tracking-tight">
            {companyName || "Z360"} <span className="text-blue-500">POS</span>
          </span>
          <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
            {stationName || "Fuel Management"}
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory === cat.name;
            const isBackOffice = cat.name === "backoffice";

            return (
              <button
                key={cat.name}
                onClick={() => {
                  if (isBackOffice) {
                    if (onBackOfficeRequest) onBackOfficeRequest();
                  } else {
                    setCurrentCategory(cat.name);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all",
                  isActive && !isBackOffice
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-white/60 hover:text-white hover:bg-white/5",
                  isBackOffice && "text-slate-400 hover:text-white hover:bg-white/10 ml-2 border-l border-white/10 pl-4 rounded-none"
                )}
              >
                <Icon size={16} className={isBackOffice ? "animate-spin-slow" : ""} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: System Status & User */}
      <div className="flex items-center gap-6">

        {/* PTS Connection Status */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors",
            ptsConnected
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          )}
        >
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              ptsConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            )}
          />
          {ptsConnected ? "PTS Connected" : "PTS Offline"}
        </div>

        {/* Barcode Scanner Button */}
        {onScannerRequest && (
          <button
            onClick={onScannerRequest}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white border border-purple-500/20 hover:border-purple-500 transition-all text-xs font-bold uppercase tracking-wider"
            title="Open Barcode Scanner"
          >
            <ScanLine size={16} />
            Scan
          </button>
        )}

        {/* Handover Notification Badge */}
        {onHandoverClick && (
          <HandoverNotificationBadge
            count={handoverCount}
            onClick={onHandoverClick}
          />
        )}

        {/* Divider */}
        <div className="h-8 w-px bg-white/10" />

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-white">{userName || "Administrator"}</span>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Shift #2409</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all border border-red-500/20 hover:border-red-500"
            title="Logout"
          >
            <Power size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
