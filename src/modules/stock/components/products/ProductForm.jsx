import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

export default function ProductForm({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    price: "",
    cost: "",
    stock_qty: "",
    unit: "pcs",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <Card className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-lg font-semibold">
                  Add New Product
                </CardTitle>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="sku"
                    placeholder="SKU"
                    value={formData.sku}
                    onChange={handleChange}
                  />
                  <div className="flex gap-2">
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="Selling Price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="cost"
                      type="number"
                      step="0.01"
                      placeholder="Cost Price"
                      value={formData.cost}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      name="stock_qty"
                      type="number"
                      placeholder="Stock Quantity"
                      value={formData.stock_qty}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="unit"
                      placeholder="Unit (pcs, box, etc)"
                      value={formData.unit}
                      onChange={handleChange}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Product
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

