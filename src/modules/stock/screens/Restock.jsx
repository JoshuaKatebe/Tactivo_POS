import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Trash, Check, Loader2 } from "lucide-react";
import { stockApi } from "@/api/stock";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner"; // or generic alert

export default function Restock() {
    const { employee } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [items, setItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadProducts = async () => {
            if (!employee?.station_id) return;
            try {
                setLoading(true);
                const res = await stockApi.getProducts({ station_id: employee.station_id });
                setProducts(res.data || res || []);
            } catch (error) {
                console.error("Failed to load products:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [employee?.station_id]);

    const handleAddItem = () => {
        if (!selectedProductId || !quantity || Number(quantity) <= 0) {
            alert("Please select a product and valid quantity");
            return;
        }

        const product = products.find((p) => p.id === selectedProductId);
        if (!product) return;

        const newItem = {
            product_id: product.id,
            name: product.name,
            sku: product.sku,
            quantity: Number(quantity),
        };

        setItems([...items, newItem]);
        // Reset form
        setSelectedProductId("");
        setQuantity("");
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (items.length === 0) return;
        if (!employee?.station_id) return;

        try {
            setIsSubmitting(true);
            await stockApi.stockIn({
                station_id: employee.station_id,
                items: items.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
                notes: "Manual stock in via web"
            });

            alert("Restock successful!");
            setItems([]);
        } catch (error) {
            console.error("Restock failed:", error);
            alert("Restock failed: " + (error.message || "Unknown error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Stock In (Restock)</h1>

            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Add Items to Manifest</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-sm font-medium mb-1 block">Product</label>
                            <select
                                className="w-full p-2 border rounded-md bg-transparent"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Select Product...</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} {p.sku ? `(${p.sku})` : ""} - Current: {p.stock_qty}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-32">
                            <label className="text-sm font-medium mb-1 block">Quantity</label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="0"
                                min="1"
                            />
                        </div>
                        <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {items.length > 0 && (
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Items to Restock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            {item.name} <span className="text-xs text-gray-400 block">{item.sku}</span>
                                        </TableCell>
                                        <TableCell className="text-right text-green-600 font-bold">
                                            +{item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700 text-white min-w-[150px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" /> Confirm Restock
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

