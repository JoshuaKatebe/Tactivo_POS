// ProductGrid.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function ProductGrid({
  products = [],
  onAdd,
  search = "",
  category = "all",
}) {
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!search) return true;
      return p.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search, category]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {filtered.map((p) => (
        <motion.button
          key={p.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAdd(p)}
          className="bg-slate-700 hover:bg-blue-700 text-white rounded-xl p-4 flex flex-col items-center justify-center shadow-md transition"
        >
          <div className="text-3xl">{p.icon}</div>
          <div className="text-sm font-semibold mt-1">{p.name}</div>
          <div className="text-xs text-slate-300">ZMW {p.price}</div>
        </motion.button>
      ))}
    </div>
  );
}
