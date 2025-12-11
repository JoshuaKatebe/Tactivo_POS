import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Monitor, ShieldCheck, Wifi, Battery, Command, User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";

/* ================= COMPONENT: CLOCK ================= */
function SystemClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-end leading-tight select-none">
      <span className="text-sm font-semibold text-white/90">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="text-[10px] text-white/70 uppercase font-medium tracking-wider">
        {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ====================== STATE ====================== */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Back Office Modal
  const [showBackofficeAuth, setShowBackofficeAuth] = useState(false);
  const [boUser, setBoUser] = useState("");
  const [boPass, setBoPass] = useState("");
  const [boLoading, setBoLoading] = useState(false);
  const [boShake, setBoShake] = useState(false);

  // Alert
  const [alert, setAlert] = useState({ visible: false, variant: "default", title: "", desc: "" });

  const showTempAlert = (variant, title, desc = "") => {
    setAlert({ visible: true, variant, title, desc });
    setTimeout(() => setAlert((a) => ({ ...a, visible: false })), 2500);
  };

  /* ====================== HANDLERS ====================== */
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Small delay for UX consistency
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Call the API login function
      const response = await login(username, password);

      showTempAlert("default", "Login Successful", "Redirecting...");

      // Determine role-based redirect
      const roles = response?.employee?.roles || [];
      const isManager = roles.some(r => r.name === "Manager" || r.name === "Store Manager");

      const targetPath = isManager ? "/frontdesk/dashboard" : "/frontdesk/pos";

      // Redirect
      setTimeout(() => navigate(targetPath, { replace: true }), 600);
    } catch (err) {
      showTempAlert("destructive", "Authentication Failed", err?.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  const handleBackofficeLogin = async (e) => {
    if (e) e.preventDefault();
    if (boLoading) return;
    setBoLoading(true);

    try {
      // Small delay for UX consistency
      await new Promise((r) => setTimeout(r, 400));

      // Call the API login function
      const response = await login(boUser, boPass);

      // Check if user has manager/admin role
      const roles = response?.employee?.roles || [];
      const hasManagerRole = roles.some(r => r.name === "Manager" || r.name === "Store Manager");

      if (hasManagerRole) {
        showTempAlert("default", "Access Granted", "Redirecting to dashboard...");
        setTimeout(() => navigate("/frontdesk/dashboard", { replace: true }), 600);
      } else {
        setBoShake(true);
        setTimeout(() => setBoShake(false), 500);
        showTempAlert("destructive", "Access Denied", "User does not have Manager privileges");
        setBoLoading(false);
      }
    } catch (err) {
      setBoShake(true);
      setTimeout(() => setBoShake(false), 500);
      showTempAlert("destructive", "Access Denied", err?.message || "Invalid credentials");
      setBoLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center overflow-hidden relative font-sans selection:bg-blue-500/30">
      {/* Dark Overlay with blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* ================== DESKTOP STATUS BAR ================== */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 z-50 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-white/80 tracking-widest uppercase">
            <Command size={14} className="text-blue-400" />
            Tactivo Z360 Fuel POS
          </span>
          <div className="h-3 w-px bg-white/20 mx-1" />
          <span className="text-xs text-white/60">POS Terminal 01</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 text-white/70">
            <Wifi size={14} />
            <Battery size={14} />
          </div>
          <SystemClock />
        </div>
      </div>

      {/* ================== MAIN DESKTOP AREA ================== */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-16 min-h-screen p-4">

        {/* ALERT TOAST */}
        <AnimatePresence>
          {alert.visible && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-20 z-[100]"
            >
              <div className={`
                            px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border border-white/20 text-white min-w-[320px]
                            ${alert.variant === 'destructive' ? 'bg-red-500/80' : 'bg-emerald-600/80'}
                         `}>
                <h4 className="font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                  {alert.variant === 'destructive' ? <ShieldCheck size={16} /> : <Monitor size={16} />}
                  {alert.title}
                </h4>
                <p className="text-white/90 text-sm mt-1">{alert.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGIN WINDOW */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[900px] h-[550px] rounded-2xl shadow-2xl overflow-hidden flex bg-slate-900/60 backdrop-blur-2xl border border-white/10 relative group"
        >
          {/* Left Side: Brand / Visual */}
          <div className="w-5/12 bg-gradient-to-br from-blue-600/80 to-purple-600/80 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-lg">
                <Monitor className="text-white w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Z360 Fuel POS</h1>
              <p className="text-blue-100 text-lg mt-2 font-light">Advanced Fuel POS</p>
            </div>

            <div className="relative z-10 text-white/60 text-xs">
              <p>© 2025 Tactivo Systems</p>
              <p className="mt-1">Version 1.0. (Stable)</p>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="flex-1 p-10 pb-32 flex flex-col justify-center relative bg-white/5">
            <div className="max-w-xs mx-auto w-full">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-white/10 mx-auto mb-4 flex items-center justify-center shadow-2xl">
                  <User size={32} className="text-white/50" />
                </div>
                <h2 className="text-white/90 font-medium text-lg">Cashier Login</h2>
                <p className="text-white/40 text-sm">Please identify yourself</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-white/50 uppercase font-bold tracking-wider ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                      placeholder="admin"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-white/50 uppercase font-bold tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-white/40 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                      placeholder="password123"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-lg shadow-blue-900/40 transition-all mt-4"
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-8">
              <button onClick={() => setShowBackofficeAuth(true)} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 shadow-sm">
                  <Monitor size={20} className="text-white/60 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white/80 tracking-wide transition-colors">Back Office</span>
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to shut down the system?")) {
                    document.body.innerHTML = "<div style='background:black;height:100vh;width:100vw;cursor:none;display:flex;align-items:center;justify-content:center;color:#333;font-family:monospace'>SYSTEM HALTED</div>";
                    setTimeout(() => window.close(), 1000);
                  }
                }}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5 shadow-sm">
                  <LogOut size={20} className="text-white/60 group-hover:text-red-400 transition-colors" />
                </div>
                <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-red-400/80 tracking-wide transition-colors">Shutdown</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================== SYSTEM MODAL (BACK OFFICE) ================== */}
      <AnimatePresence>
        {showBackofficeAuth && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            {/* Click outside to close (optional, but good UX) */}
            <div className="absolute inset-0" onClick={() => setShowBackofficeAuth(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`
                            relative w-full max-w-sm bg-[#1e293b] rounded-xl shadow-2xl border border-white/10 overflow-hidden
                            ${boShake ? "animate-shake" : ""}
                        `}
            >
              {/* Header */}
              <div className="bg-slate-950 p-4 border-b border-white/5 flex items-center gap-3">
                <ShieldCheck className="text-amber-500 w-5 h-5" />
                <span className="text-sm font-bold text-white tracking-wide">SYSTEM ADMINISTRATOR</span>
              </div>

              <div className="p-6">
                <p className="text-white/70 text-sm mb-5 leading-relaxed">
                  This action requires elevated privileges. Please enter your administrator credentials.
                </p>

                <form onSubmit={handleBackofficeLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Admin ID</label>
                    <input
                      type="text"
                      autoFocus
                      value={boUser}
                      onChange={(e) => setBoUser(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-amber-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Passcode</label>
                    <input
                      type="password"
                      value={boPass}
                      onChange={(e) => setBoPass(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:border-amber-500/50 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBackofficeAuth(false)}
                      className="flex-1 py-2 text-xs font-bold text-white/60 hover:bg-white/5 rounded-md transition-colors"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={boLoading}
                      className="flex-[2] py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-md shadow-lg transition-colors"
                    >
                      {boLoading ? "VERIFYING..." : "AUTHORIZE"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
