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
  AlertTriangle,
  X,
  Fuel
} from "lucide-react";
import PumpsPage from "@/modules/frontdesk/screens/pumps/PumpsPage";

export default function SidebarRight({
  amountPaid,
  setAmountPaid,
  total,
  clearAll,
  showToast,
  openCashDrawer,
  printReceipt = () => { },
  onLogout, // actual prop name passed from parent
  pumps = [], // pumps data from POS
  onClearTransaction = null, // callback for clearing transactions
}) {
  // -----------------------------
  // MODAL STATE
  // -----------------------------
  const [authModal, setAuthModal] = useState({
    open: false,
    type: null, // "refund" | "nosale" | "closeshift"
  });

  const [alertsOpen, setAlertsOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // fake demo credentials (replace with backend auth later)
  const MANAGER_USER = "manager";
  const MANAGER_PASS = "12345"; // Updated to match Pos.jsx

  const CASHIER_USER = "admin"; // Updated to match Pos.jsx logic if needed, or keeping separate. Let's match Home.jsx default
  const CASHIER_PASS = "password123";

  const openAuth = (type) => {
    setUsername("");
    setPassword("");
    setAuthModal({ open: true, type });
  };

  const closeAuth = () => setAuthModal({ open: false, type: null });

  const handleAuthSubmit = () => {
    const { type } = authModal;

    // Manager actions (Refund, No Sale)
    if (type === "refund" || type === "nosale") {
      // In a real app, you'd check a "role" or specific user list.
      // For this demo, valid manager is manager/12345
      if (username !== MANAGER_USER || password !== MANAGER_PASS) {
        showToast("Access Denied: Manager authorization required", "error");
        return;
      }

      closeAuth();

      if (type === "refund") {
        showToast("Refund Authorized & Processed", "success");
        // Logic to process refund would go here
      }

      if (type === "nosale") {
        clearAll();
        showToast("No Sale Executed: Cart Cleared", "success");
      }
    }

    // Cashier Close Shift Authentication
    if (type === "closeshift") {
      // Allow current cashier to close using their own credentials
      if (username !== CASHIER_USER || password !== CASHIER_PASS) {
        showToast("Invalid credentials for Shift Close", "error");
        return;
      }

      closeAuth();
      showToast("Shift Closed Successfully", "success");
      if (onLogout) onLogout();
    }
  };

  // -----------------------------
  // ALERTS MOCK DATA
  // -----------------------------
  const MOCK_ALERTS = [
    { id: 1, type: "warning", message: "Low Stock: Petrol 95 (Pump 3)", time: "10:23 AM" },
    { id: 2, type: "error", message: "Transaction Limit Reached: Attendant John", time: "09:45 AM" },
    { id: 3, type: "info", message: "System Update Scheduled for Midnight", time: "08:00 AM" },
  ];

  // -----------------------------
  // KEYPAD LOGIC
  // -----------------------------
  const amountString = String(amountPaid ?? "");
  const paid = parseFloat(amountString || "0");
  const change = paid > total ? paid - total : 0;

  const keypadKeys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    ".", "0", "backspace"
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
  // TAB STATE
  // -----------------------------
  const [activeTab, setActiveTab] = useState("keypad"); // "keypad" | "actions" | "pumps"

  // -----------------------------
  // UI STARTS HERE
  // -----------------------------
  return (
    <div className="w-[380px] bg-slate-900 border-l border-white/10 flex flex-col h-full shadow-2xl relative z-20">

      {/* 1. STATUS MONITOR */}
      <div className="bg-black/40 p-4 border-b border-white/5 shadow-inner shrink-0">
        <div className="flex justify-between items-end mb-1">
          <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Total Amount</span>
          {total > 0 && <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-white tracking-tight mb-2">
            <span className="text-2xl text-white/40 font-medium mr-1">ZMW</span>
            {total.toFixed(2)}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="text-left">
              <div className="text-xs text-white/40 uppercase font-bold">Paid</div>
              <div className="text-xl font-bold text-blue-400">
                {paid.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 uppercase font-bold">Change</div>
              <div className={change > 0 ? "text-xl font-bold text-emerald-400" : "text-xl font-bold text-white/20"}>
                {change.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB SWITCHER */}
      <div className="flex p-2 gap-2 bg-black/20 shrink-0">
        <button
          onClick={() => setActiveTab("keypad")}
          className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "keypad"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
        >
          Keypad
        </button>
        <button
          onClick={() => setActiveTab("actions")}
          className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "actions"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
        >
          Actions
        </button>
        <button
          onClick={() => setActiveTab("pumps")}
          className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === "pumps"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
        >
          Pumps
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto min-h-0">

        {/* KEYPAD VIEW */}
        {activeTab === "keypad" && (
          <div className="flex flex-col gap-3 h-full animate-in slide-in-from-left-4 duration-300">
            {/* Safe Drop (Quick Action) */}
            <Button
              onClick={() => openCashDrawer?.()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold h-14 shrink-0 rounded-xl text-lg shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all"
            >
              <Wallet className="w-5 h-5" />
              SAFE DROP
            </Button>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 flex-1">
              {keypadKeys.map((key) => {
                const isAction = key === "backspace";
                return (
                  <button
                    key={key}
                    onClick={() => handleKeypad(key)}
                    className={`
                                    relative overflow-hidden rounded-xl font-bold text-2xl transition-all active:scale-95 flex items-center justify-center shadow-sm border border-white/5
                                    ${isAction
                        ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20"
                        : "bg-white/5 hover:bg-white/10 text-white"
                      }
                                `}
                  >
                    {key === "backspace" ? <span className="text-xl">⌫</span> : key}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ACTIONS VIEW */}
        {activeTab === "actions" && (
          <div className="grid grid-cols-2 gap-3 h-full content-start animate-in slide-in-from-right-4 duration-300">
            {/* Refund */}
            <button
              onClick={() => openAuth("refund")}
              className="bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 rounded-xl h-24 flex flex-col items-center justify-center gap-2 text-red-500 active:scale-95 transition-all group"
            >
              <RotateCcw size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase">Refund</span>
            </button>

            {/* No Sale */}
            <button
              onClick={() => openAuth("nosale")}
              className="bg-slate-700/30 hover:bg-slate-700/50 border border-white/10 rounded-xl h-24 flex flex-col items-center justify-center gap-2 text-white/70 hover:text-white active:scale-95 transition-all group"
            >
              <Ban size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase">No Sale</span>
            </button>

            {/* Reprint */}
            <button
              onClick={() => printReceipt()}
              className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 rounded-xl h-24 flex flex-col items-center justify-center gap-2 text-blue-400 active:scale-95 transition-all group"
            >
              <Printer size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase">Reprint</span>
            </button>

            {/* Close Shift */}
            <button
              onClick={() => openAuth("closeshift")}
              className="bg-amber-600 hover:bg-amber-500 text-white border-none rounded-xl h-24 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-amber-900/20 group"
            >
              <Lock size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase">Close Shift</span>
            </button>

            {/* Alerts */}
            <button
              onClick={() => setAlertsOpen(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-24 flex flex-col items-center justify-center gap-2 text-white/70 hover:text-white active:scale-95 transition-all group"
            >
              <Bell size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase">Alerts</span>
              {MOCK_ALERTS.length > 0 &&
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              }
            </button>

            {/* Price */}
            <button
              onClick={() => printReceipt()}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-24 flex flex-col items-center justify-center gap-2 text-white/70 hover:text-white active:scale-95 transition-all group"
            >
              <Tag size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase">Price</span>
            </button>
          </div>
        )}

        {/* PUMPS VIEW */}
        {activeTab === "pumps" && (
          <div className="flex-1 overflow-y-auto min-h-0 animate-in slide-in-from-right-4 duration-300">
            <PumpsPage 
              initialPumps={pumps.length > 0 ? pumps : null} 
              onClearTransaction={onClearTransaction}
              darkMode={true}
            />
          </div>
        )}

      </div>

      {/* AUTH MODAL OVERLAY */}
      {authModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10">
            <h2 className="text-lg font-bold text-white mb-6 text-center border-b border-white/10 pb-4">
              {authModal.type === "closeshift" ? "Cashier Access" : "Manager Approval"}
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40">Username</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40">PIN Code</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter PIN"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <Button onClick={closeAuth} variant="outline" className="h-12 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleAuthSubmit} className="h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold">
                Authorize
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ALERTS MODAL OVERLAY */}
      {alertsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-lg h-auto max-h-[80vh] rounded-xl p-4 shadow-2xl border border-white/10 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="text-blue-500" />
                System Alerts
              </h2>
              <button onClick={() => setAlertsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
              {MOCK_ALERTS.map((alert) => (
                <div key={alert.id} className="bg-white/5 border border-white/5 rounded-lg p-4 flex gap-4 items-start">
                  <div className={`
                            p-2 rounded-full shrink-0
                            ${alert.type === "warning" ? "bg-amber-500/20 text-amber-500" : ""}
                            ${alert.type === "error" ? "bg-red-500/20 text-red-500" : ""}
                            ${alert.type === "info" ? "bg-blue-500/20 text-blue-500" : ""}
                        `}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">{alert.message}</h4>
                    <span className="text-white/40 text-xs">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <Button onClick={() => setAlertsOpen(false)} className="w-full bg-slate-700 hover:bg-slate-600">
                Close Alerts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
