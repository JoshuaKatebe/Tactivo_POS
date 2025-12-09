import React, { useState, useMemo } from "react";
import { X, CheckCircle, Clock, History, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AttendantDetailsModal({ attendant, pumps, onClose, onClear }) {
    const [activeTab, setActiveTab] = useState("pending"); // "pending" | "cleared"

    // Aggregate all transactions for this attendant across all pumps
    const transactions = useMemo(() => {
        return pumps.flatMap((pump) => {
            return (pump.transactions || [])
                .filter((t) => t.attendant === attendant)
                .map((t) => ({
                    ...t,
                    pumpName: pump.name,
                    pumpId: pump.id,
                    // If no explicit status, assume pending if not cleared, or default logic
                    status: t.status || "pending",
                }));
        }).sort((a, b) => {
            // Sort by time descending (assuming time is a string or timestamp, simplistic sort)
            // For a real app, parse the time properly.
            return b.id - a.id;
        });
    }, [pumps, attendant]);

    const displayedTransactions = useMemo(() => {
        return transactions.filter(t => t.status === activeTab);
    }, [transactions, activeTab]);

    const totalAmount = useMemo(() => {
        return displayedTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    }, [displayedTransactions]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100">

                {/* Header */}
                <div className="bg-white border-b p-6 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                            <span className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
                                {attendant.charAt(0).toUpperCase()}
                            </span>
                            {attendant}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Transaction History & Clearance</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Amount Summary Banner */}
                <div className="bg-slate-50/50 border-b p-4 flex items-center justify-between">
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                activeTab === "pending"
                                    ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                        >
                            <Clock size={16} />
                            Pending Sales
                            <span className={cn("ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold", activeTab === "pending" ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-600")}>
                                {transactions.filter(t => t.status === "pending").length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("cleared")}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                activeTab === "cleared"
                                    ? "bg-white text-green-700 shadow-sm border border-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                        >
                            <History size={16} />
                            Cleared History
                            <span className={cn("ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold", activeTab === "cleared" ? "bg-green-50 text-green-600" : "bg-slate-200 text-slate-600")}>
                                {transactions.filter(t => t.status === "cleared").length}
                            </span>
                        </button>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase font-semibold">Total {activeTab}</div>
                        <div className={cn("text-2xl font-bold tracking-tight", activeTab === "pending" ? "text-amber-600" : "text-slate-700")}>
                            ZMW {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3 custom-scrollbar">
                    {displayedTransactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                            <Filter size={48} className="mb-3 opacity-20" />
                            <p>No {activeTab} transactions found for {attendant}</p>
                        </div>
                    ) : (
                        displayedTransactions.map((tx) => (
                            <div
                                key={`${tx.pumpId}-${tx.id}`}
                                className="bg-white border border-slate-200/60 hover:border-blue-300 transition-all p-4 rounded-xl shadow-sm flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white",
                                        activeTab === "pending" ? "bg-amber-500" : "bg-slate-400"
                                    )}>
                                        {tx.nozzle}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{tx.pumpName} <span className="text-slate-400 text-xs font-normal">• Nozzle {tx.nozzle}</span></h4>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {tx.time}</span>
                                            <span>•</span>
                                            <span>{Number(tx.volume ?? tx.liters ?? 0).toFixed(2)} L</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="font-bold text-lg text-slate-800">ZMW {Number(tx.amount).toFixed(2)}</div>
                                        <div className={cn("text-xs font-medium uppercase", activeTab === "pending" ? "text-amber-600" : "text-green-600")}>
                                            {tx.status}
                                        </div>
                                    </div>

                                    {activeTab === "pending" && (
                                        <button
                                            onClick={() => onClear(tx.amount, attendant, { id: tx.pumpId, name: tx.pumpName }, [tx.id])}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} />
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Actions (Only for Pending) */}
                {activeTab === "pending" && displayedTransactions.length > 0 && (
                    <div className="p-4 bg-white border-t flex justify-end gap-3 z-10">
                        <button
                            onClick={() => {
                                // Gather all filtered IDs and total amount
                                const allIds = displayedTransactions.map(t => t.id);
                                // For multi-pump clear, we might need a more robust handler from parent, 
                                // but sticking to the loop or single bulk action depending on how backend handles it.
                                // Ideally, we group by pump and call onClear for each pump, or the parent handles mixed pumps.
                                // Assuming purely visual grouping for now, let's just clear item by item or pass a bulk object if API supported.
                                // Given `onClear` signature: (amount, attendant, pump, ids)
                                // It seems designed for single pump. Let's do a bulk strategy:

                                // We will group by pumpID and call distinct clears.
                                const byPump = {};
                                displayedTransactions.forEach(t => {
                                    if (!byPump[t.pumpId]) byPump[t.pumpId] = { amount: 0, ids: [], name: t.pumpName };
                                    byPump[t.pumpId].amount += t.amount;
                                    byPump[t.pumpId].ids.push(t.id);
                                });

                                Object.entries(byPump).forEach(([pumpId, data]) => {
                                    onClear(data.amount, attendant, { id: pumpId, name: data.name }, data.ids);
                                });
                            }}
                            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <CheckCircle size={18} />
                            Clear All ({displayedTransactions.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
