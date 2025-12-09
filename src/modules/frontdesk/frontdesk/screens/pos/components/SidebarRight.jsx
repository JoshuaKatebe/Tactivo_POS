import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Ban,
  Lock,
  Printer,
  Wallet,
  Bell,
  Tag,
} from "lucide-react";

export default function SidebarRight({
  amountPaid,
  setAmountPaid,
  total,
  clearAll,
  showToast,
  openCashDrawer,
  printReceipt = () => {},
}) {
  // -----------------------------
  // MODAL STATE
  // -----------------------------
  const [authModal, setAuthModal] = useState({
    open: false,
    type: null, // "refund" | "nosale" | "closeshift"
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // fake demo credentials (replace with backend auth later)
  const MANAGER_USER = "manager";
  const MANAGER_PASS = "1234";

  const CASHIER_USER = "cashier";
  const CASHIER_PASS = "1111";

  const openAuth = (type) => {
    setUsername("");
    setPassword("");
    setAuthModal({ open: true, type });
  };

  const closeAuth = () => setAuthModal({ open: false, type: null });

  const handleAuthSubmit = () => {
    const { type } = authModal;

    // Manager actions
    if (type === "refund" || type === "nosale") {
      if (username !== MANAGER_USER || password !== MANAGER_PASS) {
        showToast("Invalid manager credentials", "error");
        return;
      }

      closeAuth();

      if (type === "refund") {
        showToast("Refund processed", "success");
      }

      if (type === "nosale") {
        clearAll();
        showToast("No Sale — Cart cleared", "success");
      }
    }

    // Cashier Close Shift Authentication
    if (type === "closeshift") {
      if (username !== CASHIER_USER || password !== CASHIER_PASS) {
        showToast("Invalid cashier credentials", "error");
        return;
      }

      closeAuth();
      showToast("Shift closed successfully", "success");
    }
  };

  // -----------------------------
  // KEYPAD LOGIC
  // -----------------------------
  const amountString = String(amountPaid ?? "");
  const paid = parseFloat(amountString || "0");
  const change = paid > total ? paid - total : 0;

  const keypadKeys = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    ".", "0","backspace"
  ];

  const handleKeypad = (key) => {
    if (key === "backspace") {
      setAmountPaid(amountString.slice(0, -1));
      return;
    }

    if (key === ".") {
      if (!amountString.includes(".")) {
        setAmountPaid(amountString === "" ? "0." : amountString + ".");
      }
      return;
    }

    const next = amountString + key;
    const cleaned = next.replace(/^0+(?=\d)/, "");
    setAmountPaid(cleaned);
  };

  // -----------------------------
  // UI STARTS HERE
  // -----------------------------
  return (
    <div className="w-1/5 min-w-[320px] bg-gradient-to-b from-[#0d2b5c] to-[#1a3d7c]
                    border-l border-blue-600 p-4 flex flex-col gap-4 text-white">

      {/* STATUS */}
      <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-200">Status</p>
        <p className="text-3xl font-extrabold mt-1">ZMW {total.toFixed(2)}</p>
        <p className="text-sm text-blue-200 mt-1">Paid: ZMW {paid.toFixed(2)}</p>
        <p className="text-lg font-bold mt-2 text-emerald-300">
          Change: ZMW {change.toFixed(2)}
        </p>
      </div>

      {/* SAFE DROP */}
      <Button
        onClick={() => openCashDrawer?.()}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 flex items-center justify-center gap-2"
      >
        <Wallet className="w-5 h-5" />
        Safe Drop
      </Button>

      {/* KEYPAD */}
      <div className="grid grid-cols-3 gap-2 flex-1">
        {keypadKeys.map(key => (
          <Button
            key={key}
            onClick={() => handleKeypad(key)}
            className="bg-white/10 hover:bg-white/20 border border-white/20
                       text-white text-xl font-bold py-6 rounded-lg"
          >
            {key === "backspace" ? "⌫" : key}
          </Button>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3">

        {/* REFUND (manager auth required) */}
        <Button
          onClick={() => openAuth("refund")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Refund
        </Button>

        {/* NO SALE (manager auth required) */}
        <Button
          onClick={() => openAuth("nosale")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 flex items-center gap-2"
        >
          <Ban className="w-4 h-4" />
          No Sale
        </Button>

        {/* CLOSE SHIFT (cashier auth required) */}
        <Button
          onClick={() => openAuth("closeshift")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Close Shift
        </Button>

        {/* REPRINT */}
        <Button
          onClick={() => printReceipt()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Reprint
        </Button>

        {/* ALERTS */}
        <Button
          onClick={() => showToast("Showing alerts...", "success")}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Alerts
        </Button>

        {/* PRICE */}
        <Button
          onClick={() => printReceipt()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 flex items-center gap-2"
        >
          <Tag className="w-4 h-4" />
          Price
        </Button>
      </div>

      {/* AUTH MODAL */}
      {authModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 text-black shadow-2xl">

            <h2 className="text-lg font-bold mb-3">
              {authModal.type === "closeshift"
                ? "Cashier Authentication"
                : "Manager Authentication"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <Button onClick={closeAuth} className="bg-gray-300 text-black px-4">
                Cancel
              </Button>

              <Button onClick={handleAuthSubmit} className="bg-blue-600 text-white px-4">
                Confirm
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
