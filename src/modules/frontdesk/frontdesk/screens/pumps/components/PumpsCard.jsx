import React from "react";
import NozzleCard from "./NozzleCard";

export default function PumpsCard({ nozzles = [], onNozzleClick }) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Pumps</h3>
        <div className="text-sm text-slate-500">{nozzles.length} nozzles</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {nozzles.map((n) => (
          <NozzleCard key={`${n.pumpId}-${n.number}`} nozzle={n} onClick={onNozzleClick} />
        ))}
        {nozzles.length === 0 && <div className="text-sm text-slate-500 col-span-full">No nozzles configured</div>}
      </div>
    </div>
  );
}