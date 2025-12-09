import React from "react";
import PumpCard from "./PumpCard";

export default function PumpsCard({ pumps = [], onNozzleClick, darkMode = false }) {
  const cardClass = darkMode ? "bg-slate-800 rounded-lg border border-slate-700 p-3 shadow-sm" : "bg-white rounded-lg border p-4 shadow-sm";
  const titleClass = darkMode ? "text-lg font-semibold text-white" : "text-lg font-semibold";
  const countClass = darkMode ? "text-sm text-slate-400" : "text-sm text-slate-500";
  const emptyClass = darkMode ? "text-sm text-slate-400 col-span-full" : "text-sm text-slate-500 col-span-full";
  const gridClass = darkMode ? "grid grid-cols-1 gap-2" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3";

  // Calculate total nozzles
  const totalNozzles = pumps.reduce((sum, pump) => sum + (pump.nozzles?.length || 0), 0);

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={titleClass}>Pumps</h3>
        <div className={countClass}>{pumps.length} pumps • {totalNozzles} nozzles</div>
      </div>

      <div className={gridClass}>
        {pumps.map((pump) => (
          <PumpCard key={pump.id} pump={pump} onNozzleClick={onNozzleClick} darkMode={darkMode} />
        ))}
        {pumps.length === 0 && <div className={emptyClass}>No pumps configured</div>}
      </div>
    </div>
  );
}