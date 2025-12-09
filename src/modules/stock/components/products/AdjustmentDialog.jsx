import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X, Save } from "lucide-react";

export default function AdjustmentDialog({ open, onClose, product, onSubmit }) {
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when product changes
    React.useEffect(() => {
        if (open) {
            setQuantity("");
            setReason("");
            setIsSubmitting(false);
        }
    }, [open, product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!quantity || !reason) return;

        setIsSubmitting(true);
        await onSubmit({
            product_id: product.id,
            quantity: Number(quantity),
            reason
        });
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {open && product && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                    >
                        <Card className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle className="text-lg">Adjust Stock</CardTitle>
                                <button onClick={onClose}>
                                    <X className="w-5 h-5 text-slate-500 hover:text-red-500" />
                                </button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-4">
                                    <h3 className="font-medium text-slate-800 dark:text-white">{product.name}</h3>
                                    <div className="text-sm text-slate-500">Current Stock: {product.stock_qty}</div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-slate-500">Adjustment Qty</label>
                                        <Input
                                            type="number"
                                            placeholder="+10 or -5"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Use negative value to reduce stock</p>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold uppercase text-slate-500">Reason</label>
                                        <Input
                                            placeholder="e.g. Broken item, Audit correction"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSubmitting ? "Saving..." : "Save Adjustment"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

