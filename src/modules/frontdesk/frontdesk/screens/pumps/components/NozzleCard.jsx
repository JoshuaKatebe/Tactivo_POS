import React from "react";
import { Fuel, Loader2, Wrench, AlertTriangle, Droplet } from "lucide-react";

export default function NozzleCard({ nozzle, onClick }) {
  const status = (nozzle.status || "idle").toLowerCase();

  const metaForStatus = {
    filling: { Icon: Loader2, label: "Filling", color: "text-white bg-amber-600", iconClass: "animate-spin" },
    idle: { Icon: Fuel, label: "Idle", color: "text-white bg-emerald-600", iconClass: "" },
    maintenance: { Icon: Wrench, label: "Maintenance", color: "text-white bg-red-600", iconClass: "" },
    offline: { Icon: AlertTriangle, label: "Offline", color: "text-white bg-gray-600", iconClass: "" },
  };

  const meta = metaForStatus[status] || metaForStatus.idle;
  const Icon = meta.Icon || Droplet;

  // use displayLabel/displayNumber if provided (fallback to nozzle.number)
  const label = nozzle.displayLabel || `Pump ${nozzle.number}`;
  const displayNumber = nozzle.displayNumber ?? nozzle.number;

  return (
    <button
      type="button"
      onClick={() => onClick?.(nozzle)}
      aria-label={`${label} - ${meta.label}`}
      className={`aspect-square w-full max-w-[160px] p-3 rounded-lg border shadow-sm
                  flex flex-col items-center justify-between gap-2 text-slate-900
                  hover:scale-105 transition-transform bg-white`}
      title={`${label}`}
    >
      <div className="w-full text-left">
        <div className="text-xs font-medium text-slate-600">{nozzle.pumpName || nozzle.pumpId}</div>
        <div className="text-sm font-semibold">{label}</div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Icon className={`w-12 h-12 ${meta.iconClass} text-slate-700`} />
      </div>

      <div className="w-full flex flex-col items-center gap-1">
        <div className={`px-3 py-1 text-xs rounded-full ${meta.color} font-semibold`}>
          {meta.label}
        </div>

        <div className="w-full flex items-center justify-between text-xs text-slate-600">
          <div className="truncate">{nozzle.attendant || "—"}</div>
          <div className="font-semibold">{nozzle.currentSale ? `ZMW ${Number(nozzle.currentSale).toFixed(2)}` : ""}</div>
        </div>
      </div>
    </button>
  );
}