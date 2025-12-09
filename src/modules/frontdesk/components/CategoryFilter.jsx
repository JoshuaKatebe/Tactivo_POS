// CategoryFilter.jsx
import React from "react";
import { Button } from "@/components/ui/button";

/**
 * CategoryFilter - simple pills
 */
export default function CategoryFilter({ category, setCategory }) {
  const categories = [
    { id: "all", label: "All" },
    { id: "fuel", label: "Fuel" },
    { id: "drinks", label: "Drinks" },
    { id: "snacks", label: "Snacks" },
    { id: "food", label: "Food" },
  ];

  return (
    <div className="flex items-center gap-2">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => setCategory(c.id)}
          className={`px-3 py-1 rounded text-sm font-medium ${category === c.id ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
