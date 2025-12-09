// CartPanel.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Cart panel - left column
 */
export default function CartPanel({
  cart = [],
  total = 0,
  removeItem,
  changeQty,
  clearCart,
  amountPaid,
  setAmountPaid,
  onCompletePayment,
}) {
  return (
    <Card className="bg-slate-800 border border-slate-600 shadow-md">
      <CardHeader>
        <CardTitle className="text-white font-semibold">Current Sale</CardTitle>
      </CardHeader>

      <CardContent className="text-white">
        {/* Cart items */}
        {cart.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No items in cart</div>
        ) : (
          <div className="overflow-x-auto max-h-64 mb-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="px-2 py-1">Code</th>
                  <th className="px-2 py-1">Date</th>
                  <th className="px-2 py-1">Qty</th>
                  <th className="px-2 py-1">Price</th>
                  <th className="px-2 py-1">Total</th>
                  <th className="px-2 py-1">Discount</th>
                  <th className="px-2 py-1">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((it) => (
                  <tr key={it.id} className="border-b border-slate-700">
                    <td className="px-2 py-1">{it.code || it.id}</td>
                    <td className="px-2 py-1">{it.date || new Date().toLocaleDateString()}</td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        min="1"
                        value={it.qty}
                        onChange={(e) => changeQty(it.id, Number(e.target.value))}
                        className="w-16 p-1 rounded bg-slate-900 text-white text-sm border border-slate-600"
                      />
                    </td>
                    <td className="px-2 py-1">ZMW {it.price.toFixed(2)}</td>
                    <td className="px-2 py-1">ZMW {(it.price * it.qty).toFixed(2)}</td>
                    <td className="px-2 py-1">
                      {it.discount ? `ZMW ${it.discount.toFixed(2)}` : "-"}
                    </td>
                    <td className="px-2 py-1">
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-300 text-sm">Total</span>
          <span className="text-xl font-bold text-white">
            ZMW {total.toFixed(2)}
          </span>
        </div>

        {/* Amount Paid */}
        <input
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          placeholder="Amount paid"
          className="w-full p-2 rounded bg-slate-900 text-white border border-slate-600 mb-4"
        />

        {/* Payment buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onCompletePayment("cash")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Pay (Cash)
          </Button>

          <Button
            onClick={() => onCompletePayment("card")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Pay (Card)
          </Button>

          <Button
            variant="outline"
            onClick={() => onCompletePayment("airtel")}
            className="bg-white text-slate-800 font-semibold"
          >
            Airtel
          </Button>

          <Button
            variant="outline"
            onClick={() => onCompletePayment("mtn")}
            className="bg-white text-slate-800 font-semibold"
          >
            MTN
          </Button>
        </div>

        {/* Utility buttons */}
        <div className="mt-4 flex gap-3">
          <Button
            variant="ghost"
            className="text-slate-300 hover:text-white"
            onClick={() => alert("Money drop (simulated)")}
          >
            Money Drop
          </Button>

          <Button
            variant="ghost"
            className="text-slate-300 hover:text-white"
            onClick={() => alert("Reprint last receipt (simulated)")}
          >
            Reprint
          </Button>
        </div>

        <Button
          variant="destructive"
          className="mt-5"
          onClick={() => clearCart()}
        >
          Cancel Sale
        </Button>
      </CardContent>
    </Card>
  );
}
