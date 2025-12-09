import { X, DollarSign, CreditCard, Smartphone, Users, Clock, Fuel, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Handover Clear Modal
 * Allows cashiers to clear a handover with payment method breakdown
 */
export default function HandoverClearModal({
    isOpen,
    onClose,
    handover,
    transactions = [],
    onConfirm,
    loading = false,
}) {
    const [paymentMethods, setPaymentMethods] = useState({
        cash: "",
        card: "",
        airtel_money: "",
        mtn_money: "",
        zamtel_money: "",
    });
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({});

    const expectedAmount = parseFloat(handover?.amount_expected || handover?.total_amount || 0);

    // Calculate total amount cashed from all payment methods
    const amountCashed = Object.values(paymentMethods).reduce((sum, value) => {
        const num = parseFloat(value || 0);
        return sum + (isNaN(num) ? 0 : num);
    }, 0);

    // Calculate difference (positive = over, negative = short)
    const difference = amountCashed - expectedAmount;

    // Auto-fill cash with expected amount on open
    useEffect(() => {
        if (isOpen && expectedAmount > 0) {
            setPaymentMethods({
                cash: expectedAmount.toFixed(2),
                card: "",
                airtel_money: "",
                mtn_money: "",
                zamtel_money: "",
            });
            setNotes("");
            setErrors({});
        }
    }, [isOpen, expectedAmount]);

    const handlePaymentMethodChange = (method, value) => {
        // Allow only numbers and decimal point
        if (value && !/^\d*\.?\d{0,2}$/.test(value)) return;

        setPaymentMethods((prev) => ({
            ...prev,
            [method]: value,
        }));

        // Clear error for this field
        if (errors[method]) {
            setErrors((prev) => ({ ...prev, [method]: null }));
        }
    };

    const handleConfirm = () => {
        // Validation
        const newErrors = {};

        if (amountCashed === 0) {
            newErrors.general = "Please enter payment amounts";
            setErrors(newErrors);
            return;
        }

        // Filter out empty payment methods and convert to numbers
        const filteredPaymentMethods = {};
        Object.entries(paymentMethods).forEach(([key, value]) => {
            const num = parseFloat(value || 0);
            if (num > 0) {
                filteredPaymentMethods[key] = num;
            }
        });

        onConfirm({
            payment_methods: filteredPaymentMethods,
            amount_cashed: amountCashed,
            notes: notes.trim(),
        });
    };

    if (!isOpen || !handover) return null;

    const txCount = parseInt(handover.transaction_count || transactions.length || 0);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-orange-600/20 to-orange-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                            <DollarSign size={24} className="text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Clear Handover</h2>
                            <p className="text-sm text-white/60">
                                {handover.employee_name} • Pump {handover.pump_number || "N/A"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500 text-white/60 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Summary Section */}
                    <div className="p-6 border-b border-white/10 bg-white/5">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-3xl font-black text-emerald-400">
                                    ZMW {expectedAmount.toFixed(2)}
                                </div>
                                <div className="text-xs uppercase font-bold text-white/50 mt-1 tracking-wider">
                                    Expected Amount
                                </div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-3xl font-black text-blue-400">
                                    {txCount}
                                </div>
                                <div className="text-xs uppercase font-bold text-white/50 mt-1 tracking-wider">
                                    Transactions
                                </div>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="text-3xl font-black text-purple-400">
                                    {new Date(handover.handover_time).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <div className="text-xs uppercase font-bold text-white/50 mt-1 tracking-wider">
                                    Handover Time
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Section */}
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">
                            Payment Method Breakdown
                        </h3>

                        {errors.general && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                <AlertCircle size={16} />
                                {errors.general}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {/* Cash */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} className="text-emerald-400" />
                                        Cash
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={paymentMethods.cash}
                                    onChange={(e) => handlePaymentMethodChange("cash", e.target.value)}
                                    placeholder="0.00"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 disabled:opacity-50"
                                />
                            </div>

                            {/* Card */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={16} className="text-blue-400" />
                                        Card
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={paymentMethods.card}
                                    onChange={(e) => handlePaymentMethodChange("card", e.target.value)}
                                    placeholder="0.00"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 disabled:opacity-50"
                                />
                            </div>

                            {/* Airtel Money */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Smartphone size={16} className="text-orange-400" />
                                        Airtel Money
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={paymentMethods.airtel_money}
                                    onChange={(e) => handlePaymentMethodChange("airtel_money", e.target.value)}
                                    placeholder="0.00"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 disabled:opacity-50"
                                />
                            </div>

                            {/* MTN Money */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Smartphone size={16} className="text-yellow-400" />
                                        MTN Money
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={paymentMethods.mtn_money}
                                    onChange={(e) => handlePaymentMethodChange("mtn_money", e.target.value)}
                                    placeholder="0.00"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 disabled:opacity-50"
                                />
                            </div>

                            {/* Zamtel Money */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Smartphone size={16} className="text-purple-400" />
                                        Zamtel Money
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={paymentMethods.zamtel_money}
                                    onChange={(e) => handlePaymentMethodChange("zamtel_money", e.target.value)}
                                    placeholder="0.00"
                                    disabled={loading}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Amount Summary */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-white/70">Amount Cashed:</span>
                                <span className="text-lg font-bold text-white">
                                    ZMW {amountCashed.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white/70">Difference:</span>
                                <span className={cn(
                                    "text-lg font-bold flex items-center gap-1",
                                    difference === 0 ? "text-emerald-400" :
                                        difference > 0 ? "text-blue-400" :
                                            "text-red-400"
                                )}>
                                    {difference === 0 ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Perfect
                                        </>
                                    ) : difference > 0 ? (
                                        `+ZMW ${difference.toFixed(2)}`
                                    ) : (
                                        `-ZMW ${Math.abs(difference).toFixed(2)}`
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Transactions List */}
                    {transactions.length > 0 && (
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-4">
                                Linked Transactions ({transactions.length})
                            </h3>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {transactions.map((tx, idx) => (
                                    <div
                                        key={tx.id || idx}
                                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="text-white/80">
                                                    Nozzle {tx.nozzle || tx.nozzle_number || "N/A"}
                                                </div>
                                                <div className="text-white/40 text-xs">
                                                    {tx.volume || tx.liters || 0}L
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-bold">
                                                ZMW {parseFloat(tx.amount || tx.total_amount || 0).toFixed(2)}
                                            </div>
                                            <div className="text-white/40 text-xs">
                                                {tx.transaction_datetime ? new Date(tx.transaction_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes Section */}
                    <div className="p-6">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes about this handover..."
                            rows={3}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-white/5">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || amountCashed === 0}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold uppercase tracking-wider shadow-lg hover:shadow-orange-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? "Processing..." : "Confirm Clearance"}
                    </button>
                </div>
            </div>
        </div>
    );
}
