import React from "react";
import { Fuel, Loader2, Wrench, AlertTriangle, Droplet } from "lucide-react";

export default function NozzleCard({ nozzle, onClick, darkMode = false }) {
  const status = (nozzle.status || "idle").toLowerCase();

  const metaForStatus = {
    filling: { Icon: Loader2, label: "Filling", color: "text-white bg-amber-600", iconClass: "animate-spin", isWorking: true },
    idle: { Icon: Fuel, label: "Idle", color: "text-white bg-emerald-600", iconClass: "", isWorking: true },
    maintenance: { Icon: Wrench, label: "Maintenance", color: "text-white bg-orange-600", iconClass: "", isWorking: false },
    offline: { Icon: AlertTriangle, label: "Offline", color: "text-white bg-gray-600", iconClass: "", isWorking: false },
  };

  const meta = metaForStatus[status] || metaForStatus.idle;
  const Icon = meta.Icon || Droplet;
  
  // Add visual indicator for non-working pumps
  const isWorking = meta.isWorking !== false;

  // use displayLabel/displayNumber if provided (fallback to nozzle.number)
  const label = nozzle.displayLabel || `Pump ${nozzle.number}`;
  const displayNumber = nozzle.displayNumber ?? nozzle.number;

  const buttonClass = darkMode
    ? `aspect-square w-full p-2 rounded-lg border border-slate-700 shadow-sm
       flex flex-col items-center justify-between gap-2 text-white
       hover:scale-105 transition-transform bg-slate-700/50
       ${!isWorking ? 'opacity-75 border-red-500/50' : ''}`
    : `aspect-square w-full max-w-[160px] p-3 rounded-lg border shadow-sm
       flex flex-col items-center justify-between gap-2 text-slate-900
       hover:scale-105 transition-transform bg-white
       ${!isWorking ? 'opacity-75 border-red-300' : ''}`;

  const pumpNameClass = darkMode ? "text-xs font-medium text-slate-400" : "text-xs font-medium text-slate-600";
  const labelClass = darkMode ? "text-sm font-semibold text-white" : "text-sm font-semibold";
  const iconClass = darkMode ? `w-10 h-10 ${meta.iconClass} text-slate-300` : `w-12 h-12 ${meta.iconClass} text-slate-700`;
  const infoClass = darkMode ? "text-xs text-slate-400" : "text-xs text-slate-600";

  return (
    <button
      type="button"
      onClick={() => onClick?.(nozzle)}
      aria-label={`${label} - ${meta.label}`}
      className={buttonClass}
      title={`${label} - ${meta.label}${!isWorking ? ' (Not Working)' : ''}`}
    >
      <div className="w-full text-left">
        <div className={pumpNameClass}>{nozzle.pumpName || nozzle.pumpId}</div>
        <div className={labelClass}>{label}</div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Icon className={iconClass} />
      </div>

      <div className="w-full flex flex-col items-center gap-1">
        <div className={`px-3 py-1 text-xs rounded-full ${meta.color} font-semibold`}>
          {meta.label}
        </div>

        <div className={`w-full flex items-center justify-between ${infoClass}`}>
          <div className="truncate">{nozzle.attendant || "—"}</div>
          <div className="font-semibold">{nozzle.currentSale ? `ZMW ${Number(nozzle.currentSale).toFixed(2)}` : ""}</div>
        </div>
      </div>
    </button>
  );
}