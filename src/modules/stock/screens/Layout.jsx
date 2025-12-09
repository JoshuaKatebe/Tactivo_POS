import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopNav from "@/modules/frontdesk/components/TopNav";

export default function StockLayout() {
    const [selectedNav, setSelectedNav] = useState("stock");
    // Hardcoded status for now, or could fetch from a context
    const status = { pts2: true, payment: true, network: true };
    const location = useLocation();

    // Sync nav state with location
    useEffect(() => {
        if (location.pathname.includes("/stock")) {
            setSelectedNav("stock");
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <TopNav
                selectedNav={selectedNav}
                setSelectedNav={setSelectedNav}
                status={status}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    );
}

