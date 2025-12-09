import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Home from "@/pages/Home"; // LOGIN PAGE

// Frontdesk
import FrontdeskDashboard from "@/modules/frontdesk/screens/Dashboard";
import PumpsPage from "@/modules/frontdesk/screens/pumps/PumpsPage";
import PumpSimulator from "@/modules/frontdesk/screens/PumpSimulator";
import TanksPage from "@/modules/frontdesk/screens/Tanks";
import POSPage from "@/modules/frontdesk/screens/pos/Pos";
import ReportsPage from "@/modules/frontdesk/screens/Reports";
import ShiftsPage from "@/modules/frontdesk/screens/Shifts";
import TopNav from "@/modules/frontdesk/components/TopNav";

/* ---------- AUTH PROTECTION ---------- */
function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

/* ---------- FRONDESK LAYOUT ---------- */
function FrontdeskLayout() {
  const [selectedNav, setSelectedNav] = React.useState("dashboard");
  const status = { pts2: true, payment: true, network: true };
  const location = useLocation();
  const isPOS = location.pathname === "/frontdesk/pos";

  React.useEffect(() => {
    document.body.style.overflow = isPOS ? "hidden" : "auto";
  }, [isPOS]);

  return (
    <div
      className={
        isPOS
          ? "w-screen h-screen overflow-hidden bg-gray-50 dark:bg-slate-900"
          : "min-h-screen bg-gray-50 dark:bg-slate-900"
      }
    >
      {!isPOS && (
        <TopNav
          selectedNav={selectedNav}
          setSelectedNav={setSelectedNav}
          status={status}
        />
      )}

      <main
        className={
          isPOS
            ? "w-full h-full p-0 m-0 overflow-hidden"
            : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        }
      >
        <Outlet />
      </main>
    </div>
  );
}

/* ---------- MAIN ROUTES ---------- */
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE (Landing) */}
        <Route path="/" element={<Home />} />

        {/* FRONTDESK MODULE ONLY */}
        <Route
          path="/frontdesk"
          element={
            <PrivateRoute>
              <FrontdeskLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="pos" replace />} />
          <Route path="dashboard" element={<FrontdeskDashboard />} />
          <Route path="simulator" element={<PumpSimulator />} />
          <Route path="pumps" element={<PumpsPage />} />
          <Route path="tanks" element={<TanksPage />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="shifts" element={<ShiftsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={<div className="p-10 text-center text-red-600">404 - Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
