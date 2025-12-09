import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProductTable from "../components/products/ProductTable";
import ProductForm from "../components/products/ProductForm";
import AdjustmentDialog from "../components/products/AdjustmentDialog";
import { Plus } from "lucide-react";
import { stockApi } from "@/api/stock";
import { shopApi } from "@/api/shop";
import { useAuth } from "@/context/AuthContext";

export default function Products() {
  const { employee } = useAuth();
  const [products, setProducts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Adjustment State
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  useEffect(() => {
    loadProducts();
  }, [employee?.station_id]);

  const handleAddProduct = async (newProduct) => {
    if (!employee?.station_id) return;
    try {
      // API call to create product
      await shopApi.createProduct({
        ...newProduct,
        station_id: employee.station_id,
        price: parseFloat(newProduct.price),
        cost: parseFloat(newProduct.cost),
        stock_qty: parseFloat(newProduct.stock_qty || 0)
      });

      // Reload list
      await loadProducts();
      setFormOpen(false);
      // Optional: show success toast
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product: " + (error.message || "Unknown error"));
    }
  };

  const handleOpenAdjust = (product) => {
    setSelectedProduct(product);
    setAdjustOpen(true);
  };

  const handleSubmitAdjust = async (data) => {
    try {
      await stockApi.adjustStock(data);
      setAdjustOpen(false);
      setSelectedProduct(null);
      loadProducts(); // refresh
      alert("Stock adjusted successfully");
    } catch (error) {
      console.error("Adjustment failed:", error);
      alert("Failed to adjust stock");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Products</h1>
        <Button onClick={() => setFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading products...</div>
          ) : (
            <ProductTable products={products} onAdjust={handleOpenAdjust} />
          )}
        </CardContent>
      </Card>

      <ProductForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAddProduct} />

      <AdjustmentDialog
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        product={selectedProduct}
        onSubmit={handleSubmitAdjust}
      />
    </div>
  );
}

