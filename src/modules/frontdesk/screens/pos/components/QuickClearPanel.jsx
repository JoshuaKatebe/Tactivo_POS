import { DollarSign, X } from "lucide-react";
import { useState, useEffect } from "react";
import { fuelTransactionsApi } from "@/api/fuel";

/**
 * Quick Clear Panel
 * Shows real-time pending fuel transactions grouped by employee
 * Allows cashiers to quickly clear individual transactions
 */
export default function QuickClearPanel({
    stationId,
    cashierEmployeeId,
    onShowToast,
}) {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [quickClearLoading, setQuickClearLoading] = useState(null);
    const [error, setError] = useState(null);

    // Poll for pending transactions every 3 seconds
    useEffect(() => {
        const fetchPendingTransactions = async () => {
            if (!stationId) return;

            try {
                const transactions = await fuelTransactionsApi.getPending({ station_id: stationId });
                setPendingTransactions(transactions || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching pending transactions:', err);
                setError(err.message);
            }
        };

        fetchPendingTransactions();
        const interval = setInterval(fetchPendingTransactions, 3000);
        return () => clearInterval(interval);
    }, [stationId]);

    // Group transactions by employee
    const employeeGroups = pendingTransactions.reduce((groups, tx) => {
        const employeeName = tx.authorized_by_name || tx.employee_name || "Unknown";

        if (!groups[employeeName]) {
            groups[employeeName] = {
                employeeName,
                employeeId: tx.authorized_by_employee_id,
                transactions: [],
                totalAmount: 0,
                totalCount: 0,
            };
        }

        groups[employeeName].transactions.push(tx);
        groups[employeeName].totalAmount += parseFloat(tx.amount || 0);
        groups[employeeName].totalCount += 1;

        return groups;
    }, {});

    const groupsArray = Object.values(employeeGroups).sort((a, b) => b.totalAmount - a.totalAmount);
    const totalPending = groupsArray.reduce((sum, g) => sum + g.totalAmount, 0);

    // Quick clear a transaction
    const handleQuickClear = async (transactionId) => {
        if (!cashierEmployeeId) {
            onShowToast?.('No cashier employee ID found', 'error');
            return;
        }

        setQuickClearLoading(transactionId);

        try {
            await fuelTransactionsApi.quickClear(transactionId, cashierEmployeeId);

            // Remove from local state immediately for instant feedback
            setPendingTransactions((prev) => prev.filter((tx) => tx.id !== transactionId));

            onShowToast?.('Transaction cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing transaction:', error);
            onShowToast?.(`Failed to clear transaction: ${error.message || 'Unknown error'}`, 'error');
        } finally {
            setQuickClearLoading(null);
        }
    };

    return (
        <div className="mb-4 bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign size={20} />
                    Quick Clear
                </h3>
                <div className="text-white text-right">
                    <div className="text-xs font-medium opacity-90">Total Pending</div>
                    <div className="text-xl font-black">ZMW {totalPending.toFixed(2)}</div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-red-700 text-sm">
                    Error loading transactions: {error}
                </div>
            )}

            {/* Empty State */}
            {groupsArray.length === 0 && !error && (
                <div className="px-4 py-8 text-center text-gray-500">
                    No pending transactions
                </div>
            )}

            {/* Employee Groups */}
            {groupsArray.length > 0 && (
                <div className="max-h-64 overflow-y-auto">
                    {groupsArray.map((group) => (
                        <div key={group.employeeName} className="border-b border-gray-100 last:border-0">
                            {/* Employee Header */}
                            <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                        {group.employeeName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{group.employeeName}</div>
                                        <div className="text-xs text-gray-500">
                                            {group.totalCount} transaction{group.totalCount !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-orange-600">ZMW {group.totalAmount.toFixed(2)}</div>
                                </div>
                            </div>

                            {/* Transactions List */}
                            <div className="px-4 py-2 space-y-2">
                                {group.transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="font-medium text-blue-600">Pump {tx.pump_number}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-600">{parseFloat(tx.volume || 0).toFixed(2)}L</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-500 text-xs">
                                                    {new Date(tx.transaction_datetime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900 mt-1">
                                                ZMW {parseFloat(tx.amount || 0).toFixed(2)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleQuickClear(tx.id)}
                                            disabled={quickClearLoading === tx.id}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {quickClearLoading === tx.id ? 'Clearing...' : 'CLEAR'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
