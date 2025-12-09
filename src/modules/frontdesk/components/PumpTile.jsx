import { motion } from "framer-motion";

export default function PumpTile({ pump }) {
  const statusColors = {
    IDLE: "text-blue-400 border-blue-500/40",
    NOZZLE: "text-yellow-400 border-yellow-500/40",
    FILLING: "text-green-400 border-green-500/40 animate-pulse",
    OFFLINE: "text-red-400 border-red-500/40",
    "NO CONNECTION": "text-gray-400 border-gray-500/40",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`p-5 rounded-xl border bg-slate-900/40 backdrop-blur-md cursor-pointer select-none transition
        ${statusColors[pump.Status]}`}
    >
      <div className="text-lg font-bold">Pump {pump.Id}</div>

      <div className="mt-2 text-sm opacity-80">Status: {pump.Status}</div>

      <div className="mt-3 text-xl font-semibold">{pump.Amount} ZMW</div>
      <div className="text-sm opacity-70">{pump.Volume} L</div>
    </motion.div>
  );
}
