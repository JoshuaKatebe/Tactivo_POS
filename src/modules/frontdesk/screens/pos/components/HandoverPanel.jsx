import { X, Search, Filter, Users, Fuel, Clock, DollarSign, ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Handover Panel
 * Displays all pending handovers with sorting and filtering options
 */
export default function HandoverPanel({
    isOpen,
    onClose,
    handovers = [],
    onQuickClear,
    onRefresh
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("handover_time");

    // Auto-refresh every 3 seconds when panel is open
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            onRefresh?.();
        }, 3000);

        return () => clearInterval(interval);
    }, [isOpen, onRefresh]);

    if (!isOpen) return null;

    // Filter handovers by search term
    const filteredHandovers = handovers.filter(h =>
        h.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.pump_number?.toString().includes(searchTerm)
    );

    // Sort handovers
    const sortedHandovers = [...filteredHandovers].sort((a, b) => {
        switch (sortBy) {
            case "employee_name":
                return (a.employee_name || "").localeCompare(b.employee_name || "");
            case "pump_number":
                return (a.pump_number || 0) - (b.pump_number || 0);
            case "transaction_count":
                return (b.transaction_count || 0) - (a.transaction_count || 0);
            case "amount":
                return parseFloat(b.amount_expected || 0) - parseFloat(a.amount_expected || 0);
            case "handover_time":
            default:
                return new Date(b.handover_time) - new Date(a.handover_time);
        }
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-orange-600/20 to-orange-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                            <Users size={24} className="text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Pending Handovers</h2>
                            <p className="text-sm text-white/60">
                                {sortedHandovers.length} handover{sortedHandovers.length !== 1 ? "s" : ""} waiting for clearance
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500 text-white/60 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search and Sort Bar */}
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search by attendant name or pump number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <ArrowUpDown size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="pl-10 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none cursor-pointer"
                            >
                                <option value="handover_time">Latest First</option>
                                <option value="employee_name">Attendant Name</option>
                                <option value="pump_number">Pump Number</option>
                                <option value="transaction_count">Transaction Count</option>
                                <option value="amount">Amount</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Handovers List */}
                <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-4">
                    {sortedHandovers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                                <Users size={40} className="text-white/20" />
                            </div>
                            <p className="text-lg font-bold text-white/40">
                                {searchTerm ? "No handovers match your search" : "No pending handovers"}
                            </p>
                            <p className="text-sm text-white/30 mt-1">
                                {searchTerm ? "Try adjusting your search terms" : "All handovers have been cleared"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {sortedHandovers.map((handover) => (
                                <HandoverCard
                                    key={handover.id}
                                    handover={handover}
                                    onQuickClear={() => onQuickClear(handover)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Individual Handover Card Component
 */
function HandoverCard({ handover, onQuickClear }) {
    const amount = parseFloat(handover.amount_expected || handover.total_amount || 0);
    const txCount = parseInt(handover.transaction_count || 0);
    const handoverTime = new Date(handover.handover_time);
    const timeAgo = getTimeAgo(handoverTime);

    return (
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-4 border border-white/10 hover:border-orange-500/50 transition-all group">
            <div className="flex items-center justify-between gap-4">

                {/* Left: Attendant Info */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {handover.employee_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <div className="flex-1">
                        <h3 className="text-base font-bold text-white mb-1">
                            {handover.employee_name || "Unknown Attendant"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1.5">
                                <Fuel size={14} className="text-blue-400" />
                                Pump {handover.pump_number || "N/A"}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-purple-400" />
                                {timeAgo}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle: Stats */}
                <div className="flex items-center gap-6">
                    {/* Transaction Count */}
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">
                            {txCount}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                            Transactions
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="text-center">
                        <div className="text-2xl font-black text-emerald-400 flex items-center gap-1">
                            <DollarSign size={20} className="text-emerald-400/60" />
                            {amount.toFixed(2)}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">
                            Expected
                        </div>
                    </div>
                </div>

                {/* Right: Quick Clear Button */}
                <button
                    onClick={onQuickClear}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105"
                >
                    Quick Clear
                </button>
            </div>
        </div>
    );
}

/**
 * Helper function to calculate time ago
 */
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
