import React from 'react';
import { Clock, DollarSign, Fuel, AlertCircle } from 'lucide-react';

export default function ShiftPanel({ shift, attendant, transactions = [], darkMode = false }) {
    // Ensure transactions is always an array
    const transactionsList = Array.isArray(transactions) ? transactions : [];

    if (!shift) {
        return (
            <div className={`${darkMode ? 'bg-amber-900/30 border-amber-700/50 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'} p-4 rounded-lg border flex items-center gap-3`}>
                <AlertCircle className="w-5 h-5" />
                <div>
                    <p className="font-semibold">No Active Shift</p>
                    <p className="text-sm opacity-80">Shift will be created automatically when you authorize a pump</p>
                </div>
            </div>
        );
    }

    const totalSales = transactionsList.reduce((sum, tx) => sum + (parseFloat(tx.total_amount || tx.amount || 0)), 0);
    const totalVolume = transactionsList.reduce((sum, tx) => sum + (parseFloat(tx.liters || tx.volume || 0)), 0);

    const startTime = new Date(shift.start_time).toLocaleString();
    const duration = shift.end_time
        ? `${Math.round((new Date(shift.end_time) - new Date(shift.start_time)) / (1000 * 60 * 60))} hours`
        : 'Ongoing';

    const cardClass = darkMode
        ? "bg-gradient-to-br from-emerald-900/30 to-green-900/20 rounded-xl border border-emerald-700/50 p-5 shadow-lg"
        : "bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-5 shadow-md";

    const textClass = darkMode ? 'text-white' : 'text-slate-900';
    const mutedTextClass = darkMode ? 'text-emerald-300' : 'text-emerald-700';
    const secondaryTextClass = darkMode ? 'text-slate-400' : 'text-slate-600';

    return (
        <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className={`text-lg font-bold ${textClass}`}>Active Shift</h3>
                    <p className={`text-sm ${secondaryTextClass}`}>
                        {attendant?.employee?.first_name} {attendant?.employee?.last_name}
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-emerald-600/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                    OPEN
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className={`w-4 h-4 ${mutedTextClass}`} />
                        <span className={`text-xs font-medium ${mutedTextClass}`}>Start Time</span>
                    </div>
                    <p className={`text-sm font-semibold ${textClass}`}>{startTime}</p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className={`w-4 h-4 ${mutedTextClass}`} />
                        <span className={`text-xs font-medium ${mutedTextClass}`}>Duration</span>
                    </div>
                    <p className={`text-sm font-semibold ${textClass}`}>{duration}</p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className={`w-4 h-4 ${mutedTextClass}`} />
                        <span className={`text-xs font-medium ${mutedTextClass}`}>Total Sales</span>
                    </div>
                    <p className={`text-sm font-semibold ${textClass}`}>ZMW {totalSales.toFixed(2)}</p>
                    <p className={`text-xs ${secondaryTextClass}`}>{transactionsList.length} transactions</p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Fuel className={`w-4 h-4 ${mutedTextClass}`} />
                        <span className={`text-xs font-medium ${mutedTextClass}`}>Fuel Dispensed</span>
                    </div>
                    <p className={`text-sm font-semibold ${textClass}`}>{totalVolume.toFixed(2)} L</p>
                </div>
            </div>

            {shift.opening_cash !== undefined && (
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-emerald-700/30' : 'border-emerald-200'}`}>
                    <p className={`text-xs ${secondaryTextClass}`}>
                        Opening Cash: <span className={`font-semibold ${textClass}`}>ZMW {parseFloat(shift.opening_cash || 0).toFixed(2)}</span>
                    </p>
                </div>
            )}
        </div>
    );
}
