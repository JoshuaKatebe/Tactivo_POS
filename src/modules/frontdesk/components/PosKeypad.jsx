// PosKeypad.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import classNames from "classnames";

/**
 * PosKeypad - big neon styled keypad (Style 3)
 * props:
 *  - amountPaid, setAmountPaid
 *  - accent: "neon"
 *  - onQuickAdd(value)
 */
export default function PosKeypad({ amountPaid = "", setAmountPaid, onQuickAdd = () => {} }) {
  const press = (v) => {
    if (v === "C") return setAmountPaid("");
    setAmountPaid((prev) => {
      if (v === "." && prev.includes(".")) return prev;
      return (prev || "") + v;
    });
  };

  const bigBtnClass = "w-full h-14 rounded-lg text-lg font-semibold";

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {["7", "8", "9"].map((k) => (
          <button key={k} onClick={() => press(k)} className={classNames(bigBtnClass, "bg-slate-700 text-white hover:bg-slate-600")}>
            {k}
          </button>
        ))}
        {["4", "5", "6"].map((k) => (
          <button key={k} onClick={() => press(k)} className={classNames(bigBtnClass, "bg-slate-700 text-white hover:bg-slate-600")}>
            {k}
          </button>
        ))}
        {["1", "2", "3"].map((k) => (
          <button key={k} onClick={() => press(k)} className={classNames(bigBtnClass, "bg-slate-700 text-white hover:bg-slate-600")}>
            {k}
          </button>
        ))}
        <button onClick={() => press("0")} className={classNames(bigBtnClass, "col-span-2 bg-slate-700 text-white hover:bg-slate-600")}>0</button>
        <button onClick={() => press(".")} className={classNames(bigBtnClass, "bg-slate-700 text-white hover:bg-slate-600")}>.</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => onQuickAdd(10)} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-12 rounded-lg font-semibold">+10</button>
        <button onClick={() => onQuickAdd(50)} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-12 rounded-lg font-semibold">+50</button>
        <button onClick={() => onQuickAdd(100)} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-12 rounded-lg font-semibold">+100</button>
      </div>
    </div>
  );
}
