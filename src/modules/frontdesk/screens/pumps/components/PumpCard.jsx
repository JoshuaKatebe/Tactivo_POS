import React from "react";
import { Fuel, Loader2, AlertTriangle } from "lucide-react";

export default function PumpCard({ pump, onNozzleClick, darkMode = false }) {
    // Determine overall pump status based on nozzles
    const hasFillingNozzle = pump.nozzles.some((n) => n.status === "filling");
    const allOffline = pump.nozzles.every((n) => n.status === "offline");
    const pumpStatus = allOffline ? "offline" : hasFillingNozzle ? "filling" : "idle";

    const cardClass = darkMode
        ? "bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-sm"
        : "bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow";

    const headerClass = darkMode ? "text-white" : "text-slate-900";
    const subTextClass = darkMode ? "text-slate-400" : "text-slate-600";
    const gradeClass = darkMode ? "text-slate-300" : "text-slate-700";

    // Status colors
    const statusColors = {
        filling: darkMode ? "bg-amber-600 text-white" : "bg-amber-500 text-white",
        idle: darkMode ? "bg-emerald-600 text-white" : "bg-emerald-500 text-white",
        offline: darkMode ? "bg-gray-600 text-white" : "bg-gray-500 text-white",
    };

    const StatusIcon = pumpStatus === "filling" ? Loader2 : pumpStatus === "offline" ? AlertTriangle : Fuel;
    const iconClass = pumpStatus === "filling" ? "animate-spin" : "";

    return (
        <div className={cardClass}>
            {/* Pump Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-semibold ${headerClass}`}>{pump.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[pumpStatus]}`}>
                            <StatusIcon className={`inline w-3 h-3 mr-1 ${iconClass}`} />
                            {pumpStatus.charAt(0).toUpperCase() + pumpStatus.slice(1)}
                        </span>
                    </div>
                    <div className={`text-sm ${gradeClass} flex items-center gap-2 mt-1`}>
                        <span>{pump.grade}</span>
                        <span className="text-xs">•</span>
                        <span className="font-semibold">ZMW {Number(pump.price || 0).toFixed(2)}/L</span>
                    </div>
                </div>
            </div>

            {/* Nozzles */}
            <div className="space-y-2">
                {pump.nozzles.map((nozzle) => (
                    <NozzleDisplay
                        key={nozzle.number}
                        nozzle={nozzle}
                        pump={pump}
                        onClick={() => onNozzleClick?.({ ...nozzle, pumpId: pump.id, pumpName: pump.name, grade: pump.grade, price: pump.price })}
                        darkMode={darkMode}
                    />
                ))}
            </div>
        </div>
    );
}

function NozzleDisplay({ nozzle, pump, onClick, darkMode }) {
    const status = (nozzle.status || "idle").toLowerCase();

    const nozzleClass = darkMode
        ? "flex items-center justify-between p-2 rounded-md border border-slate-600 hover:bg-slate-700 cursor-pointer transition-colors"
        : "flex items-center justify-between p-2 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors";

    const labelClass = darkMode ? "text-sm font-medium text-white" : "text-sm font-medium text-slate-900";
    const infoClass = darkMode ? "text-xs text-slate-400" : "text-xs text-slate-600";

    // Status badge colors
    const statusColors = {
        filling: darkMode ? "bg-amber-600/20 text-amber-300 border-amber-600/50" : "bg-amber-50 text-amber-700 border-amber-200",
        idle: darkMode ? "bg-emerald-600/20 text-emerald-300 border-emerald-600/50" : "bg-emerald-50 text-emerald-700 border-emerald-200",
        offline: darkMode ? "bg-gray-600/20 text-gray-300 border-gray-600/50" : "bg-gray-50 text-gray-700 border-gray-200",
    };

    const isFilling = status === "filling";

    return (
        <button type="button" onClick={onClick} className={nozzleClass}>
            <div className="flex items-center gap-3 flex-1">
                <div className={`px-2 py-1 rounded border text-xs font-semibold ${statusColors[status] || statusColors.idle}`}>
                    Nozzle {nozzle.number}
                </div>

                {isFilling && (
                    <div className="flex items-center gap-3">
                        <div className={infoClass}>
                            <span className="font-semibold">{Number(nozzle.currentLiters || 0).toFixed(1)}L</span>
                        </div>
                        <div className={labelClass}>
                            ZMW {Number(nozzle.currentSale || 0).toFixed(2)}
                        </div>
                    </div>
                )}

                {nozzle.attendant && (
                    <div className={infoClass}>
                        {nozzle.attendant}
                    </div>
                )}
            </div>

            {isFilling && (
                <Loader2 className={`w-4 h-4 animate-spin ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            )}
        </button>
    );
}